const { fetchROCMarketCap, fetchVolumeROC } = require("../models/closingMCap.model");

exports.getROCMarketCap = (req, res, next) => {
  fetchROCMarketCap(req.body)
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};

exports.getVolumeROC = (req, res, next) => {
  fetchVolumeROC(req.body)
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};
