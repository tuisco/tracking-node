"use strict";

var Memcached = require('memcached');

exports = module.exports = function(hosts){
  if (hosts.length < 1) {
    throw new Error("No hosts found! Please specify at least one queue server.");
  }

  var connectionPool = hosts.map(
    function (host) {
      return new Memcached(host, {
        retries: 0,
        timeout: 500,
        remove: true,
        reconnect: 1000,
        poolSize: 1000
      });
    }
  );

  var length = connectionPool.length;

  var recallable = function(queue_name, message, callback) {
    var randomServer = connectionPool[Math.floor(Math.random() * length)];
    randomServer.set(queue_name, message, 0, function (err) {
      err ? recallable(queue_name, message, callback) : callback();
    });
  };

  return {
    push: function (queue_name, message, callback) {
      recallable(queue_name, message, callback);
    }
  };
};
