const axios = require("axios");
const fs = require("fs");

const { filterInitialData, extractCoins, extractPairs } = require("../utils/utils");
const config = require("../config/API.json");

const API_KEY = config.API_KEY;

function getEndpoint(url, API_KEY) {
    return axios.get(url, {
        headers: {
            "X-CMC_PRO_API_KEY": API_KEY,
            Accept: "application/json",
        },
    })
        .then((response) => response.data.data.market_pairs)
        .catch((error) => {
            console.error(`Error fetching data from API:`, error);
            throw error;
        });
}

function writeDataToFile(filePath, data) {
    const content = `module.exports = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Data has been written to ${filePath}`);
};

const createInitialData = async () => {
    try {
        const marketPairs = await getEndpoint("https://pro-api.coinmarketcap.com/v1/exchange/market-pairs/latest?id=270&category=spot&limit=2000", API_KEY);
        writeDataToFile("./db/data/initialData.js", marketPairs);
        console.log("Initial data fetched and written successfully.");

        const filteredData = filterInitialData(marketPairs);
        writeDataToFile("./db/data/filteredData.js", filteredData);

        const coinsData = extractCoins(filteredData);
        writeDataToFile("./db/data/dev-data/coinsData.js", coinsData);

        const pairsData = extractPairs(filteredData);
        writeDataToFile("./db/data/dev-data/pairsData.js", pairsData);

    } catch (error) {
        console.error("Failed to create initial data:", error);
    }
};

createInitialData();