var config = require('../config')
  , routes = require('../routes')
  , logger = require('morgan')
  , express = require('express')
  , app = express();

var port = config.get('app:port');

app.use(logger('dev'));
app.get('/reevoomark/track/miss', routes.miss);
app.get('/reevoomark/track/impression', routes.impression);
app.get('/reevoomark/track/non_impression', routes.non_impression);
app.listen(port, function() {
  console.log('Server listening on port %d', port);
});

module.exports = app;
