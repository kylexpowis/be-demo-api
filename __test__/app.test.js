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
  test.only("GET:200 sends summary of coins", () => {
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
