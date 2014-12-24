addon.port.on('capture', function(data) {
  var log = $('#log');
  if (data.action == 'reset') { log.val(''); return; }
  var action = [data.action];
  if (data.selector) action.push(data.selector);
  if (data.args) action.push(data.args);
  var val = log.val();
  if (val) val += '\n';
  log.val(val+action.join(' '));
});
