// ********** Feedback trial **********//
const feedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // console.log(jsPsych.data.get().last(1).values()[0]);
        const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        return last_trial_correct ? posprompt : negprompt;
    },
    choices: 'NO_KEYS',
    trial_duration: 700, // 0.7 second
};

// ********** Loop for each trial **********//
function createLoopedTrial(stim, createTrial, prompts, pair=false) {
    return {
        timeline: [
            prompts.fixation,
            (pair === true ? prompts.pausePair : prompts.pause),
            { timeline: [createTrial(), feedback],
              timeline_variables: [stim], // Pass individual stimulus as timeline variable
              loop_function: function (data) {
                return !data.values()[0].correct; // Continue looping if the response was incorrect
            }}],
          }}

function GetLabelPass(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method')
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      (stim.method === 'MorphPair' ? prompts.pausePair : prompts.pause),
      createTrial(),
    ],
    timeline_variables: [stim], // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline,
  };
}

function GetLabelActive(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      if (data.response != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  // Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) =>
      createLoopedTrial(stim, createTrial, prompts)
  );

  return {
      timeline: pauseAndTrialTimeline,
  };
}

function GetLabel(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    choices: ['q', 'p'],
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      if (data.response != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
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
}

function GetIntLabel(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    choices: ['1', '2', '3', '4', '5', '6'],
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      if (data.response != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
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
}

// ********** Functions only used for Experiment B **********//

function createLoopedTrialPair(stim, createTrialA, createTrialB, prompts, pair=false) {
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
            { timeline: [createTrialB(), feedback],
              timeline_variables: [stim], // Pass individual stimulus as timeline variable
              loop_function: function (data) {
                return !data.values()[0].correct; // Continue looping if the response was incorrect
            }}
          ],
        }}

function GerCombinedPass(prompts, block_stimuli, task_name){
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrialBare = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method')[0];
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('promptBare'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method')[0]
    }
  });
  const createTrialModified = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method')[1];
      let radius = jsPsych.timelineVariable('radius');
      let rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('promptModified'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method')[1]
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      (stim.method[0] === 'MorphPair' ? prompts.pausePair : prompts.pause),
      createTrialBare(),
      prompts.fixation,
      createTrialModified()
    ],
    timeline_variables: [stim] // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline
  };
}

function GerCombinedAct(prompts, block_stimuli, task_name){
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrialBare = () => ({
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
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      key: () => jsPsych.timelineVariable('key'),
      method: () => jsPsych.timelineVariable('method')[0]
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      // console.log(data.key);
      if (data.order[data.response] != data.adj) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  const createTrialModified = () => ({
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
    choices: jsPsych.timelineVariable('modorder'),
    prompt: "",
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      key: () => jsPsych.timelineVariable('LevKey'),
      method: () => jsPsych.timelineVariable('method')[1]
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      if (data.order[data.response] != data.adv) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      createLoopedTrialPair(stim, createTrialBare,createTrialModified, prompts, pair=true),
    ],
    timeline_variables: [stim] // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline
  };
}


// ********** following functions are used with button response with mouse tracking **********//

function GetLabelActiveButton(prompts, block_stimuli, task_name) {
  let trialtype = '';
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasButtonResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      const condition = jsPsych.timelineVariable('condition');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });

      // Step 2: Create a mask canvas layered over the main one
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = c.width;
      maskCanvas.height = c.height;
      maskCanvas.style.position = 'absolute';
      maskCanvas.style.left = c.offsetLeft + 'px';
      maskCanvas.style.top = c.offsetTop + 'px';
      maskCanvas.style.pointerEvents = 'none'; // Allow clicks to go through
      c.parentElement.appendChild(maskCanvas);
      c.maskvar = null;
      const maskCtx = maskCanvas.getContext('2d');
      // Step 3: 65% chance to mask one corner
      if (Math.abs(Math.sin(parseFloat(radius) * 1000)) % 1 < 0.65) {
        const maskWidth = 130;
        const maskHeight = 170;
        const x_min = 150, x_max = maskCanvas.width - 170;
        const y_min = 10;

        const corners = [
          { x: x_min, y: y_min, name: 'left' }, // left
          { x: x_max - maskWidth, y: y_min, name: 'right' }, // right
        ];

        const chosenCorner = corners[condition];
        c.maskvar = chosenCorner;
        maskCtx.fillStyle = '#f5f5f5';
        maskCtx.fillRect(chosenCorner.x, chosenCorner.y, maskWidth, maskHeight);
      }

      return c;
    },
    on_start: function() {
      const container = jsPsych.getDisplayElement();
      container.innerHTML = ''; // Clear previous content
    },
    on_load: function() { // Move prompt div below canvas, before buttons
      const canvas = document.querySelector('canvas');
      const prompt = document.createElement('div');
      prompt.innerHTML = `<p><strong>The pink object is:</strong></p>`;
      prompt.style.textAlign = 'center';
      prompt.style.marginTop = '10px';
      canvas.insertAdjacentElement('afterend', prompt); // Insert the prompt after the canvas
    },
    canvas_size: [250,600],
    prompt: "",
    choices: jsPsych.timelineVariable('order'),
    response_ends_trial: true,
    extensions: [
      {type: jsPsychExtensionMouseTracking, params: {targets: ['canvas']}}
    ],
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
      order: () => jsPsych.timelineVariable('order'),
      truelabel:() => task_name.includes('label') ? jsPsych.timelineVariable('adj') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      // console.log(data.response);
      const canvas = document.querySelector('canvas');
      trialtype = jsPsych.timelineVariable('method');
      console.log(trialtype);
      data.mask = canvas.maskvar || null;
      console.log(data.mask);
      data.subjectResponse = data.order[data.response];
      // console.log(data.subjectResponse, data.response, data.key);
      if (["q","p"][data.response] != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  console.log(trialtype);
  // Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) =>
    stim.method === 'MorphPair'
      ? createLoopedTrial(stim, createTrial, prompts, true)
      : createLoopedTrial(stim, createTrial, prompts)
  );

  return {
      timeline: pauseAndTrialTimeline,
  };
}

function GetLabelActiveButtonPair(prompts, block_stimuli, task_name) {
  let trialtype = '';
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasButtonResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      const condition = jsPsych.timelineVariable('condition');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });

      // Step 2: Create a mask canvas layered over the main one
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = c.width;
      maskCanvas.height = c.height;
      maskCanvas.style.position = 'absolute';
      maskCanvas.style.left = c.offsetLeft + 'px';
      maskCanvas.style.top = c.offsetTop + 'px';
      maskCanvas.style.pointerEvents = 'none'; // Allow clicks to go through
      c.parentElement.appendChild(maskCanvas);
      c.maskvar = null;
      const maskCtx = maskCanvas.getContext('2d');
      // console.log(Math.abs(Math.sin(parseFloat(radius) * 1000)) % 1);
      // Step 3: 65% chance to mask one corner
      if (Math.abs(Math.sin(parseFloat(radius[0]) * 1000)) % 1 < 0.65) {
        const maskWidth = 130;
        const maskHeight = 170;
        const x_min = 300, x_max = maskCanvas.width-20;
        const y_min = 10;

        const corners = [
          { x: x_min, y: y_min, name: 'left' }, // top-left
          { x: x_max - maskWidth, y: y_min, name: 'right' } // top-right
        ];

        const chosenCorner = corners[condition];
        c.maskvar = chosenCorner;
        maskCtx.fillStyle = '#f5f5f5';
        maskCtx.fillRect(chosenCorner.x, chosenCorner.y, maskWidth, maskHeight);
      }

      return c;
    },
    on_start: function() {
      const container = jsPsych.getDisplayElement();
      container.innerHTML = ''; // Clear previous content
    },
    on_load: function() { // Move prompt div below canvas, before buttons
      const canvas = document.querySelector('canvas');
      const prompt = document.createElement('div');
      prompt.innerHTML = `<p><strong>The pink object is _______ than the grey object.</strong></p>`;
      prompt.style.textAlign = 'center';
      prompt.style.marginTop = '10px';
      canvas.insertAdjacentElement('afterend', prompt); // Insert the prompt after the canvas
    },
    canvas_size: [250,600],
    prompt: "",
    choices: jsPsych.timelineVariable('order'),
    response_ends_trial: true,
    extensions: [
      {type: jsPsychExtensionMouseTracking, params: {targets: ['canvas']}}
    ],
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
      order: () => jsPsych.timelineVariable('order'),
      truelabel:() => task_name.includes('label') ? jsPsych.timelineVariable('adj') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      // console.log(data.response);
      const canvas = document.querySelector('canvas');
      trialtype = jsPsych.timelineVariable('method');
      data.mask = canvas.maskvar || null;
      console.log(data.mask);
      data.subjectResponse = data.order[data.response];
      // console.log(data.subjectResponse, data.response, data.key);
      if (["q","p"][data.response] != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  // Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) =>
    stim.method === 'MorphPair'
      ? createLoopedTrial(stim, createTrial, prompts, true)
      : createLoopedTrial(stim, createTrial, prompts)
  );

  return {
      timeline: pauseAndTrialTimeline,
  };
}

function GetLabelButton(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasButtonResponse,
    // stimulus: async function(c) {
    //   const method = jsPsych.timelineVariable('method');
    //   const radius = jsPsych.timelineVariable('radius');
    //   const rand = jsPsych.timelineVariable('rand');
    //   await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
    //   return c;
    // },
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');

      // Step 1: Draw the morph directly to the main canvas
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });

      // Step 2: Create a mask canvas layered over the main one
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = c.width;
      maskCanvas.height = c.height;
      maskCanvas.style.position = 'absolute';
      maskCanvas.style.left = c.offsetLeft + 'px';
      maskCanvas.style.top = c.offsetTop + 'px';
      maskCanvas.style.pointerEvents = 'none'; // Allow clicks to go through
      c.parentElement.appendChild(maskCanvas);

      const maskCtx = maskCanvas.getContext('2d');

      // Fill the mask canvas with light grey
      maskCtx.fillStyle = '#f5f5f5';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Step 3: Unmask via mousemove
      c.addEventListener('mousemove', function(e) {
        const rect = maskCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const eraseWidth = 60;
        const eraseHeight = 60;

        maskCtx.save();
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.fillRect(x - eraseWidth / 2, y - eraseHeight / 2, eraseWidth, eraseHeight);
        maskCtx.restore();
      });

      return c;
    },

    on_start: function() {
      const container = jsPsych.getDisplayElement();
      container.innerHTML = ''; // Clear previous content
    },
    on_load: function() { // Move prompt div below canvas, before buttons
      const canvas = document.querySelector('canvas');
      const prompt = document.createElement('div');
      prompt.innerHTML = `<p>(Use your cursor to move over the canvas and reveal the object.)</p><p><strong>The pink object is:</strong></p>`;
      prompt.style.textAlign = 'center';
      prompt.style.marginTop = '10px';
      canvas.insertAdjacentElement('afterend', prompt); // Insert the prompt after the canvas
    },
    canvas_size: [250,600],
    // prompt: jsPsych.timelineVariable('prompt'),
    choices: jsPsych.timelineVariable('order'),
    response_ends_trial: true,
    extensions: [
      {type: jsPsychExtensionMouseTracking, params: {targets: ['canvas']}}
    ],
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),
      order: () => jsPsych.timelineVariable('order'),
      truelabel:() => task_name.includes('label') ? jsPsych.timelineVariable('adj') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      // console.log(data.response);
      data.subjectResponse = data.order[data.response];
      // console.log(data.subjectResponse, data.response, data.key);
      if (["q","p"][data.response] != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      (jsPsych.timelineVariable('method') === 'MorphPair' ? prompts.pausePair : prompts.pause),
      createTrial(),
    ],
    timeline_variables: [stim], // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline,
  };
}

function GetIntLabelButton(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasButtonResponse,
    // stimulus: async function(c) {
    //   const method = jsPsych.timelineVariable('method');
    //   const radius = jsPsych.timelineVariable('radius');
    //   const rand = jsPsych.timelineVariable('rand');
    //   await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
    //   return c;
    // },
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');

      // Step 1: Draw the morph directly to the main canvas
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });

      // Step 2: Create a mask canvas layered over the main one
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = c.width;
      maskCanvas.height = c.height;
      maskCanvas.style.position = 'absolute';
      maskCanvas.style.left = c.offsetLeft + 'px';
      maskCanvas.style.top = c.offsetTop + 'px';
      maskCanvas.style.pointerEvents = 'none'; // Allow clicks to go through
      c.parentElement.appendChild(maskCanvas);

      const maskCtx = maskCanvas.getContext('2d');

      // Fill the mask canvas with light grey
      maskCtx.fillStyle = '#f5f5f5';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Step 3: Unmask via mousemove
      c.addEventListener('mousemove', function(e) {
        const rect = maskCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const eraseWidth = 60;
        const eraseHeight = 60;

        maskCtx.save();
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.fillRect(x - eraseWidth / 2, y - eraseHeight / 2, eraseWidth, eraseHeight);
        maskCtx.restore();
      });

      return c;
    },
    on_start: function() {
      const container = jsPsych.getDisplayElement();
      container.innerHTML = ''; // Clear previous content
    },
    on_load: function() {
      const canvas = document.querySelector('canvas');
      const prompt = document.createElement('div');
      prompt.innerHTML = `<p>(Use your cursor to move over the canvas and reveal the object.)</p><p><strong>The pink object is:</strong></p>`;
      prompt.style.textAlign = 'center';
      prompt.style.marginTop = '10px';
      canvas.insertAdjacentElement('afterend', prompt);
      const btnContainer = document.getElementById('jspsych-canvas-button-response-btngroup');
      if (btnContainer) {
        btnContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        btnContainer.style.gridTemplateRows = 'auto';
        btnContainer.style.gap = '2px';
        btnContainer.style.maxWidth = '700px';
        btnContainer.style.margin = '2px auto';
      }
    },
    canvas_size: [250,600],
    // prompt: jsPsych.timelineVariable('prompt'),
    choices: jsPsych.timelineVariable('order'),
    button_html: function(choice, i) {
      return '<button class="jspsych-btn">' + choice + '</button>';
    },
    response_ends_trial: true,
    extensions: [
      {type: jsPsychExtensionMouseTracking, params: {targets: ['canvas']}}
    ],
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => task_name.includes('label') ? jsPsych.timelineVariable('key') : jsPsych.timelineVariable('LevKey'),
      order: () => jsPsych.timelineVariable('order'),
      truelabel:() => task_name.includes('label') ? jsPsych.timelineVariable('adj') : jsPsych.timelineVariable('LevKey'),//could need modification for exp 2
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      data.subjectResponse = data.order[data.response];
      // console.log(data.subjectResponse, data.response, data.key);
      if (["q","p"][data.response] != data.key) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  //Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) => ({
    timeline: [
      prompts.fixation,
      (jsPsych.timelineVariable('method') === 'MorphPair' ? prompts.pausePair : prompts.pause),
      createTrial(),
    ],
    timeline_variables: [stim], // Pass individual stimulus as timeline variable
  }));
  return {
    timeline: pauseAndTrialTimeline,
  };
}

// ********** following functions are not used at the moment **********//
function GetDegreePass(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
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
}

function GetDegreeActive(prompts, block_stimuli, task_name) {
  // Dynamically create the trial
  const randomizedStimuli = jsPsych.randomization.shuffle(block_stimuli);
  const createTrial = () => ({
    type: jsPsychCanvasKeyboardResponse,
    stimulus: async function(c) {
      const method = jsPsych.timelineVariable('method');
      const radius = jsPsych.timelineVariable('radius');
      const rand = jsPsych.timelineVariable('rand');
      await Morphfunction({ canvas: c, par: radius, rand: rand, method: method });
      return c;
    },
    canvas_size: [250,600],
    prompt: jsPsych.timelineVariable('prompt'),
    response_ends_trial: true,
    data: {
      task: task_name,
      radius: () => jsPsych.timelineVariable('radius'),
      rand: () => jsPsych.timelineVariable('rand'),
      method: () => jsPsych.timelineVariable('method'),
      key: () => jsPsych.timelineVariable('degree'),
    },
    on_finish: function(data) { // Score the response as correct or incorrect.
      if (Math.floor(Math.abs(data.response - data.key)) > 1) {
        data.correct = false;
      } else {
        data.correct = true;
      }
    }
  });
  // Block configuration
  const pauseAndTrialTimeline = randomizedStimuli.map((stim) =>
      createLoopedTrial(stim, createTrial, prompts)
  );

  return {
      timeline: pauseAndTrialTimeline,
  };
}

// ********** Global Functions **********//
window.GetSlide = GetLabelPass;
window.GetInterActive = GetLabelActive;
window.GetDegreePass = GetDegreePass;
window.GetDegreeActive = GetDegreeActive;
