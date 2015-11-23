function ErrMap(map, handler) {
  map && typeof map === 'function' ? handler = map : void 0;
  this.store = map || {};
  this.handler = handler || function(errMapObj, req, res, next) {
    res.status(errMapObj.status).json({
      message: errMapObj.message
    });
  }
  
}

ErrMap.prototype = Object.create(Object.prototype);
ErrMap.prototype.constructor = ErrMap;
ErrMap.prototype.activate = function(baseError) {
  baseError = baseError || {
    status: 500,
    message: 'Internal Server Error'
  };
  return function handleMappedErr(err, req, res, next) {
    if (err._errMap) {
      return this.handler(err._errMap, req, res, next);
    } else {
      this.handler(baseError, req, res, next);
    }
  }.bind(this);
}

ErrMap.prototype.register = function registerErr(msg, status, alias) {
  if (arguments.length < 2) {
    throw new Error('must provide at least message & status to register an error');
  }
  alias = alias || msg;
  this.store[alias] = {
    message: msg,
    status: status
  };
  return this.store[alias];
}

ErrMap.prototype.raise = function raiseErr(alias) {
  var newErr = new Error();
  newErr.message = this.store[alias].message;
  newErr._errMap = this.store[alias];
  return newErr;
}


module.exports = ErrMap;
