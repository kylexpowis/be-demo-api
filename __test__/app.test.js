const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/dev-data/index.js");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/v1/coins/:coin_id", () => {
  test("200: Can get coin by ID including trading pair count", () => {
    return request(app)
      .get("/api/v1/coins/1")
      .expect(200)
      .then(({ body }) => {
        const coin = body.coin;
        expect(coin).toEqual({
          coin_id: 1,
          coin_name: null,
          symbol: "BTC",
          date_added: null,
          is_active: null,
          trading_pair_count: expect.any(Number),
        });
      });
  });

  test("404: Responds with an error for non-existent coin ID", () => {
    return request(app)
      .get("/api/v1/coins/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Coin does not exist");
      });
  });
});

describe("404: Non-existent endpoint", () => {
  test("should return error message of 'Path not found'", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

// describe("GET /api/coins-new", () => {
//   test("GET:200 sends new coins for default timeframe", () => {
//     return request(app)
//       .get("/api/coins-new")
//       .expect(200)
//       .then((res) => {
//         expect(Array.isArray(res.body.coins)).toBe(true);
//         res.body.coins.forEach((coin) => {
//           expect(coin).toMatchObject({
//             coin_id: expect.any(Number),
//             coin_name: expect.any(String),
//             logo_url: expect.any(String),
//             date_added: expect.any(String),
//           });
//         });
//       });
//   });
//   test("GET:200 sends new coins for a specific timeframe of 1 hour", () => {
//     return request(app)
//       .get("/api/coins-new?timeframe=1+hour")
//       .expect(200)
//       .then((response) => {
//         expect(Array.isArray(response.body.coins)).toBe(true);
//       });
//   });
//   test("GET:200 sends new coins for a specific timeframe of 1 day", () => {
//     return request(app)
//       .get("/api/coins-new?timeframe=1+day")
//       .expect(200)
//       .then((response) => {
//         expect(Array.isArray(response.body.coins)).toBe(true);
//         console.log(response.body.coins);
//       });
//   });
//   test("GET:200 sends new coins for a specific timeframe of 3 days", () => {
//     return request(app)
//       .get("/api/coins-new?timeframe=3+days")
//       .expect(200)
//       .then((response) => {
//         expect(Array.isArray(response.body.coins)).toBe(true);
//         console.log(response.body.coins);
//       });
//   });
//   test("GET:200 sends new coins for a specific timeframe of 7 days", () => {
//     return request(app)
//       .get("/api/coins-new?timeframe=7+days")
//       .expect(200)
//       .then((response) => {
//         expect(Array.isArray(response.body.coins)).toBe(true);
//         console.log(response.body.coins);
//       });
//   });
// });
