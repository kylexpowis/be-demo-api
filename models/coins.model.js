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