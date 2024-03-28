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
  SELECT MAX(timestamp) AS latest_timestamp
FROM marketcaps
WHERE timestamp >= (DATE(NOW()) - INTERVAL '1 day')::timestamp
  AND timestamp < DATE(NOW())::timestamp;
  `;
  return db.query(queryString, [coin_id]).then((result) => {
    return result.rows.length ? result.rows[0].marketcap : null;
  });
};
