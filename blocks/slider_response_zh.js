function createLoopedSliderPair(stim, createTrialA, createTrialB, prompts, pair=false) {
    return {
        timeline: [
            prompts.fixation,  // Short fixation before button
            (pair === true ? prompts.pausePair : prompts.pause),
            { timeline: [createTrialA(), feedback],
              timeline_variables: [stim], // Pass individual stimulus as timeline variable
              loop_function: function (data) {
                return !data.values()[0].correct; // Continue looping if the response was incorrect
            }},
            prompts.fixationLong,  // Long fixation between button and slider (promotes verbal encoding)
            { timeline: [createTrialB()],
              timeline_variables: [stim], // Pass individual stimulus as timeline variable
            }
          ],
        }}

function GetSlider(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasSliderResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      const condition = jsPsych.timelineVariable('condition'); // governs reference order
      await Morphfunction({ canvas: c, par: radius, rand: rand, condition: condition, method: method });
      return c;
    },
    canvas_size: [250,600],
    slider_width: 500,
    prompt: jsPsych.timelineVariable('prompt'),
    response_ends_trial: true,
    require_movement: true,
    labels: jsPsych.timelineVariable('reflabel'),
    button_label: '继续',
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      condition: () => jsPsych.timelineVariable('condition'),
      // For pre_slider: condition controls visual ref order (0=AB, 1=BA)
      reforder: () => jsPsych.timelineVariable('condition') === 0 ? 'AB' : 'BA'
    },
    on_finish: function() {
        var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
        jsPsych.setProgressBar(curr_progress_bar_value + (1/totaltrial));
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      prompts.pause,
      createTrial(),
    ],
    timeline_variables: [stim], // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline,
  };
};

function GetPostLearnSlider(prompts, block_stimuli, task_name) {
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);

  const createCanvasOnlyTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function (c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      const condition = Math.random() < 0.5 ? 0 : 1;
      await Morphfunction({ canvas: c, par: radius, rand: rand, condition: condition, method: method });
      const dataURL = canvas.toDataURL();
      return c;
    },
    canvas_size: [250,600],
    choices: "NO_KEYS",
    trial_duration: 3000,
  });

  const createSliderOnlyTrial = () => ({
    type: jsPsychHtmlSliderResponse,
    stimulus: '', // no image or canvas
    prompt: jsPsych.timelineVariable('prompt'),
    labels: jsPsych.timelineVariable('reflabel'),
    require_movement: true,
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      condition: () => jsPsych.timelineVariable('condition')
    }
  });

  const postLearnTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      prompts.pause,
      createCanvasOnlyTrial(),
      createSliderOnlyTrial()
    ],
    timeline_variables: [stim],
  }));

  return {
    timeline: postLearnTimeline,
  };
};

function GetCombinedSlider(prompts, block_stimuli, task_name) {
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);

  const createCanvasOnlyTrial = () => ({
    type: jsPsychCanvasButtonResponse,
    canvas_size: [250,600],
    stimulus: async function (c) {
      // console.log(jsPsych.timelineVariable('order'), jsPsych.timelineVariable('truelabel'));
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      // const condition = Math.random() < 0.5 ? 0 : 1;
      const condition = jsPsych.timelineVariable('condition');
      await Morphfunction({ canvas: c, par: radius, rand: rand, condition: condition, method: method });
      // const dataURL = canvas.toDataURL();
      return c;
    },
    on_start: function() {
      const container = jsPsych.getDisplayElement();
      container.innerHTML = ''; // Clear previous content
    },
    on_load: function() { // Move prompt div below canvas, before buttons
      const canvas = document.querySelector('canvas');
      const prompt = document.createElement('div');
      prompt.innerHTML = jsPsych.timelineVariable('prompt');
      prompt.style.textAlign = 'center';
      prompt.style.marginTop = '20px';
      canvas.insertAdjacentElement('afterend', prompt); // Insert the prompt after the canvas
    },
    choices: jsPsych.timelineVariable('order'),
    prompt: "",
    response_ends_trial: true,
    data: {
      task: `ButtonforSlider`,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      order:() => jsPsych.timelineVariable('order'),
      key: () => jsPsych.timelineVariable('key'),
      truelabel:() => jsPsych.timelineVariable('truelabel'),
      method: () => jsPsych.timelineVariable('method'),
      congruity: () => jsPsych.timelineVariable('congruity'),
      reforder: () => jsPsych.timelineVariable('condition') === 0 ? 'AB' : 'BA',
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      // console.log(data.order[data.response], data.truelabel);
      if (data.order[data.response] != data.truelabel) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });

  const createSliderOnlyTrial = () => {
    let _condition;

    return ({
      type: jsPsychCanvasSliderResponse,
      canvas_size: [80,600],
      stimulus: async function(c) {
        const method = 'SliderRef';
        const radius = jsPsych.timelineVariable('radius');
        const rand = jsPsych.timelineVariable('rand');
        const condition = jsPsych.timelineVariable('condition'); // governs reference order
        await Morphfunction({ canvas: c, par: radius, rand: rand, condition: condition, method: method });
        return c;
      },
      on_start: function() {
        _truelabel = jsPsych.timelineVariable('truelabel');
        _randlabel = jsPsych.timelineVariable('randomlabel');
        const container = jsPsych.getDisplayElement();
        container.innerHTML = ''; // Clear previous content
      },
      on_load: function() { // Insert combined statement + question ABOVE canvas in ONE box
        const canvas = document.querySelector('canvas');
        const adj = jsPsych.timelineVariable('adj');
        const truelabel = jsPsych.timelineVariable('truelabel');
        const [before, after] = truelabel.split(/\.\.\./);
        const promptcondition = jsPsych.timelineVariable('promptcondition');
        
        // Single unified box with statement AND question
        const combinedBox = document.createElement('div');
        combinedBox.innerHTML = `
          <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); 
                      border: 3px solid #ff9800; 
                      border-radius: 12px; 
                      padding: 20px 30px; 
                      margin: 10px auto 20px auto; 
                      max-width: 550px;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <p style="font-size: 20px; font-weight: bold; margin: 0 0 12px 0; color: #333;">
              粉色的图形<span style="color: #d63384; text-decoration: underline;">${before}</span>灰色的图形<span style="color: #d63384; text-decoration: underline;">${after}</span>。
            </p>
            <hr style="border: none; border-top: 2px dashed #ff9800; margin: 12px 0;">
            <p style="font-size: 19px; font-weight: bold; margin: 0; color: #0056b3;">
              ${promptcondition === 1 
                ? '👉 根据两端的参考图形，将粉色图形放在滑动条上。' 
                : `👉 粉色的图形多<span style="color: #d63384; text-decoration: underline;">${adj}</span>?`}
            </p>
          </div>`;
        combinedBox.style.textAlign = 'center';
        canvas.insertAdjacentElement('beforebegin', combinedBox);
      },
      // Instruction appears below slider, above continue button
      prompt: '<p style="font-size: 13px; color: #666; margin-top: 15px;">(请点击滑动条作答。)</p>',
      require_movement: true,
      response_ends_trial: true,
      button_label: '继续',
      data: {
        task: task_name,
        radius: () => jsPsych.timelineVariable('radius'),
        rand: () => jsPsych.timelineVariable('rand'),
        method: () => jsPsych.timelineVariable('method'),
        condition: () => jsPsych.timelineVariable('condition'),
        congruity: () => jsPsych.timelineVariable('congruity'),
        promptcondition: () => ['degQ', 'baseline'][jsPsych.timelineVariable('promptcondition')],
        reforder: () => jsPsych.timelineVariable('condition') === 0 ? 'AB' : 'BA',  // AB = A on left, BA = B on left
      },
      on_finish: function() {
          var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
          jsPsych.setProgressBar(curr_progress_bar_value + (1/totaltrial));
      }
    });
  };

  const postLearnTimeline = randomizedStimuli.map((stim) =>
    createLoopedSliderPair(stim, createCanvasOnlyTrial, createSliderOnlyTrial, prompts, true),
  );

  return {
    timeline: postLearnTimeline,
  };
};



window.GetSlider = GetSlider;
window.GetPostLearnSlider = GetPostLearnSlider;
window.GetCombinedSlider = GetCombinedSlider;
