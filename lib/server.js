var Future = require('fibers/future')
  , fs = require('fs');

var imageResponse = fs.readFileSync('./lib/tracker.gif')
  , responseHeaders = {
    "Content-Type": "image/gif",
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "Fri, 29 Aug 1997 02:14:00 EST"
  };

exports = module.exports = function(app, starling) {
  app.now = function() {
    return new Date().toString();
  };

  app.get('/reevoomark/track/miss', function (req, res) {
      var body = {
        requested_at: app.now(),
        request_params: { sku: req.query.sku },
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant
      };

      Future.task(function() {
        starling.push('super_poller', { name: 'miss', body: body }, function(){});
      }).detach();

      res.status(200).set(responseHeaders).send(imageResponse);
    }
  );

  app.get('/reevoomark/track/impression', function (req, res) {
      var body = {
        requested_at: app.now(),
        product_id: req.query.product_id,
        retailer_product_series_id: req.query.retailer_product_series_id,
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant,
        badge_name: req.query.badge_name
      };

      // Healt check: /reevoomark/track/impression?product_id=0&retailer_id=0&...
      if (body.product_id !== "0" && body.retailer_id !== "0") {
        Future.task(function() {
          starling.push('super_poller', { name: 'impression', body: body }, function(){});
        }).detach();
      }

      res.status(200).set(responseHeaders).send(imageResponse);
    }
  );

  app.get('/reevoomark/track/non_impression', function (req, res) {
      var body = {
        requested_at: app.now(),
        product_id: req.query.product_id,
        retailer_product_series_id: req.query.retailer_product_series_id,
        retailer_id: req.query.retailer_id,
        badge_type: req.query.badge_type,
        badge_variant: req.query.badge_variant
      };

      Future.task(function() {
        starling.push('super_poller', { name: 'non_impression', body: body }, function(){});
      }).detach();

      res.status(200).set(responseHeaders).send(imageResponse);
    }
  );
};
