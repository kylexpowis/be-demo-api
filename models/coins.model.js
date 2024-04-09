const db = require("../db/connection");

exports.fetchNewCoins = (timeframe = '1 day') => {
    const validTimeframes = ['1 hour', '8 hours', '1 day', '3 days', '7 days', '14 days', '28 days'];
    if (!validTimeframes.includes(timeframe)) {
        throw new Error('Invalid timeframe specified');
    }
    const queryString = `
    SELECT * FROM coins 
    WHERE date_added >= NOW() - INTERVAL '${timeframe}'::interval
    ORDER BY date_added;
    `;
    return db.query(queryString)
        .then((result) => result.rows);
};

exports.fetchCoinByCoinId = (coin_id) => {
    const queryString = `
        SELECT
            c.coin_id,
            c.symbol,
            c.coin_name,
            c.logo_url,
            t.current_marketcap,
            t.current_volume,
            t.vol_percentage_change,
            v.volume_over_marketcap
        FROM
            coins c
        JOIN
            tradeinfo t ON t.coin_id = c.coin_id
        JOIN (
            SELECT
                coin_id,
                volume_over_marketcap,
                timestamp
            FROM
                vol24marketcap v1
            WHERE
                v1.timestamp = (SELECT MAX(v2.timestamp)
                                FROM vol24marketcap v2
                                WHERE v1.coin_id = v2.coin_id)
        ) v ON v.coin_id = c.coin_id
        WHERE
            c.coin_id = $1;
    `;
    return db.query(queryString, [coin_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Coin does not exist" });
            }
            return result.rows[0];
        });
};

exports.fetchVolMarketcapData = (coin_id) => {
    const queryString = `
    SELECT 
        to_timestamp(floor((extract('epoch' from timestamp) / 300)) * 300) AS rounded_timestamp, 
        AVG(volume_over_marketcap) AS avg_volume_over_marketcap
    FROM 
        vol24marketcap
    WHERE 
    coin_id = $1 AND 
        timestamp >= CURRENT_DATE - INTERVAL '14 days'
    GROUP BY 
        rounded_timestamp
    ORDER BY 
        rounded_timestamp ASC;`
    return db.query(queryString, [coin_id])
        .then((result) => {
            return result.rows;
        })
}
