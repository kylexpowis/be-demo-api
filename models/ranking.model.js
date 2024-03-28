const db = require("../db/connection");

exports.fetchAllMarketCaps = () => {
  const queryString = `
    SELECT coin_id, marketcap
    FROM marketcaps
    `;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.fetchPreviousDayMarketCap = (coin_id) => {
  const queryString = `
  SELECT coin_id, marketcap
  FROM marketcaps
  WHERE coin_id = $1 AND timestamp::time = '23:59:59'
  ORDER BY timestamp DESC
  LIMIT $1;
  `;
  return db.query(queryString, [coin_id]).then((result) => {
    return result.rows.length ? result.rows[0].marketcap : null;
  });
};
