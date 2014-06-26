var should = require('should')
  , Starling = require('../lib/starling');

describe("Starling", function(){
  describe(".new", function(){
    it("requires at least one host.", function(){
      (function(){
        new Starling([]);
      }).should.throw("No hosts found! Please specify at least one queue server.");
    });
  });

  describe('#push', function(){
    it("pushes onto a queue and calls the callback", function(done){
      var starling = new Starling(["localhost:22122"]);
      starling.push('test-queue', 'message', done);
    });

    it("pushes to another server if a server does not respond", function(done){
      var starling = new Starling(["localhost:1", "localhost:22122"]);
      starling.push('test-queue', 'message', function(err){
        starling.push('test-queue', 'message', done);
      });
    });
  });
});
