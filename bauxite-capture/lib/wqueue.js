function Queue() {
  var queue = [];
  var worker;

  this.emit = function(type, message) {
    if (worker) worker.port.emit(type, message);
    else queue.push({ type: type, message: message});
  }
  this.set = function(w) { worker = w; }
  this.flush = function() {
    for (var i in queue) {
      var payload = queue[i];
      worker.port.emit(payload.type, payload.message);
    }
    queue = [];
  }
  return this;
}

exports.create = function() { return new Queue(); }