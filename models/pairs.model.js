const db = require("../db/connection");

exports.fetchMarketSummary = () => {
  const queryString = `
  SELECT
  c.coin_id,
  c.coin_name,
  c.symbol,
  (
      SELECT COUNT(p.pair_name)::int
      FROM pairs p
      WHERE p.base_id = c.coin_id AND p.is_active = true
  ) AS pair_count,
  (
      SELECT COUNT(p.pair_name)::int
      FROM pairs p
      WHERE p.base_id = c.coin_id
      AND p.date_added >= NOW() - INTERVAL '1 day'
  ) AS pairs_added,
  (
      SELECT COUNT(p.pair_name)::int
      FROM pairs p
      WHERE p.base_id = c.coin_id
      AND p.is_active = false
  ) AS pairs_removed,
  c.logo_url
FROM coins c;`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.fetchNewPairs = (timeframe) => {
  const validTimeframes = ['1 hour', '8 hours', '1 day', '3 days', '7 days', '14 days', '28 days'];
  if (!validTimeframes.includes(timeframe)) {
    throw new Error('Invalid timeframe specified');
  }
  const queryString = `
    SELECT * FROM pairs 
      WHERE date_added >= NOW() - INTERVAL '${timeframe}'
    ORDER BY date_added;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.fetchPairByCoinId = (coin_id) => {
  const queryString = `
    SELECT 
      p.pair_name,
      p.is_active,
      p.date_added,
      base.logo_url as base_logo_url,
      quote.logo_url as quote_logo_url
    FROM 
      pairs p
    JOIN 
      coins base ON p.base_id = base.coin_id
    JOIN 
      coins quote ON p.quote_id = quote.coin_id
    WHERE 
      (p.base_id = $1 OR p.quote_id = $1) AND p.is_active = true
    ORDER BY 
      p.date_added DESC;
  `;
  return db.query(queryString, [coin_id]).then(({ rows }) => rows);
};