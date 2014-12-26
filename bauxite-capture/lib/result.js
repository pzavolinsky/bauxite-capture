var data     = require('sdk/self').data;
var tabs     = require("sdk/tabs");
var wqueue   = require('./wqueue.js');

function open(config) {
  var wq = wqueue.create();
  var result = tabs.open({
    url: data.url("result.html"),
    onReady: function(tab) {
      worker = tab.attach({
        contentScriptFile: [
          data.url('jquery-1.11.2.min.js'),
          data.url('result.js')
        ]
      });
      wq.set(worker);
      wq.flush();
      wq.emit('config', config);
    }
  });

  return {
    tab: result,
    show: function(content) {
      wq.emit('content', content);
    }
  };
}

exports.open = open;

