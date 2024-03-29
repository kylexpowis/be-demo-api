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
                        dateadded: expect.any(String)
                    });
                });
            });
    })
})