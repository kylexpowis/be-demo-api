const db = require("../db/connection");

exports.fetchAllCoins = (sort_by = 'pairs_added', order = 'DESC') => {
    const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    let queryString = `
    SELECT
    c.coin_id,
    c.coin_name,
    c.symbol,
    c.coin_slug,
    c.date_added,
    c.logo_url,
    c.is_active,
    (
            SELECT COUNT(p.pair_name)::int
            FROM pairs p
            WHERE p.base_id = c.coin_id
        ) AS pair_count,
        (
            SELECT COUNT(p.pair_name)::int
            FROM pairs p
            WHERE p.base_id = c.coin_id
            AND p.date_added >= NOW() - INTERVAL '1 day'
        ) AS pairs_added,
        (
            SELECT COUNT(p.pair_name)::int
            FROM pairs p
            WHERE p.base_id = c.coin_id
            AND p.is_active = false
            AND p.date_removed >= NOW() - INTERVAL '1 day'
        ) AS pairs_removed
    FROM coins c`;

  if (!['coin_id', 'coin_name', 'symbol', 'coin_slug', 'logo_url', 'is_active','date_added', 'pair_count', 'pairs_added', 'pairs_removed'].includes(sort_by)) {
    sort_by = 'pairs_added';
  }

  queryString += ` ORDER BY ${sort_by} ${sortOrder}`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
}

exports.fetchCoinById = (coin_id) => {
  let queryString = `
  SELECT
  c.coin_id,
  c.coin_name,
  c.symbol,
  c.date_added,
  c.is_active,
  (
    SELECT COUNT(p.pair_id)::int
    FROM pairs p
    WHERE p.quote_id = c.coin_id
  ) AS trading_pair_count
FROM
  coins c
WHERE
  c.coin_id = $1;
`;
    return db.query(queryString, [coin_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Coin does not exist" });
        }
        return result.rows[0];
    });
};

exports.fetchNewCoins = (timeframe = "1 day") => {
  const validTimeframes = ["1 hour", "1 day", "3 days", "7 days", "28 days"];
  if (!validTimeframes.includes(timeframe)) {
    throw new Error("Invalid timeframe specified");
  }
  const queryString = `
  SELECT coin_id, coin_name, logo_url, date_added
  FROM coins
  WHERE coins.date_added >= NOW() - INTERVAL '${timeframe}';`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};


exports.selectPairsByBaseId = (base_id) => {
  return db.query(
    `SELECT *
FROM pairs
JOIN metrics ON metrics.base_id = pairs.base_id
WHERE pairs.base_id = $1;`, [base_id]
  ).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Coin does not exist" });
    }
    return result.rows;
})
}



