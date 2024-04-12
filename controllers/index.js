const { getROCMarketCap, getVolumeROC } = require("./closingMCap.controllers");
const { getNewCoins, getCoinByCoinId, getVolMarkcapData, getAllCoins } = require("./coins.controllers");
const { getPairsSummary, getNewPairs, getPairsByCoinId } = require('./pairs.controllers');


module.exports = {
    getROCMarketCap,
    getVolumeROC,
    getNewCoins,
    getCoinByCoinId,
    getPairsSummary,
    getNewPairs,
    getPairsByCoinId,
    getVolMarkcapData,
    getAllCoins
}