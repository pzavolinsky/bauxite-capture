var data       = require('sdk/self').data;
var ui         = require('sdk/ui');
var fs         = require('sdk/io/file');
var filepicker = require('./filepicker.js');
var bauxite    = require('./bauxite.js');
var result     = require('./result.js');
var wqueue     = require('./wqueue.js');

var sidebar_data;
var sidebar_url;
var wq = wqueue.create();
var run_count = 0;
var no_close;

function reset() {
  sidebar_data = null;
  sidebar_url = null;
  wq.emit('reset');
  run_count = 0;
  no_close = false;
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
  var res = result.open({ run: ++run_count });
  bauxite.run(sidebar_data, function(output, ok) {
    res.show({ output: output, ok: ok });
  });
}

var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url('sidebar.html'),
  onAttach: function(worker) {
    wq.set(worker);
    worker.port.on('save', function() { saveData(); });
    worker.port.on('store', function(data) { sidebar_data = data; });
    worker.port.on('exec', function() { execData(); });
  },
  onDetach: function() {
    wq.set(null);
    if (sidebar_close && !no_close) sidebar_close();
    no_close = false;
  },
  onShow: function(worker) {
    wq.emit('config', { bauxite: bauxite.installed });
    if (sidebar_data) wq.emit('load', sidebar_data);
    wq.flush();
  }
});

exports.add = function(message) {
  if (!sidebar_url && message.action == 'open') sidebar_url = message.args[0];
  var action = [message.action];
  if (message.selector) action.push(message.selector);
  if (message.args) action.push(message.args);
  var text = action.join(' ');
  wq.emit('add', text);
}
exports.reset = reset;
exports.show  = function() { sidebar.show(); }
exports.hide  = function() { no_close = true; sidebar.hide(); }
exports.onClose = function(callback) { sidebar_close = callback; }

