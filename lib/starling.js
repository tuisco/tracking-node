"use strict";

var Memcached = require('memcached');

exports = module.exports = function(hosts){
  if (hosts.length < 1) {
    throw("No hosts found! Please specify at least one queue server.");
  }

  var connectionPool = hosts.map(
    function (v) {
      return new Memcached(v, {
        retries: 0,
        timeout: 500,
        remove: true,
        reconnect: 1000,
        poolSize: 1000
      });
    }
  );

  return {
    push: function (queue_name, message, callback) {
      var iterate = function () {
        var server = connectionPool[Math.floor(Math.random()*connectionPool.length)];
        server.set(queue_name, message, 0, function (err) {
          if (err) {
            iterate();
          } else {
            callback();
          }
        });
      };

      iterate();
    }
  };
};
