#!/usr/bin/env node

"use strict";

// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
process.setMaxListeners(0);

var express = require('express');
var logger = require('morgan');

// TODO: discuss how to get the amqp settings -> (config.json)
var open = require('amqplib').connect('amqp://localhost');

var publish = function(connection, body, messageName) {
  var ok = connection.createChannel();
  ok = ok.then(function(channel) {
    channel.assertQueue(messageName);
    channel.sendToQueue(messageName, new Buffer(body));

    try {
      channel.close();
    } catch (alreadyClosed) {
      // TODO: do we mind that it is already closed?
      console.log(alreadyClosed.stackAtStateChange);
    }
  });
  return ok;
};

var app = express();

// TODO: discuss how we can set the logging for development/production
app.use(logger('dev'));

var miss = function(params) {
  var now = new Date().toString();
  return JSON.stringify({
    requested_at: now,
    request_params: { sku: params.sku },
    retailer_id: params.retailer_id,
    badge_type: params.badge_type,
    badge_variant: params.badge_variant
  });
};

var impression = function(params){
  var now = new Date().toString();
  return JSON.stringify({
    requested_at: now,
    product_id: params.product_id,
    retailer_id: params.retailer_id,
    badge_type: params.badge_type,
    badge_variant: params.badge_variant,
    badge_name: params.badge_name
  });
};

var non_impression = function(params) {
  var now = new Date().toString();
  return JSON.stringify({
    requested_at: now,
    product_id: params.product_id,
    retailer_id: params.retailer_id,
    badge_type: params.badge_type,
    badge_variant: params.badge_variant
  });
};

var routes = { miss: miss, impression: impression, non_impression: non_impression };

_.each(routes, function(key, value) {
  app.get('/reevoomark/track/' + key, function (req, res) {
    open.then(function (connection) {
      // TODO: discuss why closing this throws an exception
      process.once('SIGINT', connection.close.bind(connection));
      var body = value(req.query);
      return publish(connection, body, key);
    }, console.warn).then(null, console.warn);

    res.set({
      "Content-Type": "text/javascript",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "Fri, 29 Aug 1997 02:14:00 EST"
    });
    res.status(200).send({});
  });
});

// TODO: configure port settings
app.listen(3000);
