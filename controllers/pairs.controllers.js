const { fetchNewPairs, showLatestPairs } = require("../models/pairs.model");

exports.getPairsSummary = (req, res, next) => {
  fetchNewPairs(req.body)
    .then((pairs) => {
      res.status(200).send({ pairs });
    })
    .catch(next);
};

exports.showNewPairs = (req, res, next) => {
  showLatestPairs(req.body)
    .then((pairs) => {
      res.status(200).send({ pairs });
    })
    .catch(next);
};