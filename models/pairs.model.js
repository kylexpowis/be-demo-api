const db = require("../db/connection");

exports.fetchNewPairs = () => {
  const queryString = `
  SELECT
  c.coin_id,
  c.coin_name,
  c.symbol,
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
  ) AS pairs_removed,
  c.logo_url
FROM coins c;`;
  return db.query(queryString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Coin does not exist" });
    }
    return result.rows[0];
  });
};

exports.showLatestPairs = () => {
  const queryString = `SELECT
    pair_name,
    date_added,
    is_active FROM pairs ORDER BY date_added
      DESC LIMIT 20
    `;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
