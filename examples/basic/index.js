var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var ErrMap = require('../../lib/errMap');

var errMap = new ErrMap();
errMap.register('testErr', 411);

app.get('/err', function() {
  throw errMap.raise('testErr');
})
app.get('/noErr', function(req, res, next) {
  throw new Error('not registered');
})

app.use(errMap.activate());

app.listen(port, function(err) {
  !err ? console.log('listening on %d', port) : process.exit(1);
});
