var data       = require('sdk/self').data;
var ui         = require('sdk/ui');
var fs         = require('sdk/io/file');
var filepicker = require('./filepicker.js');

var sidebar_port;
var sidebar_queue = [];
var sidebar_data = [];
var sidebar_url;

function sidebarEmit(type, message, track) {
  var payload = { type: type, message: message};
  if (track) {
    if (message.action == 'reset') {
      sidebar_data = [];
      sidebar_url = null;
    } else {
      sidebar_data.push(payload);
    }
  }
  if (!sidebar_url && message.action == 'open') sidebar_url = message.args[0];
  if (sidebar_port) sidebar_port.emit(type, message);
  else sidebar_queue.push(payload);
}

function replayData() {
  for (var i in sidebar_data) {
    var payload = sidebar_data[i];
    sidebarEmit(payload.type, payload.message, false);
  }
}

function saveData() {
  var name;
  if (sidebar_url) {
    name = sidebar_url.replace(/.*:\/\/\/?/, '').replace(/\//g, '_');
  } else {
    name = 'test_'+(new Date().getTime());
  }

  var path = filepicker.promptForFile(name+'.bxt');
  if (!path) return;

  var stream = fs.open(path, 'w');

  for (var i in sidebar_data) {
    var payload = sidebar_data[i];
    if (payload.type != 'capture') continue;
    stream.write(payload.message.text+'\n');
  }
  stream.flush();
  stream.close();
}

var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url('sidebar.html'),
  onAttach: function(worker) {
    sidebar_port = worker.port;
    sidebar_port.on('save', function() { saveData(); });
  },
  onDetach: function()       { sidebar_port = null;        },
  onShow: function(worker) {
    replayData();
    sidebar_queue = [];
  }
});

exports.emit = function(type, message) {
  if (type == 'capture') {
    var action = [message.action];
    if (message.selector) action.push(message.selector);
    if (message.args) action.push(message.args);
    message.text = action.join(' ');
  }

  sidebarEmit(type, message, true);
}
exports.show = function() { sidebar.show(); }
exports.hide = function() { sidebar.hide(); }
