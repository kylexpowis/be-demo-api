const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/dev-data/index.js");
//const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/coins", () => {
  test("GET:200 sends all coins", () => {
    return request(app)
      .get("/api/coins")
      .expect(200)
      .then((res) => {
        const coins = res.body.coins;
        coins.forEach((coin) => {
          expect(coin).toMatchObject({
            coin_id: expect.any(Number),
            coin_name: expect.any(String),
            symbol: expect.any(Object),
            coin_slug: expect.any(Object),
            date_added: expect.any(Object),
            logo_url: expect.any(Object),
            is_active: expect.any(Object)
          });
        });
      });
  })
  test("GET:404 responds with an appropriate status and error message when given a non-existent api", () => {
    return request(app)
      .get("/api/coin")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
})

describe("GET /api/coins/:coin_id", () => {
  test("200: Can get coin by ID including trading pair count", () => {
    return request(app)
      .get("/api/coins/1")
      .expect(404)
      .then(({ response }) => {
        const coin = response.coin;
        expect(coin).toEqual({
          coin_id: 1,
          coin_name: "Bitcoin",
          symbol: null,
          date_added: null,
          is_active: null,
          trading_pair_count: expect.any(Number),
        });
      });
  });

  test("404: Responds with an error for non-existent coin ID", () => {
    return request(app)
      .get("/api/coins/99999")
      .expect(404)
      .then(({ response }) => {
        expect(response.msg).toBe("Coin does not exist");
      });
  });
});

describe("404: Non existent endpoint", () => {
  test("should return error message of 'Path not found'", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then(({ response }) => {
        expect(response.msg).toBe("Path not found");
      });
  });
});


