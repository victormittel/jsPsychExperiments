// jsPsych html-mouse-response
const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.',
];

let timeline = [];

// Mask type 1
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  for (let word_num = -1; word_num < sentences[sent_num].split(' ').length; word_num++) {
    let moving_window = {
      type: 'text-moving-window-keyboard-response',
      mask_type: 1,
      sentence: sentences[sent_num],
      word_number: word_num,
      font: '24px monospace',
      max_width: 960,
      text_align: 'left',
    };
    timeline.push(moving_window);
  }
}

// Mask type 2
for (let sent_num = 0; sent_num < sentences.length; sent_num++) {
  for (let word_num = -1; word_num < sentences[sent_num].split(' ').length; word_num++) {
    let moving_window = {
      type: 'text-moving-window-keyboard-response',
      mask_type: 2,
      sentence: sentences[sent_num],
      word_number: word_num,
      font: '24px monospace',
      max_width: 960,
      text_align: 'center',
    };
    timeline.push(moving_window);
  }
}

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData('csv');
  },
});