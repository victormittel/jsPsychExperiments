////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [1280, 720];
const canvas_border = '5px solid black';

const check_screen = {
  type: 'check-screen-resolution',
  width: canvas_size[0],
  height: canvas_size[1],
  timing_post_trial: 0,
  on_finish: function () {
    reload_if_not_fullscreen();
  },
};

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  fbDur: [500, 1000], // feedback duration for correct and incorrect trials, respectively
  waitDur: 1000,
  iti: 500,
  fixPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  fixDur: 1000,
  stimPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  startBox: [canvas_size[0] / 2, canvas_size[1] * 0.9, 50, 50], // xpos, ypos, xsize, ysize
  leftBox: [50, 50, 150, 100], // xpos, ypos, xsize, ysize
  rightBox: [1230, 50, 150, 100], // xpos, ypos, xsize, ysize
  leftImageAnchor: [300, 250],
  rightImageAnchor: [980, 250],
  keepFixation: false, // is fixation cross kept on screen with stimulus
  drawStartBox: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxes: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxesImage: [false, true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  boxLineWidth: 2, // linewidth of the start/target boxes
  requireMousePressStart: true, // is mouse button press inside start box required to initiate trial?
  requireMousePressFinish: false, // is mouse button press inside response box required to end trial?
  stimFont: '50px arial',
  fbTxt: ['Richtig', 'Falsch'],
  fbFont: '40px Arial',
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                     Experiment Utilities                           //
////////////////////////////////////////////////////////////////////////
function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  let xpos;
  let ypos;
  if (dat.end_loc === 'left') {
    xpos = prms.leftBox[0] + 25;
    ypos = prms.leftBox[1];
  } else if (dat.end_loc === 'right') {
    xpos = prms.rightBox[0] - 25;
    ypos = prms.rightBox[1];
  } else {
    // Fallback to mouse coords
    xpos = dat.end_x;
    ypos = dat.end_y;
  }

  ctx.fillText(prms.fbTxt[dat.corrCode], xpos, ypos);
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = dat.correct_side !== dat.end_loc ? 1 : 0;
  jsPsych.data.addDataToLastTrial({ date: Date(), corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl });
  prms.cTrl += 1;
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const example_start = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style = 'text-align: center;'> Jetzt kommen Bilder dazu. So wird das eigentliche Experiment später aussehen.</H1>" +
    "<H3 style = 'text-align: left;'> Drücken Sie eine beliebige Taste um fortzufahren!  </H3>",
  post_trial_gap: prms.waitDur,
  on_start: function () {
    prms.cBlk += 1;
  },
};

const exp_start = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style = 'text-align: center;'> Jetzt beginnt das eigentliche Experiment </H1>" +
    "<H3 style = 'text-align: left;'> Sie erhalten ab sofort kein Feedback mehr. </H3>" +
    "<H3 style = 'text-align: left;'> Ansonsten ist der Ablauf der gleiche wie in den Übungsdurchgängen gerade eben. </H3>" +
    "<H3 style = 'text-align: left;'> Zur Erinnerung:   </H3>" +
    "<H3 style = 'text-align: left;'> 1. Quadrat unten in der Mitte anklicken </H3>" +
    "<H3 style = 'text-align: left;'> 2. Mauszeiger in das Quadrat bewegen, dessen Bild am besten zu dem Wort passt/mit ihm zusammenhängt  </H3>" +
    "<H3 style = 'text-align: left;'> Bitte reagieren Sie so schnell und korrekt wie möglich!  </H3>" +
    "<H3 style = 'text-align: left;'> Drücken Sie eine beliebige Taste um fortzufahren!  </H3>",
  post_trial_gap: prms.waitDur,
  on_start: function () {
    prms.cBlk += 1;
  },
};

const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style = 'text-align: left;'> BITTE NUR TEILNEHMEN, WENN EINE  </H1>" +
    "<H1 style = 'text-align: left;'> COMPUTERMAUS ZUR VERFÜGUNG STEHT! </H1> <br>" +
    "<H2 style = 'text-align: left;'> Lieber Teilnehmer/ Liebe Teilnehmerin,  </H2> <br>" +
    "<H3 style = 'text-align: left;'> In diesem Experiment sehen Sie in jedem Durchgang drei Quadrate und zwei Bilder. </H3>" +
    "<H3 style = 'text-align: left;'> Um den Durchgang zu starten, klicken Sie auf das Quadrat unten in der Mitte. </H3>" +
    "<H3 style = 'text-align: left;'> Danach erscheint ein Wort auf dem Bildschirm </H3> <br>" +
    "<H3 style = 'text-align: left;'> Ihre Aufgabe ist es, das Bild auszuwählen, das am besten zu dem Wort passt oder mit ihm in  </H3>" +
    "<H3 style = 'text-align: left;'> Zusammenhang steht, und den Mauszeiger in das zugehörige Quadrat zu bewegen.  </H3>" +
    "<H3 style = 'text-align: left;'> Bitte reagieren Sie so schnell und korrekt wie möglich. </H3>" +
    "<H3 style = 'text-align: left;'> Zuerst folgt ein Übungsblock, in dem Sie zusätzlich Feedback zu Ihren Antworten erhalten. </H3>" +
    "<H3 style = 'text-align: left;'> Im ersten Teil Übungsblocks sind noch keine Bilder zu sehen.</H3>" +
    "<H3 style = 'text-align: left;'> Reagieren Sie nur auf die Anweisung die nach klicken des Quadrats erscheint.</H3>" +
    "<h3 style = 'text-align: center;'> Drücken Sie eine beliebige Taste, um fortzufahren! </h3>",
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//               Stimuli/Timelines                                    //
////////////////////////////////////////////////////////////////////////
function stimuli_factory(items) {
  let stimuli = [];
  for (const s of items) {
    let stimulus = {};
    // randomly position targets left or right
    if (Math.random() < 0.5) {
      stimulus.right = s.target_rel_img;
      stimulus.left = s.target_unrel_img;
      stimulus.correct_side = 'right';
    } else {
      stimulus.right = s.target_unrel_img;
      stimulus.left = s.target_rel_img;
      stimulus.correct_side = 'left';
    }
    // randomly select probe type
    if (Math.random() < 0.5) {
      stimulus.probe = s.probe_amb;
      stimulus.probe_type = 'ambiguous';
    } else {
      stimulus.probe = s.probe_unamb;
      stimulus.probe_type = 'unambiguous';
    }
    stimuli.push(stimulus);
  }
  return stimuli;
}

// prettier-ignore
const training_stimuli = [
    { probe: 'Nach links',  target_rel_text: '', probe_type: null, correct_side: 'left'},
    { probe: 'Nach rechts', target_rel_text: '', probe_type: null, correct_side: 'right'},
  ];

const example_stimuli = stimuli_factory(example_items);
const exp_stimuli = stimuli_factory(items);

function image_array(x) {
  'use strict';
  let images = [];
  for (let i = 0; i < x.length; i++) {
    images.push(x[i].left);
    images.push(x[i].right);
  }
  return images;
}

const image_list = image_array(exp_stimuli);

const images = {
  type: 'preload',
  auto_preload: true,
  images: image_list,
};

const trial_stimulus = {
  type: 'mouse-image-response-2-steps',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  fixation_duration: prms.fixDur,
  fixation_position: prms.fixPos,
  stimulus: jsPsych.timelineVariable('probe'),
  stimulus_position: prms.stimPos,
  stimulus_colour: 'black',
  stimulus_font: prms.stimFont,
  start_box: prms.startBox,
  left_box: prms.leftBox,
  right_box: prms.rightBox,
  left_box_colour: 'gray',
  right_box_colour: 'gray',
  left_image: jsPsych.timelineVariable('left'),
  right_image: jsPsych.timelineVariable('right'),
  left_image_anchor: prms.leftImageAnchor,
  right_image_anchor: prms.rightImageAnchor,
  keep_fixation: prms.keepFixation,
  draw_start_box: prms.drawStartBox,
  draw_response_boxes: prms.drawResponseBoxes,
  draw_response_boxes_image: prms.drawResponseBoxesImage,
  box_linewidth: prms.boxLineWidth,
  require_mouse_press_start: prms.requireMousePressStart,
  require_mouse_press_finish: prms.requireMousePressFinish,
  data: {
    stim_type: 'cse_mouse_tracking',
    probe: jsPsych.timelineVariable('probe'),
    probe_type: jsPsych.timelineVariable('probe_type'),
    left: jsPsych.timelineVariable('left'),
    right: jsPsych.timelineVariable('right'),
    correct_side: jsPsych.timelineVariable('correct_side'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: null,
  translate_origin: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode];
  },
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const training_timeline = {
  timeline_variables: training_stimuli,
  timeline: [trial_stimulus, trial_feedback, iti],
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

const example_timeline = {
  timeline_variables: example_stimuli,
  timeline: [trial_stimulus, trial_feedback, iti],
  randomize_order: true,
};

const exp_timeline = {
  timeline_variables: exp_stimuli,
  timeline: [trial_stimulus, iti],
  randomize_order: true,
};

// For VP Stunden
const randomString = generateRandomString(16);

// TODO: Change thanks
const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>sprachstudien@psycho.uni-tuebingen.de<br> Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data_json.php', data_filename, { stim_type: 'cse_mouse_tracking' }, 'json');
  },
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction_data/' + expName + '_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
  },
  timing_post_trial: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  timing_post_trial: 200,
};
////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(check_screen);
  exp.push(welcome_de);
  exp.push(resize_de);
  // exp.push(vpInfoForm_de);

  exp.push(images);
  exp.push(task_instructions);

  // Run training block
  // exp.push(training_timeline);

  // Run example trials
  exp.push(example_start);
  exp.push(example_timeline);

  // Run real experiment
  exp.push(exp_start);
  exp.push(exp_timeline);

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(debrief_de);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  on_interaction_data_update: function (data) {
    update_user_interaction_data(data);
  },
});