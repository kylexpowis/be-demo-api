const { getROCMarketCap, getVolumeROC } = require("./closingMCap.controllers");
const { getNewCoins, getCoinByCoinId } = require("./coins.controllers");
const { getPairsSummary, showNewPairs, getPairsByCoinId } = require('./pairs.controllers');


module.exports = {
    getROCMarketCap,
    getVolumeROC,
    getNewCoins,
    getCoinByCoinId,
    getPairsSummary,
    showNewPairs,
    getPairsByCoinId
}