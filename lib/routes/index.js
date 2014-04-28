var config = require('../config')
  , now = require('../services/datenow')
  , amqpService = require('../services/amqp');

exports.miss = function(req, res) {
  var body = JSON.stringify({
    requested_at: now(),
    request_params: { sku: req.query.sku },
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant
  });

  amqpService.push('miss', body);
  res.set(config.get('app:responseHeaders'));
  // TODO: return tracking gif?
  res.status(200).send({});
};

exports.impression = function (req, res) {
  var body = JSON.stringify({
    requested_at: now(),
    product_id: req.query.product_id,
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant,
    badge_name: req.query.badge_name
  });

  amqpService.push('impression', body);
  res.set(config.get('app:responseHeaders'));
  // TODO: return tracking gif?
  res.status(200).send({});
};

exports.non_impression = function (req, res) {
  var body = JSON.stringify({
    requested_at: now(),
    product_id: req.query.product_id,
    retailer_id: req.query.retailer_id,
    badge_type: req.query.badge_type,
    badge_variant: req.query.badge_variant
  });

  amqpService.push('non_impression', body);
  res.set(config.get('app:responseHeaders'));
  // TODO: return tracking gif?
  res.status(200).send({});
};
