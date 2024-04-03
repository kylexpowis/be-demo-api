const { fetchROCMarketCap, fetchVolumeROC } = require("../models/closingMCap.model");

exports.getROCMarketCap = (req, res, next) => {
  fetchROCMarketCap()
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};

exports.getVolumeROC = (req, res, next) => {
  fetchVolumeROC()
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};
