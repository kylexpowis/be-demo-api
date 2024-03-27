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
          symbol VARCHAR(50) NOT NULL,
          coin_name VARCHAR(50),
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
        base_id INT NOT NULL, 
        quote_id INT NOT NULL, 
        is_active BOOLEAN,
        date_added TIMESTAMP,
        date_removed TIMESTAMP,
        FOREIGN KEY (base_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
        FOREIGN KEY (quote_id) REFERENCES coins(coin_id) ON DELETE CASCADE
      );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE metrics (
          price_id INT PRIMARY KEY,
          base_id INT,
          quote_id INT,
          pair_id INT,
          timestamp TIMESTAMP,
          price DECIMAL,
          depth_negative_two DECIMAL,
          depth_positive_two DECIMAL,
          volume24hr DECIMAL,
          FOREIGN KEY (base_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
          FOREIGN KEY (quote_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
          FOREIGN KEY (pair_id) REFERENCES pairs(pair_id) ON DELETE CASCADE
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
        timestamp TIMESTAMP,
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
          symbol,
          coin_name,
          coin_slug,
          date_added,
          logo_url,
          is_active,
        }) => {
          return [
            coin_id,
            symbol,
            coin_name,
            coin_slug,
            date_added,
            logo_url,
            is_active,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO coins (coin_id, symbol, coin_name,  coin_slug, date_added, logo_url, is_active) VALUES %L`,
        formattedCoinArray
      );
      return db.query(queryString);
    })
    .then(() => {
      const formattedPairsArray = pairsData.map(
        ({
          pair_id,
          pair_name,
          base_id,
          quote_id,
          isActive,
          date_added,
          date_removed,
        }) => {
          return [
            pair_id,
            pair_name,
            base_id,
            quote_id,
            isActive,
            date_added,
            date_removed,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO pairs (pair_id, pair_name, base_id, quote_id, is_active, date_added, date_removed) VALUES %L`,
        formattedPairsArray
      );
      return db.query(queryString);
    });
};

module.exports = seed;