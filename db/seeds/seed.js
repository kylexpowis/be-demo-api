const format = require("pg-format");
const db = require("../connection");

const seed = ({ coinsData, pairsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS watchlist;`)
    .then(() => db.query(`DROP TABLE IF EXISTS marketcaps;`))
    .then(() => db.query(`DROP TABLE IF EXISTS exchanges;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS metrics;`))
    .then(() => db.query(`DROP TABLE IF EXISTS pairs;`))
    .then(() => db.query(`DROP TABLE IF EXISTS coins;`))
    .then(() =>
      db.query(`
        CREATE TABLE coins (
          coin_id INT PRIMARY KEY,
          coin_name VARCHAR(50) NOT NULL UNIQUE,
          symbol VARCHAR(50),
          coin_slug VARCHAR(50),
          date_added TIMESTAMP,
          logo_url TEXT,
          is_active BOOLEAN
        );
      `)
    )
    .then(() =>
      db.query(`
      CREATE TABLE pairs (
        pair_id INT PRIMARY KEY,
        pair_name VARCHAR(50) NOT NULL,
        base_asset VARCHAR(50) NOT NULL, 
        quote_asset VARCHAR(50) NOT NULL, 
        is_active BOOLEAN,
        date_added TIMESTAMP,
        date_removed TIMESTAMP
      );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE metrics (
          price_id INT PRIMARY KEY,
          base_asset VARCHAR(50), 
          quote_asset VARCHAR(50), 
          timestamp TIMESTAMP,
          price DECIMAL,
          depth_negative_two DECIMAL,
          depth_positive_two DECIMAL
        );
      `)
    )
    .then(() =>
      db.query(`
      CREATE TABLE marketcaps (
        marketcap_id SERIAL PRIMARY KEY,
        coin_id INT,
        liquidity DECIMAL,
        marketcap DECIMAL,
        circulating_supply DECIMAL,
        total_supply DECIMAL,
        max_supply DECIMAL,
        volume24hr DECIMAL,
        FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
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
          exchange_id INT PRIMARY KEY,
          exchange_name VARCHAR(50),
          logo TEXT
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE watchlist (
          watch_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          coin_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
        );
      `)
    )
    .then(() => {
      const formattedCoinArray = coinsData.map(
        ({
          coin_id,
          coin_name,
          symbol,
          coin_slug,
          date_added,
          logo_url,
          is_active,
        }) => {
          return [
            coin_id,
            coin_name,
            symbol,
            coin_slug,
            date_added,
            logo_url,
            is_active,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO coins (coin_id, coin_name, symbol, coin_slug, date_added, logo_url, is_active) VALUES %L`,
        formattedCoinArray
      );
      return db.query(queryString);
    })
    .then(() => {
      const formattedPairsArray = pairsData.map(
        ({
          pair_id,
          pair_name,
          base_asset,
          quote_asset,
          isActive,
          date_added,
          date_removed,
        }) => {
          return [
            pair_id,
            pair_name,
            base_asset,
            quote_asset,
            isActive,
            date_added,
            date_removed,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO pairs (pair_id, pair_name, base_asset, quote_asset, is_active, date_added, date_removed) VALUES %L`,
        formattedPairsArray
      );
      return db.query(queryString);
    });
};

module.exports = seed;
