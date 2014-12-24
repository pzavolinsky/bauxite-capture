addon.port.on('capture', function(data) {
  var log = $('#log');
  if (data.action == 'reset') { log.val(''); return; }
  var val = log.val();
  if (val) val += '\n';
  log.val(val+data.text);
});

$(function() {
  $('#save').click(function() {
    addon.port.emit('save');
  });
});
