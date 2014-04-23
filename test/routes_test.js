"use strict";

var request = require('supertest')
  , assert = require('assert')
  , app = require('../app');

describe("routes", function() {

  describe('/reevoomark/track/impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/impression").expect(200, done);
    });
  });

  describe('/reevoomark/track/non_impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/impression").expect(200, done);
    });
  });

  describe('/reevoomark/track/miss', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/impression").expect(200, done);
    });
  });
});
