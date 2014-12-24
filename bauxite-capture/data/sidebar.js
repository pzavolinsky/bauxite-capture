addon.port.on('capture', function(data) {
  var log = $('#log');
  var action = [data.action, data.selector];
  if (data.args) action.push(data.args);
  log.val(log.val()+'\n'+action.join(' '));
});
