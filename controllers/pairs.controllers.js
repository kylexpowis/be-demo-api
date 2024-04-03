const {
  fetchNewPairs,
  showLatestPairs,
  fetchPairByCoinId,
} = require("../models/pairs.model");

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

exports.getPairsByCoinId = (req, res, next) => {
  const { coin_id } = req.params;
  fetchPairByCoinId(coin_id)
    .then((pairById) => {
      res.status(200).send({ pairById });
    })
    .catch(next);
};
