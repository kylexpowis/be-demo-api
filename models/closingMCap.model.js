const db = require("../db/connection");

exports.fetchROCMarketCap = () => {
  const queryString = `SELECT DISTINCT ON (cm.coin_id)
  cm.coin_id,
  cm.timestamp,
  (
    (ti.current_marketcap - cm.closing_marketcap) / cm.closing_marketcap * 100
  ) AS percentage_change
  FROM
  closing_marketcap cm
  JOIN
  tradeinfo ti ON cm.coin_id = ti.coin_id
  JOIN
  coins c ON cm.coin_id = c.coin_id
  WHERE
  c.currency_type = 'cryptocurrency'
  ORDER BY
  cm.coin_id, cm.timestamp DESC;`;
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
