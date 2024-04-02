const axios = require("axios");
const fs = require("fs");
const config = require("../config/API.json");
const { extractCoins, extractPairs, extractTradeData, updateCoinsData, extractExchangeData, extractClosingMarketcapData } = require("../utils/utils");

const API_KEY = config.API_KEY;

function getEndpoint(url) {
    return axios.get(url, {
        headers: {
            "X-CMC_PRO_API_KEY": API_KEY,
            Accept: "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error fetching data from API:`, error);
            throw error;
        });
}

function writeDataToFile(filePath, data) {
    const content = `module.exports = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Data has been written to ${filePath}`);
}

async function generateSeedData() {
    try {
        const marketPairsResponse = await getEndpoint("https://pro-api.coinmarketcap.com/v1/exchange/market-pairs/latest?id=270&category=spot&limit=2000");
        let coinsData = extractCoins(marketPairsResponse.data.market_pairs);

        const coinIds = coinsData.map(coin => coin.coin_id).join(',');

        const coinInfoResponse = await getEndpoint(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`);

        coinsData = updateCoinsData(coinsData, coinInfoResponse);

        writeDataToFile("./db/data/coinsData.js", coinsData);

        const quotesResponse = await getEndpoint(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`);
        const tradeData = extractTradeData(quotesResponse.data);
        writeDataToFile("./db/data/tradeData.js", tradeData);

        const volume24MarketcapData = tradeData.map(coin => ({
            coin_id: coin.coin_id,
            volume_over_marketcap: (coin.volume24hr / coin.marketcap) * 100,
            timestamp: coin.timestamp,
        }));
        writeDataToFile("./db/data/volume24MarketcapData.js", volume24MarketcapData);

        const pairsData = extractPairs(marketPairsResponse.data.market_pairs);
        writeDataToFile("./db/data/pairsData.js", pairsData);

        const exchangeInfoResponse = await getEndpoint("https://pro-api.coinmarketcap.com/v1/exchange/quotes/latest?id=270")
        const exchangeData = extractExchangeData(exchangeInfoResponse)
        writeDataToFile("./db/data/exchangeData.js", exchangeData);

        const closingMarketcapResponse = await getEndpoint(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical?id=${coinIds}&interval=24h`);
        console.log(closingMarketcapResponse.data);
        const closingMarketcapData = extractClosingMarketcapData(closingMarketcapResponse.data);
        writeDataToFile("./db/data/closingMarketcapData.js", closingMarketcapData);

    } catch (error) {
        console.error("Failed to create seed data:", error);
    }
}

generateSeedData();