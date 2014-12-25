var data     = require('sdk/self').data;
var tabs     = require("sdk/tabs");

function show(content) {
  var result = tabs.open({
    url: data.url("result.html"),
    inBackground: true,
    onReady: function(tab) {
      var worker = tab.attach({
        contentScriptFile: [
          data.url('jquery-1.11.2.min.js'),
          data.url('result.js')
        ]
      });
      worker.port.emit('content', content);
    }
  });
}

exports.show  = show

