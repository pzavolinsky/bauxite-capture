var data    = require('sdk/self').data;
var ui      = require('sdk/ui');
var capture = require('./capture.js');

var recordButton = ui.ToggleButton({
  id: 'bauxite-capture-record',
  label: 'Record Baxuite test',
  icon: {
    '16': data.url('icon-record-16.png'),
    '22': data.url('icon-record-22.png'),
    '32': data.url('icon-record-32.png')
  },
  onClick: function(state) {
    recordButton.label = state.checked ? 'Stop recording Baxuite test' : 'Record Baxuite test';
    capture.toggle(); 
  }
});

capture.onStop(function() {
  recordButton.state('window', {checked: false});
});