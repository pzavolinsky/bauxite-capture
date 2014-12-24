$('body').prepend($('<div>pipi</div>'));

function guessSelector(item) {
  item = $(item);
  for (var i in selectors) {
    var s = selectors[i](item);
    if (s) return s;
  }
}

function quote(s) {
  if (!s.match(/[" ]/)) return s;
  return '"'+(s.replace(/"/g, '""'))+'"';
}

function capture(e) {
  var selector = guessSelector(e.target);
  var handler  = events[e.type];
  if (!selector || !handler) return;
  
  var qe = handler(e);
  if (!qe) return;

  qe.selector = quote(selector);
  if (qe.args) qe.args = qe.args.map(function(a) { return quote(a); }).join(' ');

  self.port.emit('capture', qe);
}

var captures = ['click', 'change'];
for (var i in captures) document.addEventListener(captures[i], function(e) { capture(e); }, true);

