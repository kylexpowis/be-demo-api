const db = require("../db/connection");

exports.fetchNewCoins = (timeframe = '1 day') => {
    const validTimeframes = ['1 hour', '1 day', '3 days', '7 days', '14 days'];
    if (!validTimeframes.includes(timeframe)) {
        throw new Error('Invalid timeframe specified');
    }
    const queryString = `
    SELECT * 
    FROM coins
    WHERE coins.date_added >= NOW() - INTERVAL '${timeframe}';`;
    return db.query(queryString)
        .then((result) => {
            return result.rows;
        });
};

exports.fetchCoinByCoinId = (coin_id) => {
    let queryString = `
    SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    t.marketcap,
    t.price,
    t.volume24hr,
    t.volume_percent_change24hr,
    (t.volume24hr / t.marketcap) AS volume_marketcap
FROM
    coins c
JOIN
    tradeinfo t ON t.coin_id = c.coin_id
WHERE
    c.coin_id = $1;`;
    return db.query(queryString, [coin_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Coin does not exist" });
        }
        return result.rows[0];
    });
}