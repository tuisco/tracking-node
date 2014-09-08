#!/usr/bin/env node

"use strict";

var newrelic = require('newrelic')
  , morgan = require('morgan')
  , express = require('express')
  , argv = require('minimist')(process.argv.slice(2))
  , logStream = require('./lib/logStream')
  , server = require('./lib/server')
  , Starling = require('./lib/starling')
  , app = express();

var port   = process.env.PORT || argv.port
  , stream = logStream(process.env.LOG || argv.log)
  , starling = new Starling(argv._);

app.use(morgan({ format: 'tiny', stream: stream }));
server(app, starling);

app.enable('trust proxy');
app.listen(port, function () {
  console.log('Server listening on port %d\nStarling port(s): %s', port, argv._);
});

exports = module.exports = app;
