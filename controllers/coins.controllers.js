const { fetchNewCoins } = require("../models/coins.model");

exports.getNewCoins = (req, res, next) => {
    const timeframe = req.query.timeframe || '1 day';
    fetchNewCoins(timeframe)
        .then((coins) => {
            res.status(200).send({ coins });
        })
        .catch(next);
};