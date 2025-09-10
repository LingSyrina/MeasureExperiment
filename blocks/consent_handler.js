// Function to get URL parameters
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

// Generate Subject ID and add properties
function setupSubjectID(jsPsych) {
    var SONAID = getUrlParameter('id');
    var subjectID = SONAID;
    if (subjectID === undefined) {
        subjectID = jsPsych.randomization.randomID(8);
    }
    jsPsych.data.addProperties({ subject_id: subjectID });
    return subjectID;
}

// Check Consent Function
function checkConsent(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    } else {
        alert("Please check the box next to the statement 'I agree to participate in this study.' if you wish to continue.");
        return false;
    }
}

// Create Consent Trial
function createConsentTrial() {
    return {
        type: jsPsychExternalHtml,
        // url: "https://lingsyrina.github.io/consent.html", // old URL
        url: "https://lingsyrina.github.io/MagnitudeExperiments/consent.html", //updated consent html
        cont_btn: "start",
        check_fn: checkConsent
    };
}

// const expID = "iPtLEVGIdxPA";
// let condition;
// let group_name;

// function saveServerData(expID, subjectID, group_name, condition) {
//     return {
//         type: jsPsychPipe,
//         action: "save",
//         experiment_id: expID,
//         filename: () => `${group_name}_${subjectID}_${condition}.csv`,
//         data_string: ()=>jsPsych.data.get().csv(),
//         on_start: () => { jsPsych.setProgressBar(1);
//           console.log("CSV length (chars):", jsPsych.data.get().csv().length);
//           },
//         // post_trial_gap: 2000
//     };
// }
function saveServerData(expID, subjectID, group_name, condition) {
  // Small helper to make a filename that avoids weird chars & duplicates
  const safe = (s) => String(s).replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 80);
  const baseName = `${safe(group_name)}_${safe(subjectID)}_${safe(condition)}`;
  const filename = () => `${baseName}_${Date.now()}.csv`; // prevent accidental overwrite

  // max 4 attempts: ~0s, 1s, 2s, 4s (jittered) if server says no
  const MAX_RETRIES = 4;

  return {
    type: jsPsychPipe,
    action: "save",
    experiment_id: expID,
    filename: filename,
    data_string: () => {
      const csv = jsPsych.data.get().csv();
      const kb = csv.length / 1024;
      const mb = kb / 1024;
      console.log(`[saveServerData] Upload size: ${csv.length} chars (${kb.toFixed(1)} KB, ${mb.toFixed(2)} MB)`);
      return csv;
    },

    // We’ll override display to center a “saving” screen and manage retries
    on_start: () => {
      jsPsych.setProgressBar(1);

      // Center the progress bar & message
      const pb = document.querySelector('.jspsych-progressbar-container');
      if (pb) {
        pb.dataset.prevStyle = pb.getAttribute('style') || '';
        Object.assign(pb.style, {
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%', maxWidth: '600px', zIndex: '9999',
          background: 'transparent'
        });
      }

      const msg = document.createElement('div');
      msg.id = 'saving-msg';
      Object.assign(msg.style, {
        position: 'fixed', top: 'calc(50% + 60px)', left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center',
        zIndex: '10000', fontFamily: 'inherit'
      });
      msg.innerHTML = `<p>Saving your data to OSF… please wait.</p>`;
      document.body.appendChild(msg);
    },

    // IMPORTANT: jsPsychPipe normally advances when its internal request resolves.
    // We’ll intercept the trial end to add logging and retry logic if needed.
    on_finish: (trialData) => {
      // Restore UI
      const pb = document.querySelector('.jspsych-progressbar-container');
      if (pb) {
        pb.setAttribute('style', pb.dataset.prevStyle || '');
        delete pb.dataset.prevStyle;
      }
      const msg = document.getElementById('saving-msg');
      if (msg) msg.remove();

      // Log what the server said
      console.log('[saveServerData] Pipe response:', trialData);

      // If success, we’re done.
      if (trialData.success) return;

      // Otherwise, we’ll replace this trial’s outcome with a controlled retry screen
      // (so we don’t move forward to the redirect and lose the data).
      const errorMessage = trialData.message || 'Unknown error';
      console.warn('[saveServerData] Initial save failed:', errorMessage);

      // Stash the CSV so we can re-attempt without recomputing
      const csvCached = jsPsych.data.get().csv();

      // Build a retry screen trial
      const retryTrial = {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        stimulus: `
          <div style="max-width:680px;margin:40px auto;text-align:center">
            <h3>We’re trying to save your data…</h3>
            <p>There was a temporary issue: <code>${errorMessage}</code></p>
            <p>We will automatically retry in a moment. Please keep this tab open.</p>
            <div id="retry-status" style="margin-top:16px;font-size:0.95em;color:#555"></div>
            <button id="retry-now" class="jspsych-btn" style="margin-top:16px">Retry now</button>
          </div>
        `,
        on_load: () => {
          const status = document.getElementById('retry-status');
          const btn = document.getElementById('retry-now');

          let attempt = 1;

          const attemptSave = async () => {
            const wait = Math.min(4000, (2 ** (attempt - 1)) * 1000);
            const jitter = Math.floor(Math.random() * 300);
            if (attempt > 1) {
              status.textContent = `Retry attempt ${attempt}/${MAX_RETRIES}…`;
            }

            // Manually POST via Pipe endpoint used by the plugin (same payload shape)
            // We leverage the same trial type again to avoid re-implementing the network call.
            const manualPipe = {
              type: jsPsychPipe,
              action: "save",
              experiment_id: expID,
              filename: filename,                // new timestamped filename each retry
              data_string: () => csvCached
            };

            // Run this as a nested mini-timeline to await result
            let lastData = null;
            await jsPsych.run([{
              ...manualPipe,
              on_finish: (d) => { lastData = d; }
            }]);

            console.log(`[saveServerData] Retry ${attempt} response:`, lastData);
            if (lastData && lastData.success) {
              jsPsych.finishTrial(); // proceed out of the retry screen
              return;
            }

            attempt++;
            if (attempt > MAX_RETRIES) {
              status.innerHTML = `All retries failed. Please <b>do not close</b> this tab and contact the researcher.<br>
                Error: <code>${(lastData && lastData.message) || 'Unknown'}</code>`;
              btn.disabled = false;
              return;
            }

            // Schedule next attempt
            setTimeout(attemptSave, wait + jitter);
          };

          btn.addEventListener('click', () => {
            btn.disabled = true;
            status.textContent = 'Retrying now…';
            attemptSave();
          });

          // Start first retry automatically
          btn.disabled = true;
          attemptSave();
        }
      };

      // Replace the next trial with our retry screen by injecting into the timeline dynamically
      jsPsych.timelineVariable = jsPsych.timelineVariable || (() => null); // guard
      jsPsych.addNodeToEndOfTimeline({ timeline: [retryTrial] }, () => {
        // Once retryTrial exits (on success), the experiment continues as normal
      });
    },

    post_trial_gap: 0
  };
}
