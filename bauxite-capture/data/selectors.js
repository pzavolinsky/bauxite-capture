var selectors = {
  id:   function(i) { return i.attr('id'); },
  name: function(i) { return i.attr('name') && 'attr=name:'+i.attr('name'); },
  css:  function(i, prefix) {
    // Try id
    var id = i.attr('id');
    if (id) return 'css=#'+id;

    var classes = i.attr('class');
    if (!classes) return;

    classes = classes.split(' ');

    if (!prefix) prefix = '';

    // Try a single class
    for (var c in classes) {
      c = classes[c];
      if (!c) continue;
      c = prefix+'.'+c;
      if ($(c).length == 1) return 'css='+c;
    }

    // Try every class at once
    var s = prefix+classes.map(function(c) { return '.'+c }).join('');
    if ($(s).length == 1) return 'css='+s;

    // Try nested css selector
    if (!prefix) {
      s = selectors.css(i.parent());
      if (s) s = selectors.css(i, s.replace('css=', '')+' ');
      if (s) return s;
    }
  },
  href: function(i) {
    var href = i.attr('href');
    if (!href || href.indexOf('#') == 0) return;
    return 'attr=href:'+href;
  }
};
