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
    canvas_size: [250,600],
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

  const createSliderOnlyTrial = () => {
    // keep condition/randlabel in closure so on_load can see them
    let _condition, _randlabel;

    return ({
      type: jsPsychCanvasSliderResponse,
      canvas_size: [80,600],
      stimulus: async function(c) {
        const method = 'SliderRef';
        const radius = jsPsych.timelineVariable('radius');
        const rand = jsPsych.timelineVariable('rand');
        _randlabel = jsPsych.timelineVariable('randomlabel'); // if not provided, will be undefined
        _condition = Math.random() < 0.5 ? 1 : 0; // governs reference order
        await Morphfunction({ canvas: c, par: radius, rand: rand, condition: _condition, method: method });
        return c;
      },
      on_start: function() {
        const container = jsPsych.getDisplayElement();
        container.innerHTML = ''; // Clear previous content
      },
      on_load: function() { // Insert the prompt below canvas based on condition
        const canvas = document.querySelector('canvas');
        const prompt = document.createElement('div');
        prompt.innerHTML = _condition === 1
          ? `<p style="margin-Bottom: 2px !important;">Use the two reference objects, place the pink object on the scale.</p>`
          : `<p style="margin-Bottom: 2px !important;">How ${_randlabel || 'a'} the pink object?</p>`;
        prompt.style.textAlign = 'center';
        prompt.style.marginBottom = '50px';
        canvas.insertAdjacentElement('beforebegin', prompt);
      },
      // prompt is handled in on_load
      prompt: '',
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
  };

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
      console.log(jsPsych.timelineVariable('order'), jsPsych.timelineVariable('truelabel'));
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
      prompt.style.marginTop = '10px';
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
      console.log(data.order[data.response], data.truelabel);
      if (data.order[data.response] != data.truelabel) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });

  const createSliderOnlyTrial = () => {
    let _condition, _randlabel;

    return ({
      type: jsPsychCanvasSliderResponse,
      canvas_size: [80,600],
      stimulus: async function(c) {
        const method = 'SliderRef';
        const radius = jsPsych.timelineVariable('radius');
        const rand = jsPsych.timelineVariable('rand');
        _randlabel = jsPsych.timelineVariable('randomlabel');
        _condition = Math.random() < 0.5 ? 1 : 0; // governs reference order
        await Morphfunction({ canvas: c, par: radius, rand: rand, condition: _condition, method: method });
        return c;
      },
      on_start: function() {
        const container = jsPsych.getDisplayElement();
        container.innerHTML = ''; // Clear previous content
      },
      on_load: function() { // Insert the prompt below canvas based on condition
        const canvas = document.querySelector('canvas');
        const prompt = document.createElement('div');
        const truelabel = jsPsych.timelineVariable('truelabel');
        const statement = `<p style="margin-Bottom: 5px !important;">The pink object was <b>${truelabel}</b> the grey object.</p>`
        prompt.innerHTML = _condition === 1
          ? statement + `<p style="margin-Bottom: 5px !important;">Use the two reference objects, <b>place the pink object on the scale</b>.</p>`
          : statement + `<p style="margin-Bottom: 5px !important;"><b>How ${_randlabel} was the pink object?</b></p>`;
        prompt.style.textAlign = 'center';
        prompt.style.marginBottom = '20px';
        canvas.insertAdjacentElement('beforebegin', prompt);
      },
      // prompt is handled in on_load
      prompt: '',
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
