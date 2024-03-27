const { fetchCoinById } = require("../models/coins.model");

exports.getCoinById = (req, res, next) => {
  const { coin_id } = req.params;
  fetchCoinById(coin_id)
    .then((coin) => {
      res.status(200).send({ coin });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getNewCoins = (req, res, next) => {
  const timeframe = req.query.timeframe || "1 day";
  fetchNewCoins(timeframe)
    .then((coins) => {
      res.status(200).send({ coins });
    })
    .catch(next);
};
