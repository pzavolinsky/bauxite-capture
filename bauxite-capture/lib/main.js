var data    = require('sdk/self').data;
var pageMod = require('sdk/page-mod');
var ui      = require('sdk/ui');
var tabs    = require("sdk/tabs")

var recordButton = ui.ToggleButton({
  id: 'bauxite-capture-record',
  label: 'Record Baxuite Test',
  icon: {
    '16': data.url('icon-record-16.png'),
    '22': data.url('icon-record-22.png'),
    '32': data.url('icon-record-32.png')
  },
  onClick: function(state) { toggleCapture(); }
});

var sidebar_port;
var sidebar_queue = [];
function sidebarEmit(type, message) {
  if (sidebar_port) sidebar_port.emit(type, message);
  else sidebar_queue.push({ type: type, message: message});
}
var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url('sidebar.html'),
  onAttach: function(worker) { sidebar_port = worker.port; },
  onDetach: function()       { sidebar_port = null;        },
  onShow: function(worker) {
    for (var i in sidebar_queue) {
      var q = sidebar_queue[i];
      sidebar_port.emit(q.type, q.message);
    }
    sidebar_queue = [];
  }
});

var captureData;
function toggleCapture() {
  if (captureData) stopCapture();
  else startCapture();
}
function setupCapture(tab) {
  var worker = tab.attach({
    contentScriptFile: [
      data.url('jquery-1.11.2.min.js'),
      data.url('selectors.js'),
      data.url('events.js'),
      data.url('injected.js')
    ]
  });

  if (captureData.worker == worker) return;

  if (captureData.worker) captureData.worker.destroy();
  captureData.worker = worker;

  worker.port.on('capture', function(data) {
    sidebarEmit('capture', data);
    var action = [data.action, data.selector];
    if (data.args) action.push(data.args);
  });
}
function startCapture() {
  if (captureData) return;

  captureData = { tab: tabs.activeTab };

  sidebarEmit('capture', {action: 'reset' });
  sidebarEmit('capture', {action: 'open', args: [ tabs.activeTab.url ] })
  tabs.activeTab.on('ready', setupCapture);
  setupCapture(tabs.activeTab);
  sidebar.show();
}
function stopCapture() {
  if (!captureData) return;
  captureData.tab.removeListener('ready', setupCapture);
  captureData.worker.destroy();
  captureData = null;
  sidebar.hide();
}