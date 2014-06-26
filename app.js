#!/usr/bin/env node

"use strict";

var morgan = require('morgan')
  , express = require('express')
  , argv = require('minimist')(process.argv.slice(2))
  , fs = require('fs')
  , Starling = require('./lib/starling')
  , app = express();

// Usage variables
var port = process.env.PORT || argv.port
  , logFile = process.env.LOG || argv.logFile
  , starlingHosts = argv._
  , imageResponse = fs.readFileSync('./lib/tracker.gif')
  , responseHeaders = {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "Fri, 29 Aug 1997 02:14:00 EST"
    };

console.log(starlingHosts);

// initialize the Starling queues
var starling = new Starling(starlingHosts);

// initialize the logStream and apply refresh on SIGHUP
var logStream;
if (logFile) {
  logStream = fs.createWriteStream(logFile, { flags: 'a' });
  process.on('SIGHUP', function () {
      log("SIGHUP: Reopening logfile");
      logStream.end();
      logStream = fs.createWriteStream(logFile, { flags: 'a' });
      log("SIGHUP: Starting new log file");
    }
  );
} else {
  logStream = process.stdout;
}
app.use(morgan({ format: 'tiny', stream: logStream }));

app.enable('trust proxy');
app.get('/reevoomark/track/miss', function (req, res) {
    var body = JSON.stringify({
        requested_at: new Date().toString(),
        request_params: { sku: req.query.sku },
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant
      }
    );

    starling.push('super_poller', { name: 'miss', body: body }, function () {
      res.status(200).set(responseHeaders).send(imageResponse);
    });
  }
);

app.get('/reevoomark/track/impression', function (req, res) {
    var body = JSON.stringify({
        requested_at: new Date().toString(),
        product_id: req.query.product_id,
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant,
        badge_name: req.query.badge_name
      }
    );


    starling.push('super_poller', { name: 'impression', body: body }, function () {
      res.status(200).set(responseHeaders).send(imageResponse);
    });
  }
);

app.get('/reevoomark/track/non_impression', function (req, res) {
    var body = JSON.stringify({
        requested_at: new Date().toString(),
        product_id: req.query.product_id,
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant
      }
    );


    starling.push('super_poller', { name: 'non_impression', body: body }, function () {
      res.status(200).set(responseHeaders).send(imageResponse);
    });
  }
);

app.listen(port, function () {
    console.log('Server listening on port %d', port);
  }
);

exports = module.exports = app;
