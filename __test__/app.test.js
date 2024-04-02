const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});
describe("GET /api/coins/new", () => {
  test("GET:200 sends new coins for default timeframe", () => {
    return request(app)
      .get("/api/coins/new")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.coins)).toBe(true);
        res.body.coins.forEach((coin) => {
          expect(coin).toMatchObject({
            coin_id: expect.any(Number),
            coin_name: expect.any(String),
            dateadded: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/pairs/summary", () => {
  test("GET:200 sends summary of coins", () => {
    return request(app)
      .get("/api/pairs/summary")
      .expect(200)
      .then((res) => {
        const coins = res.body.pairs;
        expect(coins).toMatchObject({
          coin_id: expect.any(Number),
          coin_name: expect.any(String),
          symbol: expect.any(String),
          pair_count: expect.any(Number),
          pairs_added: expect.any(Number),
          pairs_removed: expect.any(Number),
          logo_url: expect.any(String),
        });
      });
  });
});

describe("GET /api/coins/:coin_id", () => {
  test("GET:200 sends new coins for default timeframe", () => {
    return request(app)
      .get("/api/coins/1")
      .expect(200)
      .then((res) => {
        const coin = res.body.coin;
        expect(coin).toMatchObject({
          coin_id: expect.any(Number),
          symbol: expect.any(String),
          coin_name: expect.any(String),
          logo_url: expect.any(String),
          marketcap: expect.any(String),
          price: expect.any(String),
          volume24hr: expect.any(String),
          volume_percent_change24hr: expect.any(String),
        });
      });
  });
  test("GET:404 responds with an appropriate status and error message when given a non-existent api", () => {
    return request(app)
      .get("/api/coin")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/pairs/new", () => {
  test("GET:200 sends all new pairs limited to 20.", () => {
    return request(app)
      .get("/api/pairs/new")
      .expect(200)
      .then((res) => {
        const newPairs = res.body.pairs;
        expect(Array.isArray(newPairs)).toBe(true);
        expect(newPairs.length).toBeLessThanOrEqual(20);
        newPairs.forEach((pair) => {
          expect(pair).toMatchObject({
            pair_name: expect.any(String),
            date_added: expect.any(String),
            is_active: expect.any(Boolean),
          });
        });
      });
  });
});

describe("GET /api/pairs/:coin_id", () => {
  test("GET:200 sends pair details for a given coin ID", () => {
    return request(app)
      .get("/api/pairs/1")
      .expect(200)
      .then((res) => {
        const pairById = res.body.pairById;
        expect(Array.isArray(pairById)).toBe(true);
        pairById.forEach((pair) => {
          expect(pair).toMatchObject({
            pair_name: expect.any(String),
            is_active: expect.any(Boolean),
            date_added: expect.any(String),
            base_logo_url: expect.any(String),
            quote_logo_url: expect.any(String),
          });
        });
      });
  });
});
