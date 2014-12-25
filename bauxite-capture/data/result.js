self.port.on('content', function(content) {
  $(function() {
    $('#status').text(content.ok ? 'OK' : 'ERROR');
    $('#output').text(content.output);
    $('#wait').hide();
    $('#result').show();
  });
})
