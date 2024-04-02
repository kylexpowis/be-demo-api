const db = require("../db/connection");

exports.fetchROCMarketCap = () => {
  const queryString = `SELECT
  closing_marketcap.coin_id,
  closing_marketcap.timestamp,
  (
    (tradeinfo.current_marketcap - closing_marketcap.closing_marketcap) / closing_marketcap.closing_marketcap * 100
  ) AS percentage_change
FROM
  closing_marketcap
JOIN
  tradeinfo ON closing_marketcap.coin_id = tradeinfo.coin_id
JOIN
  coins ON closing_marketcap.coin_id = coins.coin_id
WHERE
  coins.currency_type = 'cryptocurrency'
      `;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
