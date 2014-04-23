#!/usr/bin/env node

"use strict";

// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
process.setMaxListeners(0);

var express = require('express');
var logger = require('morgan');
var open = require('amqplib').connect('amqp://localhost');

var publish = function(connection, params, messageName) {
  var body = JSON.stringify({
    requested_at: new Date().toString(),
    request_params: { sku: params.sku },
    retailer_id: params.retailer_id,
    badge_type: params.badge_type,
    badge_variant: params.badge_variant
  });

  var ok = connection.createChannel();
  ok = ok.then(function(channel) {
    channel.assertQueue(messageName);
    channel.sendToQueue(messageName, new Buffer(body));

    try {
      channel.close();
    } catch (alreadyClosed) {
      console.log(alreadyClosed.stackAtStateChange);
    }
  });
  return ok;
};

var app = express();
app.use(logger('dev'));

['miss', 'impression', 'non_impression'].forEach(function(messageName){
  app.get('/reevoomark/track/' + messageName, function(req, res){
    open.then(function(connection) {
      process.once('SIGINT', connection.close.bind(connection));
      return publish(connection, req.query, messageName);
    }).then(null, console.warn);

    res.set({
      "Content-Type": "text/javascript",
      "Cache-Control":"no-cache, no-store, max-age=0, must-revalidate",
      "Pragma":"no-cache",
      "Expires":"Fri, 29 Aug 1997 02:14:00 EST"
    });
    res.status(200).send({});
  });
});

app.listen(3000);
