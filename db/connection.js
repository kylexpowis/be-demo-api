const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("Environment variable PGDATABASE or DATABASE_URL is not set");
}

const poolConfig = {};

if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Environment variable DATABASE_URL is required in production environment"
    );
  }

  poolConfig.connectionString = process.env.DATABASE_URL;
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  poolConfig.max = 20;
}

module.exports = new Pool(poolConfig);
