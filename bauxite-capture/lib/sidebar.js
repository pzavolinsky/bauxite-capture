var data       = require('sdk/self').data;
var ui         = require('sdk/ui');
var fs         = require('sdk/io/file');
var filepicker = require('./filepicker.js');
var bauxite    = require('./bauxite.js');
var result     = require('./result.js');

var sidebar_port;
var sidebar_queue = [];
var sidebar_data;
var sidebar_url;

function sidebarEmit(type, message) {
  var payload = { type: type, message: message};
  if (sidebar_port) sidebar_port.emit(type, message);
  else sidebar_queue.push(payload);
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
  stream.write(sidebar_data);
  stream.flush();
  stream.close();
}

function execData() {
  bauxite.run(sidebar_data, function(output, ok) {
    result.show({ output: output, ok: ok });
  });
}

var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url('sidebar.html'),
  onAttach: function(worker) {
    sidebar_port = worker.port;
    sidebar_port.on('save', function() { saveData(); });
    sidebar_port.on('store', function(data) { sidebar_data = data; });
    sidebar_port.on('exec', function() { execData(); });
  },
  onDetach: function() { sidebar_port = null; },
  onShow: function(worker) {
    sidebar_port.emit('config', { bauxite: bauxite.installed });
    if (sidebar_data) sidebar_port.emit('load', sidebar_data);
    for (var i in sidebar_queue) {
      var payload = sidebar_queue[i];
      sidebar_port.emit(payload.type, payload.message);
    }
    sidebar_queue = [];
  }
});

exports.add = function(message) {
  if (!sidebar_url && message.action == 'open') sidebar_url = message.args[0];
  var action = [message.action];
  if (message.selector) action.push(message.selector);
  if (message.args) action.push(message.args);
  var text = action.join(' ');
  sidebarEmit('add', text);
}
exports.reset = function() { sidebar_data = null; sidebar_url = null; sidebarEmit('reset'); }
exports.show  = function() { sidebar.show(); }
exports.hide  = function() { sidebar.hide(); }

