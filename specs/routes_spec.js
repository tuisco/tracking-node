"use strict";

var request = require('supertest')
  , amqp = spyOnModule('../lib/services/amqp')
  , date = spyOnModule('../lib/services/date')
  , app = require('../app');

// TODO: work out why this cannot be inside a forEach
date.now = function() { return 'time'; };
amqp.push = jasmine.createSpy('amqp-push');

describe("routes", function() {
  describe('/reevoomark/track/impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/impression").expect(200, done);
    });

    it("pushes data to amqp service", function(done){
      var body = JSON.stringify({ "requested_at" : "time"});
      request(app).get("/reevoomark/track/impression").expect(200, done);
      expect(amqp.push).toHaveBeenCalledWith('impression', body);
    });
  });

  describe('/reevoomark/track/non_impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/non_impression").expect(200, done);
    });

    it("pushes data to amqp service", function(done){
      var body = JSON.stringify({ "requested_at" : "time"});
      request(app).get("/reevoomark/track/non_impression").expect(200, done);
      expect(amqp.push).toHaveBeenCalledWith('non_impression', body);
    });
  });

  describe('/reevoomark/track/miss', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/miss").expect(200, done);
    });

    it("pushes data to amqp service", function(done){
      var body = JSON.stringify({"requested_at":"time","request_params":{}});
      request(app).get("/reevoomark/track/miss").expect(200, done);
      expect(amqp.push).toHaveBeenCalledWith('miss', body);
    });
  });

  describe("/", function(){
    it("responds with a 404", function(done) {
      request(app).get("/").expect(404, done);
    })
  })
});
