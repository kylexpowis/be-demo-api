const db = require("../db/connection");

exports.fetchAllCoins = () => {
    let queryString = `
    SELECT * FROM coins`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
}

exports.fetchCoinById = (coin_id) => {
    console.log("HI FROM MODEL");
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
      WHERE p.quote_asset = c.coin_name
  ) AS trading_pair_count
FROM coins c
WHERE c.coin_id = $1;
`;
    return db.query(queryString, [coin_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Coin does not exist" });
        }
        console.log(result);
        return result.rows[0];
    });
};
