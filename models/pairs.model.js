const db = require("../db/connection");

exports.fetchNewPairs = () => {
  const queryString = `
    SELECT * FROM pairs
WHERE date_added >= NOW() - INTERVAL '1 day'
ORDER BY date_added
DESC LIMIT 20`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};