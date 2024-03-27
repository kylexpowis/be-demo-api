const db = require("../db/connection");

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
    console.log(result);
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
