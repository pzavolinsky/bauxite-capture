var {Cc, Ci} = require("chrome");

function promptForFile(name) {
  var window = require('sdk/window/utils').getMostRecentBrowserWindow();
  const nsIFilePicker = Ci.nsIFilePicker;

  var fp = Cc['@mozilla.org/filepicker;1']
           .createInstance(nsIFilePicker);
  fp.init(window, 'Select a file to save the test', nsIFilePicker.modeSave);
  fp.appendFilter('Bauxite tests (*.bxt)', '*.bxt');
  fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
  fp.defaultExtension = 'bxt';
  fp.defaultString = name;

  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
    return fp.file.path;
  }
}

exports.promptForFile = promptForFile;
