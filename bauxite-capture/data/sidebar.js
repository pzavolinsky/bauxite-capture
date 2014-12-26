$(function() {
  $('#save').click(function() {
    addon.port.emit('store', $('#log').val());
    addon.port.emit('save');
  });
  $('#exec').click(function() {
    addon.port.emit('store', $('#log').val());
    addon.port.emit('exec');
  });
  $('[data-toggle="tooltip"]').tooltip();
});

addon.port.on('config', function(data) {
  $(function() { $('#exec').toggle(!!data.bauxite); });
});

addon.port.on('add', function(data) {
  var log = $('#log');
  var val = log.val();
  if (val) val += '\n';
  log.val(val+data);
});

addon.port.on('reset', function(data) {
  $('#log').val('');
});

addon.port.on('load', function(data) {
  $('#log').val(data);
});

addon.port.on('detach', function() {
  addon.port.emit('store', $('#log').val());
});
