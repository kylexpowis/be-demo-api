const { fetchNewCoins, fetchCoinByCoinId, fetchVolMarketcapData, fetchAllCoins } = require("../models/coins.model");

exports.getNewCoins = (req, res, next) => {
    const timeframe = req.query.timeframe || '1 day';
    fetchNewCoins(timeframe)
        .then((coins) => {
            res.status(200).send({ coins });
        })
        .catch(next);
};

exports.getCoinByCoinId = (req, res, next) => {
    const { coin_id } = req.params;
    fetchCoinByCoinId(coin_id)
        .then((coin) => {
            res.status(200).send({ coin });
        })
        .catch(next);
}

exports.getVolMarkcapData = (req, res, next) => {
    const { coin_id } = req.params;
    fetchVolMarketcapData(coin_id)
        .then((volume) => {
            res.status(200).send({ volume });
        }).catch(next)
}

exports.getAllCoins = (req, res, next) => {
    fetchAllCoins()
    .then((coins) => {
        res.status(200).send({ coins });
    }).catch(next) 
}
