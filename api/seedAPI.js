const axios = require("axios");
const fs = require("fs");
const config = require("../config/API.json");
const { filterInitialData, extractCoins, extractPairs } = require("../utils/utils");
const InitialData = require("../db/data/initialData.js");
const filteredInitialData = require("../db/data/filteredData.js");

const API_KEY = config.API_KEY;

function getEndpoint(url, fileName, API_KEY) {
    const outputFilePath = './db/data/initialData.js';
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                headers: {
                    "X-CMC_PRO_API_KEY": API_KEY,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                const content = `module.exports = ${JSON.stringify(response.data.data.market_pairs, null, 2)};`;
                fs.writeFileSync(outputFilePath, content, 'utf8');
                console.log(`File written successfully: ${ fileName }`);
                resolve();
            })
            .catch((error) => {
                console.error(`Error writing file ${ fileName }:`, error);
                reject(error);
            });
    });
}

const createInitialData = async () => {
    await getEndpoint("https://pro-api.coinmarketcap.com/v1/exchange/market-pairs/latest?id=270&limit=2000", "InitialData", API_KEY);
}

createInitialData();
filterInitialData(InitialData)
extractCoins(filteredInitialData)
extractPairs(filteredInitialData)