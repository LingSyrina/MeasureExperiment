/* * * * * * * * * * * * * * * * * * Instructions * * * * * * * * * *  * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var PreSlider_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>在本部分中，你将看到一个滑动条。 </br>
    滑动条的两端将各有一个参照物。 </br>
    你的任务是根据<b>参照物</b>将<b>粉色的图形</b>放在滑动条上相应的位置。</p>
    <p>你将需完成20组此任务。</p>
    <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var PostSlider_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
   <p>在本部分中，你将看到一个或一对图形。 </br>
    滑动条的两端将各有一个参照物。 </br>
    你的任务是<b>将粉色的图形放在滑动条上</b>以回答图像下方的问题。</p>
    <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var PassLabel_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>在本部分中，你将看到一个图形及其描述。</p>
     <p>请仔细观察该图形及其相应的描述语句。</p>
     <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var ActLabel_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>你将继续看到一些图形。</p>
    <p>你的任务是<b>选择最符合该图形的描述</b>。</p>
    <p>有些时间，图形会被部分遮挡，请作出最有可能的猜测。</p>
    <p>你必须正确回答每个问题才能继续。</p>
    <p>(按空格键继续。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var PassRel_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>在本部分中，你将看到一对图形及它们之间关系的描述。</p>
     <p>请仔细观察这些图形及其对应的描述语句。</p>
     <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var ActRel_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>你将继续看到一对图形。</p>
    <p>你的任务是<b>选择最符合这些图形之间关系的描述</b>。</p>
    <p>有些时间，图形会被部分遮挡，请作出最有可能的猜测。</p>
    <p>你必须正确回答每个问题才能继续。</p>
    <p>(按空格键继续。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var PassAbs_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>在本部分中，你将看到一个图形及更详细的描述。</p>
    <p>请仔细观察该图形并查看其相关细节。</p>
    <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var ActAbs_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>在本部分中，你将看到一个图形及一个不完整的描述。</p>
    <p>你的任务是仔细观察该图形并完成描述。</p>
    <p>你必须正确回答才能继续。</p>
    <p>(按空格键继续。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var PassLearn_continue = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
     <p>现在你将再次看到该描述。</p>
     <p>请仔细观察图形并阅读描述。</p>
     <p>(按空格键开始。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var ActLearn_continue = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>现在请再次尝试<b>选择最符合这些图形的描述</b>。</p>
    <p>你必须正确回答每个问题才能继续。</p>
    <p>(按空格键继续。)</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var Postlab_norm = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>太好了！现在我们进入真正的任务部分。</p>
    <p>在这一部分，你将看到<b>被画布隐藏</b>的图形。</p>
    <p><b>使用你的鼠标</b>在画布上移动，以揭示这些图形。</p>
    <p>你的任务是<b>选择最符合你所见的描述</b>。</p>
    <p>请<b>仔细探索整个物体</b>之后再做出选择，</p>
    <p>并尽可能<b>准确直观地作答</b>。</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var Postlab_mod = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>很棒！让我们继续下一轮判断。</p>
    <p>你将再次看到一些<b>被画布隐藏</b>的图形并选择最合适的描述。</p>
    <p>相信你的判断并认真作答。</p>
  `,
  choices: [' '],
  post_trial_gap: 500
};

var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p style="font-size:20px;font-weight:bold;"> 感谢你的参与！</p>
            <p>按空格键开始。</p>`,
  choices: [' '],
};

var waiting = {
 type: jsPsychHtmlKeyboardResponse,
 stimulus: `<p>谢谢！请按任意键保存你的回答。
            </br> 这可能需要几秒钟 —— 在看到确认页面之前请<strong>不要关闭窗口</strong>。</p>`
};

var closing = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p style="font-size:20px;font-weight:bold;"> 感谢你的参与！</p>
            <p>你可以在感到合适时关闭窗口。</p>`
};

var fixation = {
 type: jsPsychHtmlKeyboardResponse,
 stimulus: `<div style="font-size:60px;">+</div>`,
 choices: "NO_KEYS",
 trial_duration: 500
};

var pause = {
 type: jsPsychHtmlKeyboardResponse,
 stimulus: `
   <p style="font-size:20px;font-weight:bold;"> 你将看到一个粉色的图形！</p>
   <p>(按空格键继续。)</p>
 `,
 choices: [' ']
};

var pausePair = {
 type: jsPsychHtmlKeyboardResponse,
 stimulus: `
   <p style="font-size:20px;font-weight:bold;"> 你将看到一对图形！</p>
   <p>(按空格键继续。)</p>
 `,
 choices: [' '], // restricts to space bar press
};



function getpromptTrials() {
  return {
    // block instructions
    PreSlider_instruction:  PreSlider_instruction,
    PostSlider_instruction:  PostSlider_instruction,
    PassLabel_instruction:  PassLabel_instruction,
    ActLabel_instruction: ActLabel_instruction,
    PassRel_instruction: PassRel_instruction,
    ActRel_instruction: ActRel_instruction,
    PassAbs_instruction: PassAbs_instruction,
    ActAbs_instruction: ActAbs_instruction,
    PassLearn_continue: PassLearn_continue,
    ActLearn_continue: ActLearn_continue,
    PostNormlab_instruction: Postlab_norm,
    PostModlab_instruction: Postlab_mod,
    // welcome and closue
    openning: welcome,
    waiting: waiting,
    closing: closing,
    // fixation
    fixation: fixation,
    pause: pause,
    pausePair: pausePair
  };
}

window.getpromptTrials = getpromptTrials;

/* * * * * * * * * * * * * * * * * * Prompts * * * * * * * ** * * * *  * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


const PreLabelSlider = `
  <p style="margin-Bottom: 2px !important;">参考<b>两端灰色的图形</b>，</p>
  <p style="margin-Top: 0px !important;"><b>你会把粉色的图形放在滑动条的哪个位置？</b></p>
`;

function DegQSlider(stimulus) {
  const randomlabel = stimulus.randomlabel;
  return `
    <p style="margin-Bottom: 2px !important;">请使用滑动条作答，<b>这个粉色的图形有多${randomlabel}？</b></p>
`;}

function EquaSlider(stimulus) {
  const randomlabel = stimulus.randomlabel;
  return `
    <p style="margin-Bottom: 2px !important;">粉色的图形与灰色的图形<b>一样<i>${randomlabel}</i></b>，</p>
    <p style="margin-Bottom: 2px !important;">你会把粉色的图形放在滑动条的哪个位置？</p>
`;}

function CompSlider(stimulus) {
  const adj = stimulus.adj;
  return `
    <p style="margin-Bottom: 2px !important;">粉色的图形<b><i>比灰色的图形更${adj}</i></b>，</p>
    <p style="margin-Bottom: 2px !important;">你会把粉色的图形放在滑动条的哪个位置？</p>
`;}

const OverSlider = `
  <p style="margin-Bottom: 2px !important;">请使用滑动条<b>标记粉色的图形的位置</b></p>
`;


function LabLearn(stimulus, labelType) {
  const adj = stimulus.adj;
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色的图形是<b><i>${adj}</i></b>的。</br>
    (按空格键继续。)</p>
`;}

function CompLearn(stimulus, labelType) {
  const adj = stimulus.adj;
  return `
    <p style="margin-Bottom: 2px !important;"><b><i>粉色的图形</i></b>比灰色的图形<b><i>${adj}</i></b>。</br>
    (按空格键继续。)</p>
`;}

function AbsLearn(stimulus, labelType) {
  const modifier = (labelType === 'MP') ? stimulus.deg + ' 格' : (labelType === 'Adv') ? stimulus.adv : '';
  const adj = (labelType === 'Bare' || labelType === 'Adv') ? stimulus.adj : '';
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色的图形是${(labelType === 'MP') ? '大约 ' : ''}
    <b><i>${modifier ? modifier + ' ' : ''}${adj}</i></b>。</br>
    (按空格键继续。)</p>
`;}

function RelLearn(stimulus, labelType) {
  const modifier = (labelType === 'Adv') ? stimulus.adv : stimulus.deg + ' 格';
  const adj = stimulus.adj;
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色的图形比灰色的图形${adj}${(labelType === 'MP') ? '大约 ' : ''}
    <b><i>${modifier ? modifier + ' ' : ''}</i></b>。</br>
    (按空格键继续。)</p>
`;}

function LabLearnAct(stimulus, labelType) {
  const correct = stimulus.key;
  const LevArray = Array.from({ length: linglabels.length }, (_, i) => i);
  const remainingLabels = LevArray.filter(label => label !== correct);
  const randomLabel = remainingLabels[Math.floor(Math.random() * remainingLabels.length)];
  const [Ia, Ib] = Shuffle([randomLabel, correct]);
  stimulus.key = (Ia === correct) ? 'q' : 'p';
  const [A, B] = [linglabels[Ia], linglabels[Ib]];
  stimulus.order = [`是${A}的`, `是${B}的`];
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色的图形是：</br>
    <strong>Q</strong>: <strong>${A}的</strong>    <strong>P</strong>: <strong>${B}的</strong></p>
`;}

function CompLearnAct(stimulus, labelType) {
  const adj = stimulus.adj;
  const correct = stimulus.key;
  const LevArray = Array.from({ length: linglabels.length }, (_, i) => i);
  const remainingLabels = LevArray.filter(label => label !== correct);
  const randomLabel = remainingLabels[Math.floor(Math.random() * remainingLabels.length)];
  const [Ia, Ib] = Shuffle([randomLabel, correct]);
  stimulus.key = (Ia === correct) ? 'q' : 'p';
  const [A, B] = [linglabels[Ia], linglabels[Ib]];
  stimulus.order = [`${A}`, `${B}`];
  return `
    <p style="margin-Bottom: 2px !important;">粉色的图形<b>比灰色的图形___</b>：</br>
    <strong>Q</strong>: <strong>${A}</strong>    <strong>P</strong>: <strong>${B}</strong></p>
`;}

function AbsLearnAct(stimulus, labelType) {
  const [A, B, C] = (labelType === 'MP') ? ['大约 3 格', '大约 4 格', '大约 5 格'] : ['有点', '比较', '非常'];
  const adj = stimulus.adj;
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色图形：</br>
    <strong>Q</strong>: <strong>${A}</strong>    <strong>T</strong>: <strong>${B}</strong>    <strong>P</strong>: <strong>${C}</strong></p>
`;}

function RelLearnAct(stimulus, labelType) {
  const [A, B, C] = (labelType === 'MP') ? ['大约 1 格', '大约 2 格', '大约 3 格'] : ['一点', '不少', '很多'];
  const adj = stimulus.adj;
  stimulus.key = stimulus.LevKey;
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色图形比灰色图形<b>${adj}</b>多少？</br>
    <strong>Q</strong>: <strong>${adj}${A}</strong>    <strong>T</strong>: <strong>${adj}${B}</strong>    <strong>P</strong>: <strong>${adj}${C}</strong></p>
`;}

function IntLab(stimulus, labelType) {
  const [A, B, C] = ['有点', '比较', '非常'];
  const correct = stimulus.key;
  const LevArray = Array.from({ length: linglabels.length }, (_, i) => i);
  const remainingLabels = LevArray.filter(label => label !== correct);
  const randomLabel = remainingLabels[Math.floor(Math.random() * remainingLabels.length)];
  const [Ia, Ib] = Shuffle([randomLabel, correct]);
  stimulus.key = (Ia === correct) ? 'q' : 'p';
  const [a, b] = [linglabels[Ia], linglabels[Ib]];
  stimulus.order = [`${A} ${a}`, `${B} ${a}`,`${C} ${a}`,`${A} ${b}`,`${B} ${b}`,`${C} ${b}`];
  return `
    <p style="margin-Bottom: 2px !important;">这个粉色图形：</br>
    <strong>1</strong>: <strong>${A} ${a}</strong>  <strong>2</strong>: <strong>${B} ${a}</strong>  <strong>3</strong>: <strong>${C} ${a}</strong></br>
    <strong>4</strong>: <strong>${A} ${b}</strong>  <strong>5</strong>: <strong>${B} ${b}</strong>  <strong>6</strong>: <strong>${C} ${b}</strong></p>
`;}

// takes in a label dictionary, and a trial type, output the resulting prompt
function getprompts({ stimulus, promptType, labelType }) {
    const promptTemplates = {   // Predefined prompt templates for different trial types
      PreLabelSlider: () => PreLabelSlider,  // No variables, return directly
      DegQSlider: () => DegQSlider(stimulus),  // Uses {label}
      EquaSlider: () => EquaSlider(stimulus),  // Uses {label}
      CompSlider: () => CompSlider(stimulus),  // Uses {label}
      OverSlider: () => OverSlider,  // No variables, return directly
      NormLab: () => LabLearnAct(stimulus, labelType),  // Uses {A}, {B} for Adj
      OrdLab: () => CompLearnAct(stimulus, labelType),  // Uses {A}, {B} for Adj
      IntLab: () => IntLab(stimulus, labelType),  // No variables, return directly
      LabLearn: () => LabLearn(stimulus, labelType), // Uses {label}
      CompLearn: () => CompLearn(stimulus, labelType), // Uses {label}
      AbsLearn: () => AbsLearn(stimulus, labelType), // Uses {complement}
      RelLearn: () => RelLearn(stimulus, labelType), // Uses {modifier}, {Adj}
      LabLearnAct: () => LabLearnAct(stimulus, labelType),  // Uses {A}, {B} for Adj
      CompLearnAct: () => CompLearnAct(stimulus, labelType),  // Uses {A}, {B} for Adj
      AbsLearnAct: () => AbsLearnAct(stimulus, labelType),  // Uses {A}, {B}, {C} for complement
      RelLearnAct: () => RelLearnAct(stimulus, labelType),  // Uses {A}, {B}, {C} for modifier
    };
    const template = promptTemplates[promptType];
    if (!template) {
        throw new Error(`Unknown trial type for prompt: ${promptType}`);
    }
    return template();
}

window.getprompts = getprompts;
window.posprompt = "<p style=font-size:20px;font-weight:bold;>回答正确!</p>";
window.negprompt = "<p style=font-size:20px;font-weight:bold;>再试一次？</p>";
