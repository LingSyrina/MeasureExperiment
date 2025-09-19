function createLoopedSliderPair(stim, createTrialA, createTrialB, prompts, pair=false) {
    return {
        timeline: [
            prompts.fixation,
            (pair === true ? prompts.pausePair : prompts.pause),
            { timeline: [createTrialA(), feedback],
              timeline_variables: [stim], // Pass individual stimulus as timeline variable
              loop_function: function (data) {
                return !data.values()[0].correct; // Continue looping if the response was incorrect
            }},
            prompts.fixation,
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
      const condition = Math.random() < 0.5 ? 0 : 1; // governs reference order
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
      condition: () => jsPsych.timelineVariable('condition')
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
      const condition = Math.random() < 0.5 ? 0 : 1;
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
      method: () => jsPsych.timelineVariable('method')
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
      on_load: function() { // Insert the prompt below canvas based on condition
        const canvas = document.querySelector('canvas');
        const adj = jsPsych.timelineVariable('adj');
        const truelabel = jsPsych.timelineVariable('truelabel');
        const [before, after] = truelabel.split(/\.\.\./);
        // Statement ABOVE
        const statement = document.createElement('div');
        statement.innerHTML = `<p><b>粉色的图形${before}灰色的图形<b>${after}</b>。</p>`;
        statement.style.textAlign = 'center';
        statement.style.marginBottom = '20px';
        canvas.insertAdjacentElement('beforebegin', statement);
      },
      // prompt is handled in on_load
      prompt: jsPsych.timelineVariable('sliderprompt'),
      require_movement: true,
      response_ends_trial: true,
      button_label: '继续',
      data: {
        task: task_name,
        radius: () => jsPsych.timelineVariable('radius'),
        rand: () => jsPsych.timelineVariable('rand'),
        method: () => jsPsych.timelineVariable('method'),
        condition: () => ['degQ', 'baseline'][jsPsych.timelineVariable('promptcondition')],
        congruity: () => jsPsych.timelineVariable('congruity'),
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
