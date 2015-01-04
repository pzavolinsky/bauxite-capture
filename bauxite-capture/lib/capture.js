var data        = require('sdk/self').data;
var tabs        = require('sdk/tabs');
var { viewFor } = require('sdk/view/core');
var sidebar     = require('./sidebar.js');
var ctxMenu     = require('./context-menu.js');

var captureData;
var stopCallback;

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

  captureData.title = tab.title;
  tab.title += ' [rec]';
  viewFor(tab).setAttribute('style', 'color: red !important');

  if (captureData.worker == worker) return;

  if (captureData.worker) captureData.worker.destroy();
  captureData.worker = worker;

  worker.port.on('capture', function(data) {
    sidebar.add(data);
  });
}
function activateTab()   { if (!captureData) return; sidebar.show(); ctxMenu.show(); }
function deactivateTab() { sidebar.hide(); ctxMenu.hide(); }
function startCapture() {
  if (captureData) return;

  captureData = { tab: tabs.activeTab };

  sidebar.reset();
  sidebar.add({action: 'open', args: [ tabs.activeTab.url ] })
  tabs.activeTab.on('ready'     , setupCapture );
  tabs.activeTab.on('activate'  , activateTab  );
  tabs.activeTab.on('deactivate', deactivateTab);
  setupCapture(tabs.activeTab);

  sidebar.show();
  ctxMenu.show();
}
function stopCapture() {
  if (!captureData) return;
  captureData.tab.removeListener('ready'     , setupCapture );
  captureData.tab.removeListener('activate'  , activateTab  );
  captureData.tab.removeListener('deactivate', deactivateTab);

  captureData.tab.title = captureData.title;
  viewFor(captureData.tab).removeAttribute('style');
  captureData.worker.destroy();
  captureData = null;
  //sidebar.hide();
  if (stopCallback) stopCallback();
}

sidebar.onClose(stopCapture);

exports.toggle = toggleCapture;
exports.onStop = function(callback) { stopCallback = callback; }
