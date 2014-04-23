var config = require('../../config')
  , amqp = require('amqplib');

var publish = function(connection, body, messageName) {
  var ok = connection.createChannel();
  ok = ok.then(function (channel) {
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

var open = amqp.connect(
  config.get('amqp:url'),
  config.get('amqp:options')
);

var push = function(queue, body) {
  open.then(function (connection) {
    process.once('SIGINT', connection.close.bind(connection));
    return publish(connection, body, queue);
  }, console.warn).then(null, console.warn);
};

exports.push = push;
