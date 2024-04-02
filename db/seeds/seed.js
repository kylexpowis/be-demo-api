const format = require('pg-format');
const db = require('../connection');

const seed = async ({ coinsData, pairsData, tradeData, exchangeData, closingMarketcapData, vol24MarketcapData }) => {
  await db.query(`BEGIN`);
  try {
    await db.query('DROP TABLE IF EXISTS exchange CASCADE;');
    await db.query('DROP TABLE IF EXISTS tradeinfo CASCADE;');
    await db.query('DROP TABLE IF EXISTS closing_marketcap CASCADE;');
    await db.query('DROP TABLE IF EXISTS vol24marketcap CASCADE;');
    await db.query('DROP TABLE IF EXISTS pairs CASCADE;');
    await db.query('DROP TABLE IF EXISTS coins CASCADE;');

    await db.query(`
    CREATE TABLE coins (
      coin_id INT PRIMARY KEY,
      symbol VARCHAR(10) NOT NULL,
      coin_name VARCHAR(50),
      logo_url TEXT,
      date_added TIMESTAMP,
      currency_type VARCHAR(30),
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

    await db.query(`
    CREATE TABLE pairs (
      pair_id INT PRIMARY KEY,
      pair_name VARCHAR(30) NOT NULL,
      base_id INT NOT NULL,
      quote_id INT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      date_added TIMESTAMP,
      FOREIGN KEY (base_id) REFERENCES coins(coin_id) ON DELETE CASCADE,
      FOREIGN KEY (quote_id) REFERENCES coins(coin_id) ON DELETE CASCADE
    );
  `);

    await db.query(`
    CREATE TABLE tradeinfo (
      tradeinfo_id SERIAL PRIMARY KEY,
      coin_id INT,
      current_marketcap DECIMAL,
      current_volume DECIMAL,
      vol_percentage_change DECIMAL,
      timestamp TIMESTAMP,
      FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
    );
  `);

    await db.query(`
    CREATE TABLE exchange (
      exchange_id SERIAL PRIMARY KEY,
      exchange_name VARCHAR(20),
      coincount INT,
      paircount INT,
      last_updated TIMESTAMP
    );
  `);

    await db.query(`
    CREATE TABLE closing_marketcap (
      close_id SERIAL PRIMARY KEY,
      coin_id INT,
      closing_marketcap DECIMAL,
      timestamp TIMESTAMP,
      FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
    );
  `);

    await db.query(`
    CREATE TABLE vol24marketcap (
      vol_id SERIAL PRIMARY KEY,
      coin_id INT,
      volume_over_marketcap DECIMAL,
      timestamp TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
    );
  `);

    if (coinsData.length) {
      const formattedCoinsData = coinsData.map(({ coin_id, symbol, coin_name, logo_url, date_added, currency_type, is_active }) => [
        coin_id, symbol, coin_name, logo_url, date_added, currency_type, is_active
      ]);
      const coinsQuery = format('INSERT INTO coins (coin_id, symbol, coin_name, logo_url, date_added, currency_type, is_active) VALUES %L;', formattedCoinsData);
      await db.query(coinsQuery);
    }

    if (pairsData.length) {
      const formattedPairsData = pairsData.map(({ pair_id, pair_name, base_id, quote_id, is_active, date_added }) => [
        pair_id, pair_name, base_id, quote_id, is_active, date_added
      ]);
      const pairsQuery = format('INSERT INTO pairs (pair_id, pair_name, base_id, quote_id, is_active, date_added) VALUES %L;', formattedPairsData);
      await db.query(pairsQuery);
    }

    if (tradeData.length) {
      const formattedTradeData = tradeData.map(({ coin_id, marketcap, volume24hr, volume_percent_change24hr }) => [
        coin_id, marketcap, volume24hr, volume_percent_change24hr
      ]);
      const tradeInfoQuery = format('INSERT INTO tradeinfo (coin_id, current_marketcap, current_volume, vol_percentage_change) VALUES %L;', formattedTradeData);
      await db.query(tradeInfoQuery);
    }

    if (exchangeData.length) {
      const formattedExchangeData = exchangeData.map(({ exchange_id, exchange_name, coin_count, market_pairs_count, last_updated }) => [exchange_id, exchange_name, coin_count, market_pairs_count, last_updated])

      const exchangeQuery = format(`INSERT INTO exchange (exchange_id, exchange_name, coin_count, market_pairs_count, last_updated) VALUES %L;`, formattedExchangeData)
      await db.query(exchangeQuery)
    }

    if (closingMarketcapData.length) {
      const formattedCMData = closingMarketcapData.map(({ coin_id, closing_marketcap, timestamp }) => [coin_id, closing_marketcap, timestamp])

      const CMcapQuery = format(`INSERT INTO closing_marketcap (coin_id, closing_marketcap, timestamp) VALUES %L;`, formattedCMData)
      await db.query(CMcapQuery)
    }

    if (vol24MarketcapData) {
      const formattedVol24Data = vol24MarketcapData.map(({ coin_id, volume_over_marketcap, timestamp }) => [coin_id, volume_over_marketcap, timestamp]);

      const vol24Query = format('INSERT INTO vol24marketcap (coin_id, volume_over_marketcap, timestamp) VALUES %L;', formattedVol24Data);
      await db.query(vol24Query);
    }
    await db.query('COMMIT');
  }
  catch (error) {
    await db.query('ROLLBACK');
    console.error('Error during seeding:', error);
  }
};

module.exports = seed;
