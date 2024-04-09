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
  ),
  latest_tradeinfo AS (
    SELECT
      ti.coin_id,
      ti.current_marketcap,
      ROW_NUMBER() OVER(PARTITION BY ti.coin_id ORDER BY ti.timestamp DESC) as rn
    FROM
      tradeinfo ti
  )
SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    c.currency_type,
    v.volume_over_marketcap,
    v.timestamp,
    t.current_marketcap
FROM
    coins c
    JOIN latest_vol24marketcap v ON v.coin_id = c.coin_id
    LEFT JOIN latest_tradeinfo t ON c.coin_id = t.coin_id AND t.rn = 1
ORDER BY
    t.current_marketcap DESC, v.timestamp DESC, v.volume_over_marketcap DESC;
`;
  return db.query(queryString).then(({ rows }) => rows);
};
