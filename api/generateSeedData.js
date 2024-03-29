const axios = require("axios");
const fs = require("fs");
const config = require("../config/API.json");
const { extractCoins, extractPairs, extractTradeData } = require("../utils/utils");

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
        const coinsData = extractCoins(marketPairsResponse.data.market_pairs);
        writeDataToFile("./db/data/coinsData.js", coinsData);

        const coinIds = coinsData.map(coin => coin.coin_id).join(',');
        const quotesResponse = await getEndpoint(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`);
        const tradeData = extractTradeData(quotesResponse.data);
        writeDataToFile("./db/data/tradeData.js", tradeData);

        const pairsData = extractPairs(marketPairsResponse.data.market_pairs);
        writeDataToFile("./db/data/pairsData.js", pairsData);

    } catch (error) {
        console.error("Failed to create initial data:", error);
    }
}

generateSeedData();
