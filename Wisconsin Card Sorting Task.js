/************************************ 
 * Wisconsin Card Sorting Task Test *
 ************************************/

import { core, data, sound, util, visual } from './lib/psychojs-2022.1.2.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// ─────────────────────────────────────────────────────────────
// WCST-64 CONSTANTS
// ─────────────────────────────────────────────────────────────

const COLORS   = ['red', 'green', 'yellow', 'blue'];
const SHAPES   = ['triangle', 'star', 'cross', 'dot'];
const NUMBERS  = [1, 2, 3, 4];

// 6 sets, 10 consecutive correct answers required per set
const PRINCIPLES      = ['colour', 'shape', 'number', 'colour', 'shape', 'number'];
const CORRECT_PER_SET = 10;

// Fixed reference cards (top row):
//   pos 0: 1 red triangle   pos 1: 2 green stars
//   pos 2: 3 yellow crosses  pos 3: 4 blue dots
const REF_CARDS = [
  { number: 1, color: 'red',    shape: 'triangle' },
  { number: 2, color: 'green',  shape: 'star'     },
  { number: 3, color: 'yellow', shape: 'cross'    },
  { number: 4, color: 'blue',   shape: 'dot'      },
];

// Pre-computed 64-card deck (no two consecutive cards share colour, shape, OR number)
const DECK = [
  {number:2,color:'blue',   shape:'star'},
  {number:1,color:'red',    shape:'triangle'},
  {number:3,color:'green',  shape:'cross'},
  {number:4,color:'yellow', shape:'dot'},
  {number:1,color:'red',    shape:'star'},
  {number:2,color:'green',  shape:'cross'},
  {number:3,color:'yellow', shape:'dot'},
  {number:1,color:'blue',   shape:'triangle'},
  {number:4,color:'green',  shape:'cross'},
  {number:1,color:'blue',   shape:'star'},
  {number:2,color:'yellow', shape:'dot'},
  {number:3,color:'red',    shape:'triangle'},
  {number:4,color:'green',  shape:'dot'},
  {number:2,color:'red',    shape:'triangle'},
  {number:3,color:'yellow', shape:'cross'},
  {number:4,color:'blue',   shape:'star'},
  {number:1,color:'green',  shape:'cross'},
  {number:2,color:'red',    shape:'star'},
  {number:3,color:'yellow', shape:'triangle'},
  {number:4,color:'blue',   shape:'dot'},
  {number:1,color:'red',    shape:'cross'},
  {number:2,color:'green',  shape:'star'},
  {number:3,color:'blue',   shape:'triangle'},
  {number:1,color:'yellow', shape:'dot'},
  {number:4,color:'green',  shape:'star'},
  {number:2,color:'red',    shape:'cross'},
  {number:4,color:'blue',   shape:'triangle'},
  {number:3,color:'red',    shape:'cross'},
  {number:1,color:'green',  shape:'star'},
  {number:2,color:'blue',   shape:'triangle'},
  {number:1,color:'red',    shape:'dot'},
  {number:2,color:'yellow', shape:'triangle'},
  {number:1,color:'green',  shape:'dot'},
  {number:2,color:'yellow', shape:'star'},
  {number:3,color:'blue',   shape:'cross'},
  {number:4,color:'red',    shape:'dot'},
  {number:2,color:'yellow', shape:'cross'},
  {number:3,color:'blue',   shape:'star'},
  {number:4,color:'red',    shape:'triangle'},
  {number:1,color:'blue',   shape:'dot'},
  {number:3,color:'green',  shape:'star'},
  {number:4,color:'yellow', shape:'triangle'},
  {number:3,color:'green',  shape:'dot'},
  {number:4,color:'red',    shape:'cross'},
  {number:1,color:'yellow', shape:'triangle'},
  {number:3,color:'blue',   shape:'dot'},
  {number:4,color:'red',    shape:'star'},
  {number:1,color:'yellow', shape:'cross'},
  {number:2,color:'green',  shape:'dot'},
  {number:4,color:'yellow', shape:'cross'},
  {number:2,color:'green',  shape:'triangle'},
  {number:3,color:'red',    shape:'star'},
  {number:1,color:'blue',   shape:'cross'},
  {number:3,color:'red',    shape:'dot'},
  {number:4,color:'green',  shape:'triangle'},
  {number:1,color:'yellow', shape:'star'},
  {number:2,color:'blue',   shape:'cross'},
  {number:3,color:'green',  shape:'triangle'},
  {number:2,color:'blue',   shape:'dot'},
  {number:4,color:'yellow', shape:'star'},
  {number:1,color:'green',  shape:'triangle'},
  {number:2,color:'red',    shape:'dot'},
  {number:3,color:'yellow', shape:'star'},
  {number:4,color:'blue',   shape:'cross'},
];

// ─────────────────────────────────────────────────────────────
// WCST-64 HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function cardImage(n, c, s) {
  const shapeNames = {
    triangle: n === 1 ? 'Triangle' : 'Triangles',
    star:     n === 1 ? 'Star'     : 'Stars',
    cross:    n === 1 ? 'Cross'    : 'Crosses',
    dot:      n === 1 ? 'Dot'      : 'Dots',
  };
  return `images/${n}${c}${shapeNames[s]}.jpg`;
}

function getCorrectRefIdx(card, principle) {
  if (principle === 'colour') return COLORS.indexOf(card.color);
  if (principle === 'shape')  return SHAPES.indexOf(card.shape);
  return NUMBERS.indexOf(card.number);
}

function getUsedPrinciples(stim, clickedIdx) {
  const ref  = REF_CARDS[clickedIdx];
  const used = [];
  if (stim.color  === ref.color)  used.push('colour');
  if (stim.shape  === ref.shape)  used.push('shape');
  if (stim.number === ref.number) used.push('number');
  return used;
}

function getErrorType(usedPrinciples, currentPrinciple, previousPrinciple) {
  if (usedPrinciples.includes(currentPrinciple))                        return 'none';
  if (previousPrinciple && usedPrinciples.includes(previousPrinciple)) return 'perseverative';
  return 'non-perseverative';
}

// store info about the experiment session:
let expName = 'Wisconsin Card Sorting Task';  // from the Builder filename that created this script
let expInfo = {'participant': '', 'session': '001', 'group': '', 'time_of_day': ''};

// Parse URL parameters before showing the setup dialog so that URL-provided
// fields can be excluded from the dialog (e.g. when launched from Qualtrics).
const _urlParams = new URLSearchParams(window.location.search);
const _urlExpInfo = {};
for (const [key, value] of _urlParams.entries()) {
  if (key in expInfo) {
    _urlExpInfo[key] = value;
  }
}
// Apply URL-provided values to expInfo immediately.
Object.assign(expInfo, _urlExpInfo);
// Build a dialog-only info object containing only fields NOT provided via URL.
const _dialogExpInfo = {};
for (const key of Object.keys(expInfo)) {
  if (!(key in _urlExpInfo)) {
    _dialogExpInfo[key] = expInfo[key];
  }
}

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([0, 0, 0]),
  units: 'height',
  waitBlanking: true
});
// schedule the experiment:
// Always show the setup dialog so resources can be loaded and the participant
// can confirm readiness. Fields already provided via URL are omitted from the
// dialog, but the dialog itself is always displayed.
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: _dialogExpInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(InstructionsRoutineBegin());
flowScheduler.add(InstructionsRoutineEachFrame());
flowScheduler.add(InstructionsRoutineEnd());
flowScheduler.add(ExampleRoutineBegin());
flowScheduler.add(ExampleRoutineEachFrame());
flowScheduler.add(ExampleRoutineEnd());
const trialLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialLoopBegin(trialLoopScheduler));
flowScheduler.add(trialLoopScheduler);
flowScheduler.add(trialLoopEnd);
flowScheduler.add(EndRoutineBegin());
flowScheduler.add(EndRoutineEachFrame());
flowScheduler.add(EndRoutineEnd());
flowScheduler.add(quitPsychoJS, '', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    {'name': 'images/3blueCrosses.jpg', 'path': 'images/3blueCrosses.jpg'},
    {'name': 'images/3yellowCrosses.jpg', 'path': 'images/3yellowCrosses.jpg'},
    {'name': 'images/2greenStars.jpg', 'path': 'images/2greenStars.jpg'},
    {'name': 'images/2redCrosses.jpg', 'path': 'images/2redCrosses.jpg'},
    {'name': 'images/3yellowDots.jpg', 'path': 'images/3yellowDots.jpg'},
    {'name': 'images/4blueTriangles.jpg', 'path': 'images/4blueTriangles.jpg'},
    {'name': 'images/4redCrosses.jpg', 'path': 'images/4redCrosses.jpg'},
    {'name': 'images/2blueStars.jpg', 'path': 'images/2blueStars.jpg'},
    {'name': 'images/3greenStars.jpg', 'path': 'images/3greenStars.jpg'},
    {'name': 'images/1yellowTriangle.jpg', 'path': 'images/1yellowTriangle.jpg'},
    {'name': 'example.jpg', 'path': 'example.jpg'},
    {'name': 'images/1redTriangle.jpg', 'path': 'images/1redTriangle.jpg'},
    {'name': 'images/3redTriangles.jpg', 'path': 'images/3redTriangles.jpg'},
    {'name': 'images/4yellowTriangles.jpg', 'path': 'images/4yellowTriangles.jpg'},
    {'name': 'images/3redStars.jpg', 'path': 'images/3redStars.jpg'},
    {'name': 'images/2greenDots.jpg', 'path': 'images/2greenDots.jpg'},
    {'name': 'images/3yellowStars.jpg', 'path': 'images/3yellowStars.jpg'},
    {'name': 'images/3yellowTriangles.jpg', 'path': 'images/3yellowTriangles.jpg'},
    {'name': 'images/1greenTriangle.jpg', 'path': 'images/1greenTriangle.jpg'},
    {'name': 'images/3greenDots.jpg', 'path': 'images/3greenDots.jpg'},
    {'name': 'images/2blueTriangles.jpg', 'path': 'images/2blueTriangles.jpg'},
    {'name': 'images/4greenDots.jpg', 'path': 'images/4greenDots.jpg'},
    {'name': 'images/2yellowDots.jpg', 'path': 'images/2yellowDots.jpg'},
    {'name': 'images/2yellowStars.jpg', 'path': 'images/2yellowStars.jpg'},
    {'name': 'images/3greenTriangles.jpg', 'path': 'images/3greenTriangles.jpg'},
    {'name': 'images/2greenTriangles.jpg', 'path': 'images/2greenTriangles.jpg'},
    {'name': 'images/4blueCrosses.jpg', 'path': 'images/4blueCrosses.jpg'},
    {'name': 'images/2redStars.jpg', 'path': 'images/2redStars.jpg'},
    {'name': 'continue.png', 'path': 'continue.png'},
    {'name': 'images/3blueDots.jpg', 'path': 'images/3blueDots.jpg'},
    {'name': 'images/2yellowCrosses.jpg', 'path': 'images/2yellowCrosses.jpg'},
    {'name': 'images/2yellowTriangles.jpg', 'path': 'images/2yellowTriangles.jpg'},
    {'name': 'images/3blueTriangles.jpg', 'path': 'images/3blueTriangles.jpg'},
    {'name': 'images/4yellowStars.jpg', 'path': 'images/4yellowStars.jpg'},
    {'name': 'images/4greenStars.jpg', 'path': 'images/4greenStars.jpg'},
    {'name': 'images/2greenCrosses.jpg', 'path': 'images/2greenCrosses.jpg'},
    {'name': 'images/4blueDots.jpg', 'path': 'images/4blueDots.jpg'},
    {'name': 'images/4redDots.jpg', 'path': 'images/4redDots.jpg'},
    {'name': 'images/4greenTriangles.jpg', 'path': 'images/4greenTriangles.jpg'},
    {'name': 'images/4greenCrosses.jpg', 'path': 'images/4greenCrosses.jpg'},
    {'name': 'images/4blueStars.jpg', 'path': 'images/4blueStars.jpg'},
    {'name': 'images/1greenCross.jpg', 'path': 'images/1greenCross.jpg'},
    {'name': 'images/3greenCrosses.jpg', 'path': 'images/3greenCrosses.jpg'},
    {'name': 'images/4redTriangles.jpg', 'path': 'images/4redTriangles.jpg'},
    {'name': 'images/1blueDot.jpg', 'path': 'images/1blueDot.jpg'},
    {'name': 'images/1redCross.jpg', 'path': 'images/1redCross.jpg'},
    {'name': 'images/1yellowCross.jpg', 'path': 'images/1yellowCross.jpg'},
    {'name': 'images/1yellowDot.jpg', 'path': 'images/1yellowDot.jpg'},
    {'name': 'images/2blueDots.jpg', 'path': 'images/2blueDots.jpg'},
    {'name': 'images/1redStar.jpg', 'path': 'images/1redStar.jpg'},
    {'name': 'images/1greenStar.jpg', 'path': 'images/1greenStar.jpg'},
    {'name': 'images/1blueCross.jpg', 'path': 'images/1blueCross.jpg'},
    {'name': 'images/1greenDot.jpg', 'path': 'images/1greenDot.jpg'},
    {'name': 'images/1redDot.jpg', 'path': 'images/1redDot.jpg'},
    {'name': 'images/4yellowDots.jpg', 'path': 'images/4yellowDots.jpg'},
    {'name': 'images/1blueStar.jpg', 'path': 'images/1blueStar.jpg'},
    {'name': 'images/3redCrosses.jpg', 'path': 'images/3redCrosses.jpg'},
    {'name': 'images/1yellowStar.jpg', 'path': 'images/1yellowStar.jpg'},
    {'name': 'images/3redDots.jpg', 'path': 'images/3redDots.jpg'},
    {'name': 'images/1blueTriangle.jpg', 'path': 'images/1blueTriangle.jpg'},
    {'name': 'images/2blueCrosses.jpg', 'path': 'images/2blueCrosses.jpg'},
    {'name': 'images/2redTriangles.jpg', 'path': 'images/2redTriangles.jpg'},
    {'name': 'images/4redStars.jpg', 'path': 'images/4redStars.jpg'},
    {'name': 'images/4yellowCrosses.jpg', 'path': 'images/4yellowCrosses.jpg'},
    {'name': 'images/2redDots.jpg', 'path': 'images/2redDots.jpg'},
    {'name': 'images/3blueStars.jpg', 'path': 'images/3blueStars.jpg'}
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.EXP);


var frameDur;
async function updateInfo() {
  // Merge values entered in the dialog (if any) back into expInfo.
  Object.assign(expInfo, _dialogExpInfo);

  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2022.1.2';
  expInfo['OS'] = window.navigator.platform;

  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);

  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  
  return Scheduler.Event.NEXT;
}


var InstructionsClock;
var instructions;
var continue_button;
var mouse_2;
var ExampleClock;
var example_text;
var example_image;
var example_text_2;
var mouse;
var one_red_triangle;
var two_green_stars;
var three_yellow_crosses;
var four_blue_dots;
var trial_card;
var response;
var feedback_text;
var progressText;
var separator;
var EndClock;
var thank_you;
var globalClock;
var routineTimer;
async function experimentInit() {
  // Initialize components for Routine "Instructions"
  InstructionsClock = new util.Clock();
  instructions = new visual.TextStim({
    win: psychoJS.window,
    name: 'instructions',
    text: 'You will see four cards displayed at the top of the screen.',
      'One card at a time will appear in the centre of the screen.',
      '',
      'Your task is to place each card under one of the four cards at the top',
      'by clicking on the card you think it belongs with.',
      '',
      'After each response you will be told whether it was CORRECT or INCORRECT.',
      'You will NOT be told the rule for sorting.',
      'The rule may change during the test.',
      'When you think the rule has changed,',
      'find the new rule as quickly as possible.',
      '',
      'Work as quickly and accurately as you can.',
      '',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: 0.9, ori: 0,
    color: new util.Color('white'),  opacity: 1,
    depth: 0.0 
  });
  
  continue_button = new visual.ImageStim({
    win : psychoJS.window,
    name : 'continue_button', units : undefined, 
    image : 'continue.png', mask : undefined,
    ori : 0.0, pos : [0, (- 0.4)], size : [0.65, 0.1],
    color : new util.Color([1,1,1]), opacity : undefined,
    flipHoriz : false, flipVert : false,
    texRes : 128.0, interpolate : true, depth : -1.0 
  });
  mouse_2 = new core.Mouse({
    win: psychoJS.window,
  });
  mouse_2.mouseClock = new util.Clock();
  // Initialize components for Routine "Example"
  ExampleClock = new util.Clock();
  example_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'example_text',
    text: 'For example, you may see a screen like this:',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0.4], height: 0.04,  wrapWidth: undefined, ori: 0,
    color: new util.Color('white'),  opacity: 1,
    depth: 0.0 
  });
  
  example_image = new visual.ImageStim({
    win : psychoJS.window,
    name : 'example_image', units : undefined, 
    image : 'example.jpg', mask : undefined,
    ori : 0, pos : [0, 0.15], size : [0.7, 0.4],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -1.0 
  });
  example_text_2 = new visual.TextStim({
    win: psychoJS.window,
    name: 'example_text_2',
    text: 'The presented card (bottom centre) can be categorised based on shape (dots), colour (yellow) or number (three). Click on the first card if you want to categorise it by the shape, second if you want categorise it by colour and third if you want to categorise it by number. After you select your response, feedback will be provided. Click on the image to start the experiment.',
    font: 'Arial',
    units: undefined, 
    pos: [0, (- 0.25)], height: 0.04,  wrapWidth: 0.9, ori: 0,
    color: new util.Color('white'),  opacity: 1,
    depth: -2.0 
  });
  
  mouse = new core.Mouse({
    win: psychoJS.window,
  });
  mouse.mouseClock = new util.Clock();
  // Initialize components for Routine "Trials"
  one_red_triangle = new visual.ImageStim({
    win : psychoJS.window,
    name : 'one_red_triangle', units : undefined,
    image : cardImage(REF_CARDS[0].number, REF_CARDS[0].color, REF_CARDS[0].shape), mask : undefined,
    ori : 0, pos : [-0.40, 0.315], size : [0.155, 0.205],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -1.0
  });
  two_green_stars = new visual.ImageStim({
    win : psychoJS.window,
    name : 'two_green_stars', units : undefined,
    image : cardImage(REF_CARDS[1].number, REF_CARDS[1].color, REF_CARDS[1].shape), mask : undefined,
    ori : 0, pos : [-0.13, 0.315], size : [0.155, 0.205],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -2.0
  });
  three_yellow_crosses = new visual.ImageStim({
    win : psychoJS.window,
    name : 'three_yellow_crosses', units : undefined,
    image : cardImage(REF_CARDS[2].number, REF_CARDS[2].color, REF_CARDS[2].shape), mask : undefined,
    ori : 0, pos : [0.13, 0.315], size : [0.155, 0.205],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -3.0
  });
  four_blue_dots = new visual.ImageStim({
    win : psychoJS.window,
    name : 'four_blue_dots', units : undefined,
    image : cardImage(REF_CARDS[3].number, REF_CARDS[3].color, REF_CARDS[3].shape), mask : undefined,
    ori : 0, pos : [0.40, 0.315], size : [0.155, 0.205],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -4.0
  });
  trial_card = new visual.ImageStim({
    win : psychoJS.window,
    name : 'trial_card', units : undefined,
    image : undefined, mask : undefined,
    ori : 0, pos : [0.0, -0.13], size : [0.195, 0.255],
    color : new util.Color([1, 1, 1]), opacity : 1,
    flipHoriz : false, flipVert : false,
    texRes : 128, interpolate : true, depth : -5.0
  });
  response = new core.Mouse({
    win: psychoJS.window,
  });
  response.mouseClock = new util.Clock();
  // Initialize components for Routine "Feedback"
  feedback_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'feedback_text',
    text: '',
    font: 'Arial',
    units: undefined,
    pos: [0, 0.055], height: 0.075,  wrapWidth: undefined, ori: 0,
    bold: true,
    color: new util.Color('white'),  opacity: 1,
    depth: -1.0
  });
  // Thin horizontal separator between reference row and task area
  separator = new visual.Rect({
    win: psychoJS.window,
    name: 'separator',
    width: 1.70, height: 0.003,
    fillColor: new util.Color([0.3, 0.3, 0.3]),
    lineColor: new util.Color([0.3, 0.3, 0.3]),
    pos: [0, 0.155],
    units: 'height',
    depth: -2.0
  });
  // Progress indicator (bottom, centred)
  progressText = new visual.TextStim({
    win: psychoJS.window,
    name: 'progress_text',
    text: '',
    font: 'Arial',
    units: undefined,
    pos: [0, -0.44], height: 0.030,  wrapWidth: undefined, ori: 0,
    color: new util.Color([0.4, 0.4, 0.4]),  opacity: 1,
    depth: -3.0
  });
  
  // Initialize components for Routine "End"
  EndClock = new util.Clock();
  thank_you = new visual.TextStim({
    win: psychoJS.window,
    name: 'thank_you',
    text: 'This is the end of the experiment.\nThank you for your time.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0,
    color: new util.Color('white'),  opacity: 1,
    depth: 0.0 
  });
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}


var t;
var frameN;
var frameRemains;
var continueRoutine;
var gotValidClick;
var InstructionsComponents;
function InstructionsRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'Instructions'-------
    t = 0;
    InstructionsClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    // setup some python lists for storing info about the mouse_2
    mouse_2.clicked_name = [];
    gotValidClick = false; // until a click is received
    // keep track of which components have finished
    InstructionsComponents = [];
    InstructionsComponents.push(instructions);
    InstructionsComponents.push(continue_button);
    InstructionsComponents.push(mouse_2);
    
    for (const thisComponent of InstructionsComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


var prevButtonState;
var _mouseButtons;
function InstructionsRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'Instructions'-------
    // get current time
    t = InstructionsClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *instructions* updates
    if (t >= 0.0 && instructions.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      instructions.tStart = t;  // (not accounting for frame time here)
      instructions.frameNStart = frameN;  // exact frame index
      
      instructions.setAutoDraw(true);
    }

    
    // *continue_button* updates
    if (t >= 1 && continue_button.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      continue_button.tStart = t;  // (not accounting for frame time here)
      continue_button.frameNStart = frameN;  // exact frame index
      
      continue_button.setAutoDraw(true);
    }

    // *mouse_2* updates
    if (t >= 1 && mouse_2.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      mouse_2.tStart = t;  // (not accounting for frame time here)
      mouse_2.frameNStart = frameN;  // exact frame index
      
      mouse_2.status = PsychoJS.Status.STARTED;
      mouse_2.mouseClock.reset();
      prevButtonState = mouse_2.getPressed();  // if button is down already this ISN'T a new click
      }
    if (mouse_2.status === PsychoJS.Status.STARTED) {  // only update if started and not finished!
      _mouseButtons = mouse_2.getPressed();
      if (!_mouseButtons.every( (e,i,) => (e == prevButtonState[i]) )) { // button state changed?
        prevButtonState = _mouseButtons;
        if (_mouseButtons.reduce( (e, acc) => (e+acc) ) > 0) { // state changed to a new click
          // check if the mouse was inside our 'clickable' objects
          gotValidClick = false;
          for (const obj of [continue_button]) {
            if (obj.contains(mouse_2)) {
              gotValidClick = true;
              mouse_2.clicked_name.push(obj.name)
            }
          }
          if (gotValidClick === true) { // abort routine on response
            continueRoutine = false;
          }
        }
      }
    }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of InstructionsComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function InstructionsRoutineEnd() {
  return async function () {
    //------Ending Routine 'Instructions'-------
    for (const thisComponent of InstructionsComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // store data for psychoJS.experiment (ExperimentHandler)
    // the Routine "Instructions" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}


var ExampleComponents;
function ExampleRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'Example'-------
    t = 0;
    ExampleClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    // setup some python lists for storing info about the mouse
    mouse.clicked_name = [];
    gotValidClick = false; // until a click is received
    // keep track of which components have finished
    ExampleComponents = [];
    ExampleComponents.push(example_text);
    ExampleComponents.push(example_image);
    ExampleComponents.push(example_text_2);
    ExampleComponents.push(mouse);
    
    for (const thisComponent of ExampleComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function ExampleRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'Example'-------
    // get current time
    t = ExampleClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *example_text* updates
    if (t >= 0.0 && example_text.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      example_text.tStart = t;  // (not accounting for frame time here)
      example_text.frameNStart = frameN;  // exact frame index
      
      example_text.setAutoDraw(true);
    }

    
    // *example_image* updates
    if (t >= 0.0 && example_image.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      example_image.tStart = t;  // (not accounting for frame time here)
      example_image.frameNStart = frameN;  // exact frame index
      
      example_image.setAutoDraw(true);
    }

    
    // *example_text_2* updates
    if (t >= 0.0 && example_text_2.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      example_text_2.tStart = t;  // (not accounting for frame time here)
      example_text_2.frameNStart = frameN;  // exact frame index
      
      example_text_2.setAutoDraw(true);
    }

    // *mouse* updates
    if (t >= 1 && mouse.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      mouse.tStart = t;  // (not accounting for frame time here)
      mouse.frameNStart = frameN;  // exact frame index
      
      mouse.status = PsychoJS.Status.STARTED;
      mouse.mouseClock.reset();
      prevButtonState = mouse.getPressed();  // if button is down already this ISN'T a new click
      }
    if (mouse.status === PsychoJS.Status.STARTED) {  // only update if started and not finished!
      _mouseButtons = mouse.getPressed();
      if (!_mouseButtons.every( (e,i,) => (e == prevButtonState[i]) )) { // button state changed?
        prevButtonState = _mouseButtons;
        if (_mouseButtons.reduce( (e, acc) => (e+acc) ) > 0) { // state changed to a new click
          // check if the mouse was inside our 'clickable' objects
          gotValidClick = false;
          for (const obj of [example_image]) {
            if (obj.contains(mouse)) {
              gotValidClick = true;
              mouse.clicked_name.push(obj.name)
            }
          }
          if (gotValidClick === true) { // abort routine on response
            continueRoutine = false;
          }
        }
      }
    }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of ExampleComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function ExampleRoutineEnd() {
  return async function () {
    //------Ending Routine 'Example'-------
    for (const thisComponent of ExampleComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // store data for psychoJS.experiment (ExperimentHandler)
    // the Routine "Example" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}


function trialLoopBegin(trialLoopScheduler) {
  return async function() {
    _currentSet    = 0;
    _correctInSet  = 0;
    _prevPrinciple = null;
    _done          = false;

    for (let i = 0; i < DECK.length; i++) {
      trialLoopScheduler.add(trialBegin(i));
      trialLoopScheduler.add(trialEachFrame);
      trialLoopScheduler.add(trialEnd);
      trialLoopScheduler.add(feedbackBegin);
      trialLoopScheduler.add(feedbackEachFrame);
      trialLoopScheduler.add(feedbackEnd(i));
      trialLoopScheduler.add(checkDone(trialLoopScheduler));
    }
    return Scheduler.Event.NEXT;
  };
}


async function trialLoopEnd() {
  return Scheduler.Event.NEXT;
}


function checkDone(scheduler) {
  return function () {
    if (_done) {
      scheduler.stop();
    }
    return Scheduler.Event.NEXT;
  };
}


// ─────────────────────────────────────────────────────────────
// WCST-64 TRIAL STATE
// ─────────────────────────────────────────────────────────────

var _currentSet    = 0;
var _correctInSet  = 0;
var _prevPrinciple = null;
var _done          = false;
var _card;
var _clickedIdx;
var _rt;
var _correct;
var _usedPrinciples;
var _errorType;
var _trialPrinciple;
var _trialSetNumber;
var _trialPrevPrinciple;
var _prevMouseDown = false;
var _trialClock;
var _feedbackClock;


// ─────────────────────────────────────────────────────────────
// TRIAL ROUTINE
// ─────────────────────────────────────────────────────────────

function trialBegin(idx) {
  return function () {
    _card               = DECK[idx];
    _trialPrinciple     = PRINCIPLES[_currentSet];
    _trialSetNumber     = _currentSet + 1;
    _trialPrevPrinciple = _prevPrinciple;

    trial_card.setImage(cardImage(_card.number, _card.color, _card.shape));
    progressText.setText(
      `Trial ${idx + 1} / ${DECK.length}   |   Set ${_currentSet + 1} of ${PRINCIPLES.length}`
    );

    one_red_triangle.setAutoDraw(true);
    two_green_stars.setAutoDraw(true);
    three_yellow_crosses.setAutoDraw(true);
    four_blue_dots.setAutoDraw(true);
    trial_card.setAutoDraw(true);
    separator.setAutoDraw(true);
    progressText.setAutoDraw(true);

    _trialClock    = new util.Clock();
    [_prevMouseDown] = response.getPressed();
    _clickedIdx    = null;

    return Scheduler.Event.NEXT;
  };
}


async function trialEachFrame() {
  const [lb] = response.getPressed();

  if (lb && !_prevMouseDown) {
    const refCards = [one_red_triangle, two_green_stars, three_yellow_crosses, four_blue_dots];
    for (let i = 0; i < 4; i++) {
      if (refCards[i].contains(response)) {
        _clickedIdx    = i;
        _rt            = _trialClock.getTime();
        _prevMouseDown = lb;
        return Scheduler.Event.NEXT;
      }
    }
  }
  _prevMouseDown = lb;

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
    return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
  }

  return Scheduler.Event.FLIP_REPEAT;
}


async function trialEnd() {
  trial_card.setAutoDraw(false);

  const correctIdx   = getCorrectRefIdx(_card, _trialPrinciple);
  _correct           = (_clickedIdx === correctIdx);
  _usedPrinciples    = getUsedPrinciples(_card, _clickedIdx);
  _errorType         = getErrorType(_usedPrinciples, _trialPrinciple, _trialPrevPrinciple);

  if (_correct) {
    _correctInSet++;
    if (_correctInSet >= CORRECT_PER_SET) {
      _prevPrinciple = _trialPrinciple;
      _currentSet++;
      _correctInSet = 0;
      if (_currentSet >= PRINCIPLES.length) {
        _done = true;
      }
    }
  } else {
    _correctInSet = 0;
  }

  return Scheduler.Event.NEXT;
}


// ─────────────────────────────────────────────────────────────
// FEEDBACK ROUTINE
// ─────────────────────────────────────────────────────────────

async function feedbackBegin() {
  _feedbackClock = new util.Clock();
  if (_correct) {
    feedback_text.setText('Correct!');
    feedback_text.setColor(new util.Color([-1, 0.8, -1]));
  } else {
    feedback_text.setText('Incorrect!');
    feedback_text.setColor(new util.Color([0.9, -1, -1]));
  }
  feedback_text.setAutoDraw(true);
  return Scheduler.Event.NEXT;
}


async function feedbackEachFrame() {
  if (_feedbackClock.getTime() >= 1.0) {
    return Scheduler.Event.NEXT;
  }
  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
    return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
  }
  return Scheduler.Event.FLIP_REPEAT;
}


function feedbackEnd(idx) {
  return function () {
    feedback_text.setAutoDraw(false);
    one_red_triangle.setAutoDraw(false);
    two_green_stars.setAutoDraw(false);
    three_yellow_crosses.setAutoDraw(false);
    four_blue_dots.setAutoDraw(false);
    separator.setAutoDraw(false);
    progressText.setAutoDraw(false);

    psychoJS.experiment.addData('participant',        expInfo['participant']);
    psychoJS.experiment.addData('group',              expInfo['group']);
    psychoJS.experiment.addData('session',            expInfo['session']);
    psychoJS.experiment.addData('time_of_day',        expInfo['time_of_day']);
    psychoJS.experiment.addData('trial_number',       idx + 1);
    psychoJS.experiment.addData('set_number',         _trialSetNumber);
    psychoJS.experiment.addData('card_image',         cardImage(_card.number, _card.color, _card.shape));
    psychoJS.experiment.addData('card_number',        _card.number);
    psychoJS.experiment.addData('card_color',         _card.color);
    psychoJS.experiment.addData('card_shape',         _card.shape);
    psychoJS.experiment.addData('clicked_position',   _clickedIdx + 1);
    psychoJS.experiment.addData('clicked_color',      REF_CARDS[_clickedIdx].color);
    psychoJS.experiment.addData('clicked_shape',      REF_CARDS[_clickedIdx].shape);
    psychoJS.experiment.addData('clicked_number',     REF_CARDS[_clickedIdx].number);
    psychoJS.experiment.addData('current_principle',  _trialPrinciple);
    psychoJS.experiment.addData('previous_principle', _trialPrevPrinciple || 'none');
    psychoJS.experiment.addData('principles_used',
      _usedPrinciples.length ? _usedPrinciples.join(',') : 'none');
    psychoJS.experiment.addData('correct',            _correct ? 1 : 0);
    psychoJS.experiment.addData('error_type',         _errorType);
    psychoJS.experiment.addData('rt',                 _rt);

    psychoJS.experiment.nextEntry();

    [_prevMouseDown] = response.getPressed();
    return Scheduler.Event.NEXT;
  };
}


var EndComponents;
function EndRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'End'-------
    t = 0;
    EndClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    routineTimer.add(3.000000);
    // update component parameters for each repeat
    // keep track of which components have finished
    EndComponents = [];
    EndComponents.push(thank_you);
    
    for (const thisComponent of EndComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function EndRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'End'-------
    // get current time
    t = EndClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *thank_you* updates
    if (t >= 0.0 && thank_you.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      thank_you.tStart = t;  // (not accounting for frame time here)
      thank_you.frameNStart = frameN;  // exact frame index
      
      thank_you.setAutoDraw(true);
    }

    frameRemains = 0.0 + 3 - psychoJS.window.monitorFramePeriod * 0.75;  // most of one frame period left
    if (thank_you.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      thank_you.setAutoDraw(false);
    }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of EndComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine && routineTimer.getTime() > 0) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function EndRoutineEnd() {
  return async function () {
    //------Ending Routine 'End'-------
    for (const thisComponent of EndComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    return Scheduler.Event.NEXT;
  };
}


function endLoopIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        const thisTrial = snapshot.getCurrentTrial();
        if (typeof thisTrial === 'undefined' || !('isTrials' in thisTrial) || thisTrial.isTrials) {
          psychoJS.experiment.nextEntry(snapshot);
        }
      }
    return Scheduler.Event.NEXT;
    }
  };
}


function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
    };
}


async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  
  
  
  
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
