function quote(s) {
  if (!s.match(/[" ]/)) return s;
  return '"'+(s.replace(/"/g, '""'))+'"';
}

var cfg;

self.on('context', function(node) {
  var text = window.getSelection().toString();
  if (text.length > 20) text = text.substr(0, 20) + '...';
  return cfg.label + ' "' + text + '"';
});

self.on('click', function(node) {
  var selector = guessSelector(node);
  if (!selector) return;
  self.postMessage({
    action:   cfg.action,
    selector: quote(selector),
    args:     quote(window.getSelection().toString())
  });
});