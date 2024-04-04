const db = require("../db/connection");

exports.fetchROCMarketCap = () => {
  const queryString = `
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    ROUND(((ti.current_marketcap - cm.closing_marketcap) / cm.closing_marketcap) * 100, 2) AS marketcap_percentage_change,
    ti.timestamp AS latest_timestamp
FROM
    coins c
INNER JOIN
    closing_marketcap cm ON c.coin_id = cm.coin_id
INNER JOIN
    tradeinfo ti ON c.coin_id = ti.coin_id
INNER JOIN
    (SELECT
        coin_id,
        MAX(timestamp) AS MaxTimestamp
     FROM
        tradeinfo
     GROUP BY
        coin_id) tm ON ti.coin_id = tm.coin_id AND ti.timestamp = tm.MaxTimestamp
WHERE
    c.is_active = TRUE
ORDER BY
    marketcap_percentage_change DESC;`;
  return db.query(queryString).then(({ rows }) => rows);
};

exports.fetchVolumeROC = () => {
  const queryString = `
  WITH ranked_tradeinfo AS (
    SELECT
      coin_id,
      vol_percentage_change,
      ROW_NUMBER() OVER (PARTITION BY coin_id ORDER BY timestamp DESC) as rank
    FROM tradeinfo
  ),
  latest_volume AS (
    SELECT
      coin_id,
      volume_over_marketcap,
      ROW_NUMBER() OVER (PARTITION BY coin_id ORDER BY timestamp DESC) as rank
    FROM vol24marketcap
  )
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    t.vol_percentage_change,
    v.volume_over_marketcap
  FROM
    coins c
  JOIN
    ranked_tradeinfo t ON t.coin_id = c.coin_id AND t.rank = 1
  JOIN
    latest_volume v ON v.coin_id = c.coin_id AND v.rank = 1
  WHERE
    c.currency_type = 'cryptocurrency';`;
  return db.query(queryString).then(({ rows }) => rows);
};
