var events = {
  change: function(e) {
    if (e.target.tagName == 'SELECT') {
      return {
        action: 'select',
        args: [ $(e.target).find('option:selected').text() ]
      };
    }
    return {
      action: 'write',
      args: [ $(e.target).val() ]
    };
  },
  click: function(e) { return { action: 'click' }; }
};
