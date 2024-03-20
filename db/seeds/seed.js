const format = require("pg-format");
const db = require("../connection");

const seed = ({ coinsData, pairsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS watchlist;`)
    .then(() => db.query(`DROP TABLE IF EXISTS exchanges;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS metrics;`))
    .then(() => db.query(`DROP TABLE IF EXISTS pairs;`))
    .then(() => db.query(`DROP TABLE IF EXISTS coins;`))
    .then(() =>
      db.query(`
        CREATE TABLE coins (
          coin_id SERIAL PRIMARY KEY,
          symbol VARCHAR(50),
          coin_name VARCHAR(50) NOT NULL UNIQUE,
          coin_slug VARCHAR(50) NOT NULL UNIQUE,
          dateadded TIMESTAMP,
          logo_url TEXT
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE pairs (
          pair_id SERIAL PRIMARY KEY,
          pair_name VARCHAR(50) NOT NULL UNIQUE,
          symbol VARCHAR(10) NOT NULL,
          base_asset VARCHAR(10) NOT NULL, 
          quote_asset VARCHAR(10) NOT NULL,
          isActive BOOLEAN NOT NULL,
          dateAdded TIMESTAMP NOT NULL,
          dateRemoved TIMESTAMP,
          FOREIGN KEY (base_asset) REFERENCES coins(coin_name) ON DELETE CASCADE,
          FOREIGN KEY (quote_asset) REFERENCES coins(coin_name) ON DELETE CASCADE
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE metrics (
          price_id SERIAL PRIMARY KEY,
          base_asset_id INT,
          quote_asset_id INT,
          timestamp TIMESTAMP,
          price DECIMAL NOT NULL,
          volume24hr DECIMAL,
          circulating_supply DECIMAL,
          total_supply DECIMAL,
          max_supply DECIMAL,
          liquidity DECIMAL,
          marketcap DECIMAL,
          FOREIGN KEY (base_asset_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
          FOREIGN KEY (quote_asset_id) REFERENCES coins(coin_id) ON DELETE CASCADE
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email TEXT NOT NULL
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE exchanges (
          exchange_id SERIAL PRIMARY KEY,
          exchange_name VARCHAR(50),
          logo TEXT
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE watchlist (
          watch_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL UNIQUE,
          coin_id INT NOT NULL UNIQUE,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
        );
      `)
    )
    .then(() => {
      const formattedCoinArray = coinsData.map(({ coin_id, symbol, coin_name, coin_slug, dateAdded, logo_url }) => {
        return [coin_id, symbol, coin_name, null, dateAdded, logo_url];
      });
      const queryString = format(
        `INSERT INTO coins (coin_id, symbol, coin_name, coin_slug, dateadded, logo_url) VALUES %L`,
        formattedCoinArray
      );
      return db.query(queryString);
    })
    .then(() => {
      const formattedPairsArray = pairsData.map(({ pair_id, pair_name, symbol, baseAsset, quoteAsset, isActive, dateAdded, dateRemoved }) => {
        return [pair_id, pair_name, symbol, baseAsset, quoteAsset, isActive, dateAdded, dateRemoved];
      });
      const queryString = format(
        `INSERT INTO pairs (pair_id, pair_name, symbol, base_asset, quote_asset, isActive, dateAdded, dateRemoved) VALUES %L`,
        formattedPairsArray
      );
      return db.query(queryString);
    });
};

module.exports = seed;
