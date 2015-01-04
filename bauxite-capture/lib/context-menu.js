var cm       = require('sdk/context-menu');
var sidebar  = require('./sidebar.js');
var data     = require('sdk/self').data;

var menu = cm.Menu({
  label: "Bauxite",
  context: cm.SelectionContext()
});

var items = [];
function addMenuItem(action, label) {
  var item = cm.Item({
    label: label,
    contentScript: 'cfg = {action:"'+action+'",label:"'+label+'"};',
    contentScriptFile: [
      data.url('jquery-1.11.2.min.js'),
      data.url('selectors.js'),
      data.url('context-menu.js')
    ],
    onMessage: function(data) { sidebar.add(data); }
  });
  menu.addItem(item);
  menu.removeItem(item);
  items.push(item);
}

addMenuItem('assert', 'Assert element contains');
addMenuItem('source', 'Assert page source includes');

exports.show = function() {
  for (var i in items) menu.addItem(items[i]);
}
exports.hide = function() {
  for (var i in items) menu.removeItem(items[i]);
}
