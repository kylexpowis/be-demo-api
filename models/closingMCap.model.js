const db = require("../db/connection");

exports.fetchROCMarketCap = () => {
  const queryString = `
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    ti.current_marketcap::FLOAT AS current_marketcap, 
    CAST(ROUND(((ti.current_marketcap - cm.closing_marketcap) / cm.closing_marketcap) * 100, 2) AS FLOAT) AS marketcap_percentage_change,
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
  SELECT
    c.coin_id,
    c.symbol,
    c.coin_name,
    c.logo_url,
    c.currency_type,
    vm.volume_over_marketcap::FLOAT AS volume_over_marketcap,
    vm.timestamp
FROM
    coins c
    INNER JOIN vol24marketcap vm ON vm.coin_id = c.coin_id AND vm.is_latest = TRUE
ORDER BY
    vm.timestamp DESC, vm.volume_over_marketcap DESC;`;
  return db.query(queryString).then(({ rows }) => rows);
};
