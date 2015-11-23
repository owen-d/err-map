### errMap: lightweight middleware for error filtering

## Impetus
errMap was created to help control which errors I sent allowed out of an API I was building: i.e. I didn't want sensitive information leaking out to the client in the form of error messages, but I also wanted an easy interface for managing which errors I did allow.

Bad:
`SQL failure: INSERT \`id = 3, password_hash = 'fkdsljfa', mismatched_field = 2 \` INTO USERS`
Good:
`Error: validation error: please check your fields`

## Installation
```bash
$ npm install err-map
```

## Quick Start
```js
var ErrMap = require('err-map');
var initialErrors = {
  'firstErr': {
    status: 400,
    message: 'you goofed it up!'
  }
};

//Will only be called if the error is raised via errMap.
var handler = function(errMapObj, req, res, next) {
  res.status(errMapObj.status).json({message: errMapObj.message});
}

var errMap = new ErrMap(initialErrors, handler);

//Add another error:
errMap.register('second error message', 402, '2ndAlias');


var app = require('express')();

//register a route:
app.get('/err', function() {
  throw errMap.raise('2ndAlias');
});

//instantiate errMap middleware, and the base (catch-all) error:
app.use(errMap.activate({
  status: 500,
  message: 'Internal Server Error'
}));



app.listen(3000);
```

## API
