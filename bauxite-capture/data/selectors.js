var selectors = {
  id:   function(i) { return i.attr('id'); },
  name: function(i) { return i.attr('name') && 'attr=name:'+i.attr('name'); },
  css:  function(i, opts) {
    if (!opts) opts = {};
    if (!opts.prefix) opts.prefix = '';

    // Try id
    var id = i.attr('id');
    if (id) return 'css=#'+id;

    var classes = i.attr('class');
    if (!classes && !opts.bubble) return;

    if (classes) {
      classes = classes.split(' ');

      // Try a single class
      for (var c in classes) {
        c = classes[c];
        if (!c) continue;
        c = opts.prefix+'.'+c;
        if ($(c).length == 1) return 'css='+c;
      }

      // Try every class at once
      var s = opts.prefix+classes.map(function(c) { return '.'+c }).join('');
      if ($(s).length == 1) return 'css='+s;
    }

    // Try nested css selector
    if (!opts.prefix) {
      s = selectors.css(i.parent(), { bubble: true });
      if (s && opts.bubble) return s + ' ' +i[0].tagName; // bubble up compound selector
      if (s) {
        s = s.replace('css=', '').split(' ');

        // Try the simplest selector first (top target, top child1 target, top child1 ... childN target)
        for (var len in s) {
          var pfx = s.slice(0, len+1).join(' ');
          var compound = selectors.css(i, { prefix: pfx+' ' });
          if (compound) return compound;
        }
      }
    }
  },
  href: function(i) {
    var href = i.attr('href');
    if (!href || href.indexOf('#') == 0) return;
    return 'attr=href:'+href;
  },
  tag: function(i) {
    var tag = i[0].tagName;
    if (tag != 'HTML' && $(tag).length == 1) return 'css='+tag;
  }
};
