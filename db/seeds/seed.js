const format = require("pg-format");
const db = require("../connection");

const seed = ({ coinsData, pairsData, tradeData }) => {
  return db
    .query(`DROP TABLE IF EXISTS tradeinfo;`)
    .then(() => db.query(`DROP TABLE IF EXISTS pairs;`))
    .then(() => db.query(`DROP TABLE IF EXISTS coins;`))
    .then(() =>
      db.query(`
        CREATE TABLE coins (
          coin_id INT PRIMARY KEY,
          symbol VARCHAR(10) NOT NULL,
          coin_name VARCHAR(50),
          currency_type VARCHAR(20),
          logo_url TEXT,
          is_active BOOLEAN,
          date_added TIMESTAMP
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
          depth_positive_two DECIMAL,
          depth_negative_two DECIMAL,
          volume24hr DECIMAL,
          is_active BOOLEAN,
          date_added TIMESTAMP,
          last_updated TIMESTAMP,
          FOREIGN KEY (base_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
          FOREIGN KEY (quote_id) REFERENCES coins(coin_id) ON DELETE CASCADE
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE tradeinfo (
          tradeinfo_id SERIAL PRIMARY KEY,
          coin_id INT,
          price DECIMAL,
          marketcap DECIMAL,
          circulating_supply DECIMAL,
          total_supply DECIMAL,
          max_supply DECIMAL,
          volume24hr DECIMAL,
          volume_percent_change24hr DECIMAL,
          timestamp TIMESTAMP,
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
          currency_type,
          logo_url,
          is_active,
          date_added,
        }) => {
          return [
            coin_id,
            symbol,
            coin_name,
            currency_type,
            logo_url,
            is_active,
            date_added,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO coins (coin_id, symbol, coin_name, currency_type, logo_url, is_active, date_added) VALUES %L`,
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
          depth_positive_two,
          depth_negative_two,
          volume24hr,
          is_active,
          date_added,
          last_updated,
        }) => {
          return [
            pair_id,
            pair_name,
            base_id,
            quote_id,
            depth_positive_two,
            depth_negative_two,
            volume24hr,
            is_active,
            date_added,
            last_updated,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO pairs (pair_id, pair_name, base_id, quote_id, depth_positive_two, depth_negative_two, volume24hr, is_active, date_added, last_updated) VALUES %L`,
        formattedPairsArray
      );
      return db.query(queryString);
    })
    .then(() => {
      const formattedTradeDataArray = tradeData.map(
        ({
          coin_id,
          price,
          marketcap,
          circulating_supply,
          total_supply,
          max_supply,
          volume24hr,
          volume_percent_change24hr,
          timestamp,
        }) => {
          return [
            coin_id,
            price,
            marketcap,
            circulating_supply,
            total_supply,
            max_supply,
            volume24hr,
            volume_percent_change24hr,
            timestamp,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO tradeinfo (coin_id, price, marketcap, circulating_supply, total_supply, max_supply, volume24hr, volume_percent_change24hr, timestamp) VALUES %L`,
        formattedTradeDataArray
      );
      return db.query(queryString);
    });
};

module.exports = seed;
