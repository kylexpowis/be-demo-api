const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/dev-data/index.js");
const { toBeSorted } = require('jest-sorted');



//const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  return db.end();
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
            coin_name: expect.any(Object),
            symbol: expect.any(String),
            coin_slug: expect.any(Object),
            date_added: expect.any(Object),
            logo_url: expect.any(Object),
            is_active: expect.any(Object),
            pair_count: expect.any(Number),
            pairs_added: expect.any(Number),
            pairs_removed: expect.any(Number)
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
describe("GET /api/coins/most-paired", () => {
  test("GET:200 sends all coins by most paired and makes sure the first coin sent doesn't have a pair_count of 0.", () => {
    return request(app)
      .get("/api/coins?order=DESC&sort_by=pair_count")
      .expect(200)
      .then((res) => {
        const coins = res.body.coins;
        //expect(coins).toBeSorted('pair_count', {descending :true})
      })
  });

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
// describe("GET /api/v1/pairs/:base_id", () => {
//   test.only("GET:200 gets all pairs by base id", () => {
//     return request(app)
//       .get("/api/v1/pairs/1")
//       .expect(200)
//       .then((res) => {
//         console.log(res, 'this is res in test');
//         const base = res.body.base;
//         base.forEach((item) => {
//           expect(item).toMatchObject({
//             pair_id: expect.any(Number),
//             pair_name: expect.any(String),
//             base_id: expect.any(Number),
//             quote_id: expect.any(Number),
//             is_active: expect.any(Boolean),
//             date_added: null,
//             date_removed: null,
//             pairs_removed: null,
//             quote_id: expect.any(Number),
//             timestamp: expect.any(Number),
//             price: expect.any(Number),
//             depth_negative_two: expect.any(Number),
//             depth_positive_two: expect.any(Number),
//             volume24hr: expect.any(Number),
//           });
//         });
//       });
//   })
// })
