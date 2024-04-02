const { fetchROCMarketCap } = require("../models/closingMCap.model");

exports.getROCMarketCap = (req, res, next) => {
  fetchROCMarketCap(req.body)
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};
