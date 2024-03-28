
const { fetchCoinById } = require("../models/coins.model");
const { fetchAllCoins, selectPairsByBaseId } = require("../models/coins.model")

exports.getAllCoins = (req, res, next) => {
    const { sort_by } = req.query;
    const { order } = req.query
    fetchAllCoins(sort_by, order)
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


exports.getNewCoins = (req, res, next) => {
    const timeframe = req.query.timeframe || "1 day";
    fetchNewCoins(timeframe)
        .then((coins) => {
            res.status(200).send({ coins });
        })
        .catch(next);
};

exports.getPairsByBase = (req, res, next) => {
    const { base_id } = req.params;
    selectPairsByBaseId(base_id)
        .then((base) => {
            res.status(200).send({ base })
        })
        .catch((err) => {
            next(err)
        })
}