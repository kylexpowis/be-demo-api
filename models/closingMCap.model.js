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
