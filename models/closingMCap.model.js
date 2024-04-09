const db = require("../db/connection");

exports.fetchROCMarketCap = () => {
  const queryString = `
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    ti.current_marketcap, 
  ROUND(((ti.current_marketcap - cm.closing_marketcap) / cm.closing_marketcap) * 100, 2) AS marketcap_percentage_change,
    ti.timestamp 
FROM
    coins c
INNER JOIN
    closing_marketcap cm ON c.coin_id = cm.coin_id
INNER JOIN
    tradeinfo ti ON c.coin_id = ti.coin_id AND ti.is_latest = TRUE
WHERE
    c.is_active = TRUE
ORDER BY
    ti.current_marketcap DESC;`;
  return db.query(queryString).then(({ rows }) => rows);
};

exports.fetchVolumeROC = () => {
  const queryString = `
  WITH latest_timestamps AS (
    SELECT
      coin_id,
      MAX(timestamp) as latest_timestamp
    FROM
      vol24marketcap
    GROUP BY
      coin_id
  ),
  latest_vol24marketcap AS (
    SELECT
      vm.coin_id,
      vm.volume_over_marketcap,
      vm.timestamp
    FROM
      vol24marketcap vm
      INNER JOIN latest_timestamps lt ON vm.coin_id = lt.coin_id AND vm.timestamp = lt.latest_timestamp
  )
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    c.currency_type,
    v.volume_over_marketcap,
    v.timestamp
  FROM
    coins c
    JOIN latest_vol24marketcap v ON v.coin_id = c.coin_id
  ORDER BY
    v.timestamp DESC, v.volume_over_marketcap DESC;`;
  return db.query(queryString).then(({ rows }) => rows);
};
