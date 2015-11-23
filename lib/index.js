function ErrMap(map, handler) {
  map && typeof map === 'function' ? handler = map : void 0;
  this.store = map || {};
  this.handler = handler || function(err, req, res, next) {
    var errMapObj = err._errMap;
    res.status(errMapObj.status).json({
      message: errMapObj.message
    });
  }
  
}

ErrMap.prototype = Object.create(Object.prototype);
ErrMap.prototype.constructor = ErrMap;
ErrMap.prototype.activate = function() {
  return function handleMappedErr(err, req, res, next) {
    if (err._errMap) {
      return this.handler(err, req, res, next);
    } else {
      //maybe should re-throw?
      next(err);
    }
  }.bind(this);
}

ErrMap.prototype.register = function registerErr(msg, status, alias, next) {
  if (arguments.length < 2) {
    throw new Error('must provide at least message & status to register an error');
  }
  alias = alias || msg;
  this.store[alias] = {
    message: msg,
    status: status
  };
  next ? this.store[alias].next = true : void 0;
  return this.store[alias];
}

ErrMap.prototype.raise = function raiseErr(alias) {
  var newErr = new Error();
  newErr.message = this.store[alias].message;
  newErr._errMap = this.store[alias];
  return newErr;
}


module.exports = ErrMap;
