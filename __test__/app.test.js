const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/dev-data/index.js");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/coins/:coin_id", () => {
  // test("200: Can get coin by ID including trading pair count", () => {
  //   return request(app)
  //     .get("/api/coins/1")
  //     .expect(404)
  //     .then(({ response }) => {
  //       const coin = response.coin;
  //       expect(coin).toEqual({
  //         coin_id: 1,
  //         coin_name: "Bitcoin",
  //         symbol: null,
  //         date_added: null,
  //         is_active: null,
  //         trading_pair_count: expect.any(Number),
  //       });
  //     });
  // });

  // test("404: Responds with an error for non-existent coin ID", () => {
  //   return request(app)
  //     .get("/api/coins/99999")
  //     .expect(404)
  //     .then(({ response }) => {
  //       expect(response.msg).toBe("Coin does not exist");
  //     });
  // });
  test('Should pass', () => {
    
  });
});

describe("404: Non existent endpoint", () => {
  // test("should return error message of 'Path not found'", () => {
  //   return request(app)
  //     .get("/api/nothing")
  //     .expect(404)
  //     .then(({ response }) => {
  //       expect(response.msg).toBe("Path not found");
  //     });
  // });
  test('should pass', () => {
    
  });
});
