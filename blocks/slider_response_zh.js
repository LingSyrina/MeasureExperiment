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

window.GetSlider = GetSlider;
window.GetPostLearnSlider = GetPostLearnSlider;
