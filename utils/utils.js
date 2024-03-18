const fs = require("fs");

exports.filterInitialData = (data) => {
    const outputFilePath = './db/data/filteredData.js';
    const filteredData = data.filter(item => item.category === "spot");
    const content = `module.exports = ${JSON.stringify(filteredData, null, 2)};`;

    fs.writeFileSync(outputFilePath, content, 'utf8');
    return filteredData;
}

exports.extractCoins = (data) => {
    const coins = [];
    const seen = new Set(); 
    const outputFilePath = './db/data/dev-data/coinsData.js';

    data.forEach(item => {
        if (item.market_pair_base.currency_type === "cryptocurrency" && !seen.has(item.market_pair_base.currency_id)) {
            coins.push({
                coin_id: item.market_pair_base.currency_id,
                coin_name: item.market_pair_base.currency_symbol,
            });
            seen.add(item.market_pair_base.currency_id);
        }

        if (item.market_pair_quote.currency_type === "cryptocurrency" && !seen.has(item.market_pair_quote.currency_id)) {
            coins.push({
                coin_id: item.market_pair_quote.currency_id,
                coin_name: item.market_pair_quote.currency_symbol,
            });
            seen.add(item.market_pair_quote.currency_id);
        }
    });

    const content = `module.exports = ${JSON.stringify(coins, null, 2)};`;

    fs.writeFileSync(outputFilePath, content, 'utf8');
    console.log(`Coins data has been written to ${outputFilePath}`);
    return coins;
};

exports.extractPairs = (data) => {
    const pairs = [];
    const seen = new Set(); 
    const outputFilePath = './db/data/dev-data/pairsData.js';

    data.forEach(item => {
        if (item.market_pair_base.currency_type === "cryptocurrency" && item.market_pair_quote.currency_type === "cryptocurrency" && !seen.has(item.market_pair_base.currency_id)) {
            pairs.push({
                pair_id: item.market_id, 
                pair_name: item.market_pair,
                base_asset: item.market_pair_base.currency_symbol,
                quote_asset: item.market_pair_quote.currency_symbol,
                price: item.quote.exchange_reported.price,
                volume_24h: item.quote.exchange_reported.volume_24h,
                depth_negative_two: item.quote.exchange_reported.depth_negative_two,
                depth_positive_two: item.quote.exchange_reported.depth_positive_two,
                last_updated: item.quote.exchange_reported.last_updated
            });
            seen.add(item.market_id);
        }
    });

    const content = `module.exports = ${JSON.stringify(pairs, null, 2)};`;

    fs.writeFileSync(outputFilePath, content, 'utf8');
    console.log(`Pairs data has been written to ${outputFilePath}`);
    return pairs;
}