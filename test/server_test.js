"use strict";

var should = require('should')
  , server = require('../lib/server')
  , express = require('express')
  , request = require('supertest');

describe("The server", function () {
  var fakeStarling, app;

  beforeEach(function () {
    app = express();
    fakeStarling = {
      push: function (queue, message, callback) {
        this.received.push([queue, message]);
        callback();
      },
      received: []
    };

    server(app, fakeStarling)
    app.now = function(){
      return "the-current-time";
    };
  });

  describe("default responses", function () {
    it("responds with a 200", function (done) {
      request(app).get("/reevoomark/track/impression?product_id=bar").expect(200, done);
    });

    it("responds with a gif file", function (done) {
      request(app)
        .get("/reevoomark/track/impression?product_id=bar")
        .expect("Content-Type", 'image/gif', done);
    });

    it("queues a message on the super_poller", function (done) {
      request(app)
        .get("/reevoomark/track/impression?product_id=bar")
        .end(function (val) {
          fakeStarling.received.length.should.equal(1);
          fakeStarling.received[0][0].should.equal('super_poller');
          JSON.stringify(fakeStarling.received[0][1]).should.equal(
            JSON.stringify({name: 'impression', body: {requested_at: "the-current-time", product_id: 'bar'}})
          );
          done(val);
        });
    });

    it("responds with a gif file", function (done) {
      request(app)
        .get("/reevoomark/track/impression?product_id=bar")
        .expect("Content-Type", 'image/gif')
        .end(done);
    });
  });

  function theMessage () {
    return fakeStarling.received[0][1];
  }

  describe("GET /reevoomark/track/miss", function () {
    it("Pushes a message onto the queue", function (done) {
      request(app)
        .get("/reevoomark/track/miss?sku=SKU&retailer_id=1&badge_type=BADGE_TYPE&badge_variant=BADGE_VARIANT")
        .end(function (val) {
          theMessage().should.eql({
            name: 'miss',
            body: {
              requested_at: 'the-current-time',
              retailer_id: '1',
              badge_type: 'BADGE_TYPE',
              badge_variant: 'BADGE_VARIANT',
              request_params: {sku: 'SKU'}
            }
          });
          done(val);
        });
    });
  });

  describe("GET /reevoomark/track/impression", function () {
    it("Pushes a message onto the queue", function (done) {
      request(app)
        .get("/reevoomark/track/impression?product_id=99&retailer_product_series_id=SERIES_ID&retailer_id=1&badge_type=BADGE_TYPE&badge_variant=BADGE_VARIANT&badge_name=BADGE_NAME")
        .end(function (val) {
          theMessage().should.eql({
            name: 'impression',
            body: {
              requested_at: 'the-current-time',
              product_id: '99',
              retailer_product_series_id: 'SERIES_ID',
              retailer_id: '1',
              badge_type: 'BADGE_TYPE',
              badge_variant: 'BADGE_VARIANT',
              badge_name: 'BADGE_NAME'
            }
          });
          done(val);
        });
    });
  });

  describe("GET /reevoomark/track/non_impression", function () {
    it("Pushes a message onto the queue", function (done) {
      request(app)
        .get("/reevoomark/track/non_impression?product_id=99&retailer_product_series_id=SERIES_ID&retailer_id=1&badge_type=BADGE_TYPE&badge_variant=BADGE_VARIANT")
        .end(function (val) {
          theMessage().should.eql({
            name: 'non_impression',
            body: {
              requested_at: 'the-current-time',
              product_id: '99',
              retailer_product_series_id: 'SERIES_ID',
              retailer_id: '1',
              badge_type: 'BADGE_TYPE',
              badge_variant: 'BADGE_VARIANT'
            }
          });
          done(val);
        });
    });
  });
});
