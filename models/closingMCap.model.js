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
  return db.query(queryString).then(({ rows }) => rows);
};

exports.fetchVolumeROC = () => {
  const queryString = `
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    t.vol_percentage_change,
    v.volume_over_marketcap
    FROM coins c
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
          AND c.currency_type = 'cryptocurrency'`;
  return db.query(queryString).then(({ rows }) => rows);
};
