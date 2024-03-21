const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/dev-data/index.js");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  db.end();
});
