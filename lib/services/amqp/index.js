var config = require('../../config')
  , amqp = require('amqplib');

var open = amqp.connect(
  config.get('amqp:url'),
  config.get('amqp:options')
);

var channel = open.then(function (connection) {
  process.once('SIGINT', connection.close.bind(connection));

  connection.on('blocked', function(reason) {
    console.error("blocked: " + reason);
  });

  connection.on('unblocked', function() {
    console.error("unblocked: ");
  });

  return connection.createChannel();
}, function(err) {
  console.warn(err);
  return false;
});

var push = function(queue, body) {
  channel.then(function (channel) {
    channel.assertQueue(queue);
    channel.sendToQueue(queue, new Buffer(body));
  }, function(err) {
    console.warn(err);
  });
};

exports.push = push;
