
const { fetchCoinById } = require("../models/coins.model");
const { fetchAllCoins } = require("../models/coins.model")

exports.getAllCoins = (req, res, next) => {
    fetchAllCoins(req.body)
        .then((coins) => {
            res.status(200).send({ coins });
        })
        .catch(next);
};
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


