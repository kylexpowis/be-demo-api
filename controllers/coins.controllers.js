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
