//%%%%%%%% Morph generation %%%%%%%%%//
// Load once at startup
async function loadBlobsFromJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    const text = await response.text(); // <-- fetch raw string
    const data = JSON.parse(text); // manually parse to catch errors
    return {
      A: new MorphBlob(data.A.x, data.A.y, data.A.ctrlX1, data.A.ctrlY1),
      B: new MorphBlob(data.B.x, data.B.y, data.B.ctrlX1, data.B.ctrlY1),
      C: new MorphBlob(data.C.x, data.C.y, data.C.ctrlX1, data.C.ctrlY1),
      D: new MorphBlob(data.D.x, data.D.y, data.D.ctrlX1, data.D.ctrlY1)
    };
  } catch (err) {
    console.error("Failed to load or parse JSON:", err);
    return null;
  }
}

// Morph generation function
function Morphfunction({canvas, method, ...args}) {
    // console.log("Getting morpher for", method);
    return new Promise((resolve, reject) => {
      const canvasMorpher = new CanvasMorpher(canvas, sharedBlobs);
      try {
        // console.log(method, " called");
        switch (method) { // methods for intervention blocks
          case 'MorphSingle': //method with one stimulus: for measure acquisition
              canvasMorpher.MorphSingle({canvas, ...args}, () => {
                // console.log("MorphSingle callback triggered");
                resolve();
              });
              break;
          case 'MorphPair': //method with stimuli pair: for label acquisition
            canvasMorpher.MorphPair({canvas, ...args}, () => {
              resolve();
            });
            break; // methods for outcome blocks
          case 'SliderMorph': //slider method with one morph stimulus
            canvasMorpher.SliderMorph({canvas, ...args}, () => {
              resolve();
            });
            break;
          case 'SliderRef': //slider method with morph stimuli pair
            canvasMorpher.SliderRef({canvas, ...args}, () => {
              resolve();
            });
            break;
          case 'SliderPair': //slider method with morph stimuli pair
            canvasMorpher.SliderPair({canvas, ...args}, () => {
              resolve();
            });
            break;
          case 'SliderOverlap': //slider method with morph stimuli overlap
            canvasMorpher.SliderOverlap({canvas, ...args}, () => {
              resolve();
            });
            break;
          default:
            reject(new Error(`Invalid method: ${method}`));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

//%%%%%%%% Randomization %%%%%%%%%//
function getRandomArbitrary(min, max) {
       let nn = Math.random() * (max - min) + min;
       return Math.round(nn*100)/100;
     }

function Shuffle(array) {
 let copy = [...array]; // Create a new copy
 for (let i = copy.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [copy[i], copy[j]] = [copy[j], copy[i]]; // Swap in copy, not original
 }
 return copy; // Return new shuffled array
}

//%%%%%%% Stimuli Array Selection %%%%%%%%%%//
function SplitStimuli(stimuli, pattern) {
    let result = [];
    let index = 0;
    let patternIndex = 0;
    const shuffledStimuli = Shuffle(stimuli);
    while (index < shuffledStimuli.length) {
        const groupSize = pattern[patternIndex % pattern.length];
        const chunk = shuffledStimuli.slice(index, index + groupSize);
        result.push(chunk);
        index += groupSize;
        patternIndex++;
    }
    return result;
}

/* create an evenly-spaced list of radius plus a random value  */
function buildList({ radiusRange, randRange, numStimuli }) {
  const [minR, maxR]   = radiusRange;
  const [randL, randH] = randRange;
  const step = numStimuli > 1 ? (maxR - minR) / (numStimuli - 1) : 0;
  return Array.from({ length: numStimuli }, (_, i) => ({
    radius: +(minR + i * step).toFixed(2),
    rand:   +getRandomArbitrary(randL, randH).toFixed(2)
  }));
}

//%%%%%%%% Label generation %%%%%%%%%//
// random label for slider trials
function getRandomLabel() {
  const dualLabel = [linglabels[0], linglabels[linglabels.length - 1]]; // Corrected last element index
  return dualLabel[Math.floor(Math.random() * 2)];
}
// real Adj label for single morph, label contains (string, keypress)
// function getTrueAdj({ labelDict, r }){
//   //console.log(labelDict);
//   for (const [range, label] of Object.entries(labelDict)) {
//       const [min, max] = JSON.parse(range); // Parse the range string to an array
//       if (r >= min && r < max) {
//           return label;
//     }
//   }
//   throw new Error(`No matching label found for radius: ${radius}`);
// }
function getTrueAdj({ labelDict, r, rand = null }) {
  for (const [rangeStr, label] of Object.entries(labelDict)) {
    const bounds = JSON.parse(rangeStr); // Either [min, max] or [[rMin, rMax], [randMin, randMax]]
    if (bounds.length === 1) { // 1D case: only radius
      const [min, max] = bounds[0];
      if (r >= min && r < max) {
        return label;
    }}
    if (bounds.length === 2 && rand !== null) { // 2D case: radius and rand
      const [[rMin, rMax], [randMin, randMax]] = bounds;
      if (r >= rMin && r < rMax && rand >= randMin && rand < randMax) {
        return label;
  }}}
  return ['', rand];
}


// real Adj label for morph pairs, label contains (string, keypress)
function getCompAdj({ Pos }) {
  const adj = Pos ?  linglabels[linglabels.length - 1]: linglabels[0];
  const key = Pos ? (linglabels.length - 1):0;
  return [adj, key];
}

// real degree and adv label given a position-based degree
// mode can be `modifier` (morph pair) or `complement` (single morph)
// To garantee 3 levels at both mode, d in [0.10, 0.50] modifier, in [0.4, 0.8] in complement
function getDegAdv({ d, mode = 'modifier' }){
  var degree = d;
  let Adv, Ind;
  // console.log(degree);
  if (mode === 'modifier'){
    Ind = Math.min(2, Math.max(0, Math.round(degree-0.35)));
    // Ind = Math.round(degree);
    const Modadv = ['slightly', 'somewhat', 'much'];
    Adv = Modadv[Ind] || 'unknown';
    // console.log(degree, Ind, Adv);
    degree = Ind+1;
  } else if (mode === 'complement') {
    Ind = Math.min(2, Math.max(0, Math.floor(degree - 1.2)));
    const Compadv = ['slightly', 'somewhat', 'very'];
    Adv = Compadv[Ind] || 'unknown'; // Avoid out-of-bounds error
    degree = Ind + 3;
  }
  const LevKey = ['q', 't', 'p'][Ind];
  return {Deg: degree, Adv: Adv, LevKey: LevKey};
}

//%%%%%%%% stimulus generation %%%%%%%%%//
// modify to get noise component and controlled.
// generate n * radius from min to max with step, default degree precision .15
function GenerateSingleMorph({configs = null, numStimuli = 20, min = 0, max = 1,  DegPrecision = 0.15, labelDict = []} = {}) {
    const blocks = configs && Array.isArray(configs)
      ? configs : [{radiusRange: [min, max],randRange:[min, max], numStimuli}];
    let stimuli = [];
    blocks.forEach(cfg => {
      buildList(cfg).forEach(({ radius, rand }) => {
        const label  = getRandomLabel();
        const degAdv = getDegAdv({ d: radius / DegPrecision, mode: 'complement' });
        const [adj, key] = getTrueAdj({ labelDict, r: radius, rand: rand });
        stimuli.push({radius, rand, adj, deg: degAdv.Deg, adv: degAdv.Adv, key, LevKey: degAdv.LevKey, randomlabel: label});
      });
    });
    return stimuli;
  }

// generate n * radius pair from min to max with controlled differences
function GeneratePairMorph({ numStimuli = 10, DegPrecision = 0.15, step = 0.05, min = 0, max = 1, labelDict = {} }) {
    const differences = [parseFloat((step * 3).toFixed(2)),parseFloat((step * 5).toFixed(2)),parseFloat((step * 7).toFixed(2)),
                        parseFloat((step * 9).toFixed(2))]; //d in [0.10, 0.50] modifier, step * 2 to step * 10;
    //console.log(differences);
    return Array.from({ length: numStimuli }, (_, j) => {
        const diff = differences[Math.floor(Math.random() * differences.length)];
        const isP1Less = j < numStimuli / 2; // Half have p1 < p2
        const p = parseFloat((Math.floor(getRandomArbitrary(min / step, (max - diff) / step)) * step).toFixed(2));
        const [p1, p2, Pos] = isP1Less ? [p, parseFloat((p + diff).toFixed(2)), true] : [parseFloat((p + diff).toFixed(2)), p, false]; //If isP1Less, p1 < p2, Pos=True.
        const [adj, key] = getCompAdj({Pos:Pos});
        const degAdv = getDegAdv({ d: diff/DegPrecision, mode: 'modifier' });
        return { radius: [p1, p2], adj: adj, deg: degAdv.Deg, adv: degAdv.Adv, key: key, LevKey: degAdv.LevKey }; //key is only used for active learning trials
    });
}

// generate n * radius pair from two defined subspace
function GeneratePairMorphFlex({pairConfigs = [{ radiusRange: [0, 1], randRange: [0, 1]},
                                                { radiusRange: [0, 1], randRange: [0, 1]}],
                                                numStimuli = 10, DegPrecision = 0.15, labelDict = {}, ModType='modifier'} = {}){
    if (!Array.isArray(pairConfigs) || pairConfigs.length !== 2) {
      throw new Error('pairConfigs must be an array with exactly two config objects');
    }
    // console.log("List A config:", pairConfigs);
    pairConfigs[0].numStimuli = numStimuli;
    pairConfigs[1].numStimuli = numStimuli;
    const listA = buildList(pairConfigs[0]);
    const listB = buildList(pairConfigs[1]);
    const numPairs = Math.min(listA.length, listB.length);
    const stimuli  = [];

    for (let j = 0; j < numPairs; j++) {
      let p1   = listA[j].radius;
      let p2   = listB[j].radius;
      let rnd1 = listA[j].rand;
      let rnd2 = listB[j].rand;
      const isP1Less = j < numPairs / 2;      // first half p1 < p2, second half p1 > p2
      const needSwap = (p1 < p2) !== isP1Less;
      if (needSwap) {[p1, p2]   = [p2, p1]; [rnd1, rnd2] = [rnd2, rnd1];}
      const diff   = Math.abs(p2 - p1);
      const Pos    = p1 < p2;                 // true if final ordering has p1 < p2
      const [adj, key] = getCompAdj({ Pos });
      const degAdv = getDegAdv({ d: diff / DegPrecision, mode: 'modifier' });
      stimuli.push({radius: [p1, p2], rand:[rnd1, rnd2], adj, deg:degAdv.Deg, adv:degAdv.Adv,key,LevKey: degAdv.LevKey});
    }
    return stimuli;
}

// function for experiment 2: used for all testing trials
function GeneratePairMorphFlex2({pairConfigs = [{ radiusRange: [0, 1], randRange: [0, 1]},
                                                { radiusRange: [0, 1], randRange: [0, 1]}],
                                                numStimuli = 10, DegPrecision = 0.3, labelDict = {}, equal=false, ModType='modifier'} = {}){
    if (!Array.isArray(pairConfigs) || pairConfigs.length !== 2) {
      throw new Error('pairConfigs must be an array with exactly two config objects');
    }
    // console.log("List A config:", pairConfigs);
    pairConfigs[0].numStimuli = numStimuli;
    pairConfigs[1].numStimuli = numStimuli;
    const listA = equal ? buildList(pairConfigs[0]) : Shuffle(buildList(pairConfigs[0]));
    const listB = equal ? buildList(pairConfigs[1]) : Shuffle(buildList(pairConfigs[1]));
    const numPairs = Math.min(listA.length, listB.length);
    const stimuli  = [];

    for (let j = 0; j < numPairs; j++) {
      let p1   = listA[j].radius;
      let p2   = listB[j].radius;
      let rnd1 = listA[j].rand;
      let rnd2 = listB[j].rand;
      const isP1Less = j < numPairs / 2;      // first half p1 < p2, second half p1 > p2
      const needSwap = (p1 < p2) !== isP1Less;
      if (needSwap) {[p1, p2]   = [p2, p1]; [rnd1, rnd2] = [rnd2, rnd1];}
      const diff   = Math.abs(p2 - p1);
      const Pos    = p1 < p2;                 // true if final ordering has p1 < p2
      const [adj, key] = getCompAdj({ Pos });
      const degAdv = ModType === 'modifier' ? getDegAdv({ d: (diff-.4) / .2, mode: ModType }): getDegAdv({ d: p2 / .3, mode: ModType });
      // console.log(diff, (diff-.4) / .25);
      stimuli.push({radius: [p1, p2], rand:[rnd1, rnd2], adj, deg:degAdv.Deg, adv:degAdv.Adv, key, LevKey: degAdv.LevKey, randomlabel:getRandomLabel()});
    }
    return stimuli;
}

// generate n * radius pair from min to max with 0 differences
function GenerateEquaMorph({ numStimuli = 20, step = 0.05, min = 0, max = 1, labelDict = [] }) {
  let stimuli = Array.from({ length: Math.ceil((max - min) / step) + 1 }, (_, i) => ({ radius: [min + i * step, min + i * step], randomlabel: getRandomLabel()}));
  if (stimuli.length > numStimuli) { // this is only for debugging
        stimuli = stimuli.sort(() => Math.random() - 0.5).slice(0, numStimuli); // Shuffle the stimuli array and pick the first `numStimuli` elements
    }
  else {
    while (stimuli.length < numStimuli) {
        const randomValue = Math.floor(getRandomArbitrary(min / step, max / step)) * step;
        stimuli.push({ radius: [randomValue, randomValue], randomlabel:getRandomLabel() });
  }}
  return stimuli;
}

//******** Block arg preperation ********//
//Trial Type: LabPass, LabAct, AbsAct; RelPass, RelAct; SliderPre, SliderDeg, SliderComp, SliderEqua;
//Label Type: Bare, Adv, MP;
function BlockAppend({stimuliSet = [],labelDict = {}, configs = [],
                  numStimuli = 10,passActRatio = [], trialType = '',labelType = ''
  }) {
  let stimuli;
  let method;
  //console.log(trialType, labelDict);
  if (
    ['LabLearn', 'AbsLearn','CompLearn','RelLearn','NormLab', 'IntLab'].includes(trialType)) {
    if (['LabLearn','IntLab', 'NormLab'].includes(trialType)) {
      stimuli = GenerateSingleMorph({ configs, labelDict });
      method = 'MorphSingle';
    } else if (['AbsLearn'].includes(trialType)) {
      stimuli = GenerateSingleMorph({ configs, labelDict, min: 0.4, max: 0.8 });
      method = 'MorphSingle';
    } else if (['CompLearn'].includes(trialType)) {
      stimuli = GeneratePairMorphFlex({ numStimuli, labelDict, pairConfigs:configs });
      method = 'MorphPair';
    } else if (['RelLearn'].includes(trialType)) {
      stimuli = GeneratePairMorph({ numStimuli, labelDict });
      method = 'MorphPair';
    }
    if (Array.isArray(passActRatio) && passActRatio.length > 0) {
      const grouped_stimuli = SplitStimuli(stimuli, passActRatio);
      for (let s = 0; s < grouped_stimuli.length; s++) {
        const currentTrialType = (s % 2 === 0) ? trialType : trialType + 'Act';
        for (const stimulus of grouped_stimuli[s]) {
          stimulus.prompt = getprompts({ stimulus, promptType: currentTrialType, labelType });
          stimulus.method = method;
          stimulus.condition = Math.floor(Math.random() * 2); // 0 or 1
        }
      }
      return grouped_stimuli;
  } else {
      for (const stimulus of stimuli) {
        stimulus.prompt = getprompts({ stimulus, promptType: trialType, labelType });
        stimulus.method = method;
        stimulus.condition = Math.floor(Math.random() * 2); // 0 or 1
      }
      stimuliSet.push(...stimuli);
      return stimuliSet;
    }
  } else if (
    ['PreLabelSlider', 'DegQSlider', 'CompSlider', 'EquaSlider'].includes(trialType)){
    if (trialType === 'PreLabelSlider' || trialType === 'DegQSlider') {
      stimuli = GenerateSingleMorph({ configs, labelDict });
      method = (trialType === 'PreLabelSlider') ? 'SliderMorph' : 'MorphSingle';
    } else if (trialType === 'CompSlider') {
      stimuli = GeneratePairMorph({ numStimuli, labelDict });
      method = 'MorphPair';
    } else if (trialType === 'EquaSlider') {
      stimuli = GenerateEquaMorph({ numStimuli, labelDict });
      method = 'MorphPair';
    }
    for (const stimulus of stimuli) {
      stimulus.prompt = getprompts({ stimulus, promptType: trialType, labelType });
      stimulus.method = method;
      const randomref = Shuffle([linglabels[linglabels.length - 1], linglabels[0]]);
      stimulus.reflabel = (trialType !== 'PreLabelSlider') ? randomref : [];
      stimulus.condition = Math.floor(Math.random() * 2); // 0 or 1
    }
    stimuliSet.push(...stimuli);
    return stimuliSet;
  }
}

//********** Block append function for experiment 2 ************//
function BlockAppend2({stimuliSet = [],labelDict = {}, configs = [],
                  numStimuli = 10,passActRatio = [], trialType = '',labelType = []
  }) {
  let stimuli;
  let method;
  if (
    ['AbsLearn','RelLearn'].includes(trialType)) {
     if (['AbsLearn'].includes(trialType)) {
        stimuli = GeneratePairMorphFlex2({ numStimuli, labelDict, pairConfigs:configs, ModType:'complement' });
        method = ['MorphPair', 'MorphPair'];
      } else if (['RelLearn'].includes(trialType)) {
        stimuli = GeneratePairMorphFlex2({ numStimuli, labelDict, pairConfigs:configs });
        method = ['MorphPair', 'MorphPair'];
      }
    if (Array.isArray(passActRatio) && passActRatio.length > 0) {
      const grouped_stimuli = SplitStimuli(stimuli, passActRatio);
      for (let s = 0; s < grouped_stimuli.length; s++) {
        const currentTrialType = (s % 2 === 0) ? trialType : trialType + 'Act';
        const baseType = (s % 2 === 0) ? 'CompLearn' : 'CompLearn' + 'Act';
        for (const stimulus of grouped_stimuli[s]) {
          stimulus.promptBare = getprompts({ stimulus, promptType: baseType, labelType: labelType[0] });
          stimulus.promptModified = getprompts({ stimulus, promptType: currentTrialType, labelType: labelType[1] });
          stimulus.method = method;
        }
      }
      return grouped_stimuli;
  } else {
      for (const stimulus of stimuli) {
        stimulus.promptBare = getprompts({ stimulus, promptType: 'CompLearn', labelType: labelType[0] });
        stimulus.promptModified = getprompts({ stimulus, promptType: currentTrialType, labelType: labelType[1] });
        stimulus.method = method;
      }
      stimuliSet.push(...stimuli);
      return stimuliSet;
    }
  } else if (
    ['PreLabelSlider', 'DegQSlider', 'CompSlider', 'EquaSlider'].includes(trialType)){
    if (trialType === 'PreLabelSlider' || trialType === 'DegQSlider') { //no longer need degQ slider, use it as double control with equa/comp trials
      stimuli = GenerateSingleMorph({ configs, labelDict });
      method = (trialType === 'PreLabelSlider') ? 'SliderMorph' : 'MorphSingle';
    } else if (trialType === 'CompSlider') {
      stimuli = GeneratePairMorphFlex2({ numStimuli, labelDict, pairConfigs:configs });
      method = 'MorphPair';
    } else if (trialType === 'EquaSlider') {
      stimuli = GeneratePairMorphFlex2({ numStimuli, labelDict, pairConfigs:configs, equal:true });
      method = 'MorphPair';
    }
    for (const stimulus of stimuli) {
      stimulus.prompt = getprompts({ stimulus, promptType: trialType, labelType: '' });
      stimulus.method = method;
      const randomref = Shuffle([linglabels[linglabels.length - 1], linglabels[0]]);
      stimulus.reflabel = (trialType !== 'PreLabelSlider') ? randomref : [];
      stimulus.condition = Math.floor(Math.random() * 2); // 0 or 1
    }
    stimuliSet.push(...stimuli);
    return stimuliSet;
  }
}

//******** Incorporate functions globally ********//
window.Morphfunction = Morphfunction;
window.Shuffle = Shuffle;
window.SplitStimuli = SplitStimuli;
window.BlockAppend = BlockAppend;
