var system  = require("sdk/system");
var fs      = require('sdk/io/file');
var dir     = system.pathFor('TmpD');
const {Cc, Ci} = require("chrome");

function createTemp(content) {
  var path = fs.join(dir, 'bauxite-capture-'+(new Date().getTime()))+'.bxt';
  var stream = fs.open(path, 'w');
  stream.write(content);
  stream.flush();
  stream.close();
  return path;
}

function findBauxite() {
  var dirs = (system.env.PATH || '').split(/[:;]/);
  var exts = ['', 'cmd', 'bat', 'exe'];
  for (var i in dirs) {
    for (var j in exts) {
      var path = fs.join(dirs[i], 'bauxite'+exts[j]);
      if (fs.exists(path)) return path;
    }
  }
}
var bauxite_path = findBauxite();

function runProcess(path, args, callback) {
  let proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
  let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  file.initWithPath(path);
  proc.init(file);
  proc.runAsync(args, args.length, callback);
  return proc;
}

function run(buffer, callback) {
  var stdin  = createTemp(buffer);
  var stdout = stdin+'_out';
  var proc = runProcess(bauxite_path, [
    '-l','file',
    '-L','file='+stdout,
    '-L','verbose=true',
    stdin], function() {
      var output = fs.read(stdout);
      fs.remove(stdin);
      fs.remove(stdout);
      callback(output, proc.exitValue === 0);
    }
  );
}

exports.run = run;
exports.installed = bauxite_path;
