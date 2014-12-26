self.port.on('config', function(config) {
  document.title += ' [run '+config.run+']';
});

self.port.on('content', function(content) {
  $(function() {
    $('#status').attr('class', content.ok ? 'ok' : 'error');
    $('#output').text(content.output);
    $('#wait').addClass('hidden');
    $('#result').removeClass('hidden');
    document.title += ' [' + (content.ok ? 'ok' : 'error') + ']';
  });
})
