#!/usr/bin/env node

"use strict";

var morgan = require('morgan')
  , express = require('express')
  , port = process.env.PORT
  , amqp = require('amqplib').connect('amqp://localhost')
  , fs = require('fs')
  , app = express();

var channel = amqp.then(function (connection) {
  return connection.createChannel();
}, function (err) {
  console.warn(err);
  return false;
});

var publisher = function(queue, body) {
  channel.then(function (channel) {
    channel.assertQueue(queue);
    channel.sendToQueue(queue, new Buffer(body));
  }, function(err) {
    console.warn(err);
  });
};

var imageResponse = fs.readFileSync('./tracker.gif');
var responseHeaders = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "Fri, 29 Aug 1997 02:14:00 EST"
};

app.use(morgan({
  format: 'tiny',
  stream: fs.createWriteStream('app.log')
}));

app.enable('trust proxy');

app.get('/reevoomark/track/miss', function (req, res) {
  var body = JSON.stringify({
    requested_at: new Date().toString(),
    request_params: { sku: req.query.sku },
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant
  });

  publisher('miss', body);

  res.status(200).set(responseHeaders).send(imageResponse);
});

app.get('/reevoomark/track/impression', function (req, res) {
  var body = JSON.stringify({
    requested_at: new Date().toString(),
    product_id: req.query.product_id,
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant,
    badge_name: req.query.badge_name
  });

  publisher('impression', body);

  res.status(200).set(responseHeaders).send(imageResponse);
});

app.get('/reevoomark/track/non_impression', function (req, res) {
  var body = JSON.stringify({
    requested_at: new Date().toString(),
    product_id: req.query.product_id,
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant
  });

  publisher('non_impression', body);

  res.status(200).set(responseHeaders).send(imageResponse);
});

app.listen(port, function () {
  console.log('Server listening on port %d', port);
});

module.exports = app;
