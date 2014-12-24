var data    = require('sdk/self').data;
var ui      = require('sdk/ui');

var sidebar_port;
var sidebar_queue = [];
var sidebar_data = [];

function sidebarEmit(type, message, track) {
  var payload = { type: type, message: message};
  if (track) {
    if (message.action == 'reset') {
      sidebar_data = [];
    } else {
      sidebar_data.push(payload);
    }
  }
  if (sidebar_port) sidebar_port.emit(type, message);
  else sidebar_queue.push(payload);
}

function replayData() {
  for (var i in sidebar_data) {
    var payload = sidebar_data[i];
    sidebarEmit(payload.type, payload.message, false);
  }
}

var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url('sidebar.html'),
  onAttach: function(worker) { sidebar_port = worker.port; },
  onDetach: function()       { sidebar_port = null;        },
  onShow: function(worker) {
    replayData();
    sidebar_queue = [];
  }
});

exports.emit = function(type, message) { sidebarEmit(type, message, true); }
exports.show = function() { sidebar.show(); }
exports.hide = function() { sidebar.hide(); }
