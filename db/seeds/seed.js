const format = require('pg-format');

const seed = ({ coinsData, pairsData, tradeData }) => {
    return db
        .query(`DROP TABLE IF EXISTS tradelimits;`).then(() => {
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS pairs;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS coins;`);
        })
        .then(() => {
            return db.query(`CREATE TABLE coins (
				coin_id INT PRIMARY KEY,
                symbol VARCHAR(50),
				coin_name VARCHAR(50) NOT NULL UNIQUE,
                coin-slug VARCHAR(50) NOT NULL UNIQUE,
				dateadded TIMESTAMP,
				logo_url TEXT
			);`)
        })
        .then(() => {
            return db.query(`CREATE TABLE pairs (
				pair_id INT PRIMARY KEY,
				pair_name VARCHAR(50) NOT NULL UNIQUE,
				base_asset VARCHAR(10) NOT NULL, 
				quote_asset VARCHAR(10) NOT NULL,
				isActive BOOLEAN NOT NULL,
				dateAdded TIMESTAMP NOT NULL,
				dateRemoved TIMESTAMP,
				FOREIGN KEY (base_asset) REFERENCES coins(coin_name) ON DELETE CASCADE,
				FOREIGN KEY (quote_asset) REFERENCES coins(coin_name) ON DELETE CASCADE
			);`)
        })
        .then(() => {
            return db.query(`CREATE TABLE metrics (
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
                FOREIGN KEY (base_asset) REFERENCES coins(coin_id) ON DELETE CASCADE,
				FOREIGN KEY (quote_asset) REFERENCES coins(coin_id) ON DELETE CASCADE
			);`)
        })
        .then(() => {
            return db.query(`CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email TEXT NOT NULL
            );`)
        })
        .then(() => {
            return db.query(`CREATE TABLE exchanges (
                exchange_id INT PRIMARY KEY,
                exchange_name VARCHAR(50),
                logo TEXT,
            );`)
        })
        .then(() => {
            return db.query(`CREATE TABLE watchlist (
                watch_id SERIAL PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                coin_id INT NOT NULL UNIQUE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
				FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
            );`)
        })
};

module.exports = seed;