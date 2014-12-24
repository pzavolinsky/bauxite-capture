var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var ui = require("sdk/ui");

var sidebar_port;
var sidebar = ui.Sidebar({
  id: 'bauxite-capture',
  title: 'Bauxite Capture',
  url: data.url("sidebar.html"),
  onReady: function(worker) { sidebar_port = worker.port; }
});
sidebar.show();

pageMod.PageMod({
  include: /.*/,
  contentScriptFile: [
    data.url("jquery-1.11.2.min.js"),
    data.url("selectors.js"),
    data.url("events.js"),
    data.url("injected.js")
  ],
  onAttach: function(worker) {
    worker.port.on('capture', function(data) {
      sidebar_port.emit('capture', data);
      var action = [data.action, data.selector];
      if (data.args) action.push(data.args);
      console.log(action.join(' '));
    });
  }

});
