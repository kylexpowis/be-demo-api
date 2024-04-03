const {
  showLatestPairs,
  fetchPairByCoinId,
  fetchMarketSummary,
} = require("../models/pairs.model");

exports.getPairsSummary = (req, res, next) => {
  fetchMarketSummary()
    .then((pairs) => {
      res.status(200).send({ pairs });
    })
    .catch(next);
};

exports.showNewPairs = (req, res, next) => {
  showLatestPairs()
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
