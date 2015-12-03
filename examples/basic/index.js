var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var ErrMap = require('../../lib/errMap');

var errMap = new ErrMap();
errMap.register('testErr', 400);
errMap.register('I met a traveller from an antique land\nWho said: "Two vast and trunkless legs of stone\nStand in the desert. Near them, on the sand,\nHalf sunk, a shattered visage lies, whose frown,', 400, 'ozymandias');
app.get('/err', function() {
  throw errMap.raise('testErr');
})
app.get('/noErr', function(req, res, next) {
  throw new Error('not registered');
})
app.get('/ozy', function() {
  //using an alias and standard Error creation syntax
  throw new Error('ozymandias');
})

app.use(errMap.activate());

app.listen(port, function(err) {
  !err ? console.log('listening on %d', port) : process.exit(1);
});
