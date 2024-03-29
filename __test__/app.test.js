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
describe("GET /api/coins/:coin_id", () => {
    test("GET:200 sends new coins for default timeframe", () => {
        return request(app)
            .get("/api/coins/1")
            .expect(200)
            .then((res) => {
                const coin = res.body.coin
                    expect(coin).toMatchObject({
                        coin_id: expect.any(Number),
                        symbol: expect.any(String),
                        coin_name: expect.any(String),
                        logo_url: expect.any(String),
                        marketcap: expect.any(String),
                        price: expect.any(String),
                        volume24hr: expect.any(String),
                        volume_percent_change24hr: expect.any(String)
                });
            });
    })
})