"use strict";

var request = require('supertest')
  , app = require('../app');

describe("routes", function() {
  describe('/reevoomark/track/impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/impression").expect(200, done);
    });
  });

  describe('/reevoomark/track/non_impression', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/non_impression").expect(200, done);
    });
  });

  describe('/reevoomark/track/miss', function(){
    it("responds with a 200", function(done) {
      request(app).get("/reevoomark/track/miss").expect(200, done);
    });
  });

  describe("/", function(){
    it("responds with a 404", function(done) {
      request(app).get("/").expect(404, done);
    })
  })
});
