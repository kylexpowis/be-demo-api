const { filterInitialData, extractCoins, extractPairs } = require("../utils/utils");

describe('Testing functionality of the filterInitialData function', () => {
    const data =
        [{
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68156.3,
                    "volume_24h_base": 349366.21933805,
                    "volume_24h_quote": 23811508855.07,
                    "last_updated": "2024-03-17T21:56:58.000Z",
                    "volume_percentage": 20.764881180636984
                },
                "USD": {
                    "price": 68143.62067858,
                    "volume_24h": 23805924325.049778,
                    "last_updated": "2024-03-17T21:56:58.000Z"
                }
            },
            "market_id": 47150,
            "market_pair": "BTC/USDT",
            "category": "derivatives",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "ETH",
                "currency_symbol": "ETH",
                "currency_id": 1027,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 3632.44,
                    "volume_24h_base": 3060839.0285951,
                    "volume_24h_quote": 11118314121.03,
                    "last_updated": "2024-03-17T21:56:58.000Z",
                    "volume_percentage": 9.695751456045542
                },
                "USD": {
                    "price": 3631.76424626,
                    "volume_24h": 11115706534.952147,
                    "last_updated": "2024-03-17T21:56:58.000Z"
                }
            },
            "market_id": 47205,
            "market_pair": "ETH/USDT",
            "category": "derivatives",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68167.58,
                    "volume_24h_base": 104536.40099783,
                    "volume_24h_quote": 7125993477.931448,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 6.201394684837364
                },
                "USD": {
                    "price": 68015.66296916,
                    "volume_24h": 7109596789.538456,
                    "depth_negative_two": 5672867.9414484,
                    "depth_positive_two": 7220354.54566281,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1262381,
            "market_pair": "BTC/FDUSD",
            "category": "spot",
            "fee_type": "percentage"
        }]
    test('Function should filter the data to remove objects without the category "spot".', () => {
        const filteredData = filterInitialData(data);
        expect(filteredData).toEqual([{
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68167.58,
                    "volume_24h_base": 104536.40099783,
                    "volume_24h_quote": 7125993477.931448,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 6.201394684837364
                },
                "USD": {
                    "price": 68015.66296916,
                    "volume_24h": 7109596789.538456,
                    "depth_negative_two": 5672867.9414484,
                    "depth_positive_two": 7220354.54566281,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1262381,
            "market_pair": "BTC/FDUSD",
            "category": "spot",
            "fee_type": "percentage"
        }])
    })
    test('Function should filter the data to remove objects without the category "spot".', () => {
        const filteredData = filterInitialData(data);
        expect(filteredData.length).toBe(1);
        expect(filteredData[0].market_pair).toEqual("BTC/FDUSD");
    });
    test('Original data should not be mutated after function call', () => {
        const originalData = JSON.parse(JSON.stringify(data));
        const filteredData = filterInitialData(data);
        expect(data).toEqual(originalData);
    });
    test('Filtered data should not be the same instance as the original data', () => {
        const originalData = data;
        const filteredData = filterInitialData(data);
        expect(filteredData).not.toBe(originalData);
    });
    test('All remaining data should have the category "spot"', () => {
        const filteredData = filterInitialData(data);
        const allSpotCategory = filteredData.every(item => item.category === "spot");
        expect(allSpotCategory).toBe(true);
    });
})

describe('Testing functionality of extractCoins()', () => {
    const data = [
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68167.58,
                    "volume_24h_base": 104536.40099783,
                    "volume_24h_quote": 7125993477.931448,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 6.201394684837364
                },
                "USD": {
                    "price": 68015.66296916,
                    "volume_24h": 7109596789.538456,
                    "depth_negative_two": 5672867.9414484,
                    "depth_positive_two": 7220354.54566281,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1262381,
            "market_pair": "BTC/FDUSD",
            "category": "spot",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68026.61,
                    "volume_24h_base": 54141.7351261,
                    "volume_24h_quote": 3683078700.1465,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 3.213240530881203
                },
                "USD": {
                    "price": 67966.94265906,
                    "volume_24h": 3683823675.7006164,
                    "depth_negative_two": 12311782.95658095,
                    "depth_positive_two": 14018876.56417525,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 9933,
            "market_pair": "BTC/USDT",
            "category": "spot",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 0.9981,
                    "volume_24h_base": 2103583675.2662058,
                    "volume_24h_quote": 2099586866.2832,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 1.831749513410799
                },
                "USD": {
                    "price": 0.99722455,
                    "volume_24h": 2100011549.2770936,
                    "depth_negative_two": 23175673.22791588,
                    "depth_positive_two": 33729841.7826564,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1261061,
            "market_pair": "FDUSD/USDT",
            "category": "spot",
            "fee_type": "percentage"
        }]
    const expectedCoins = [
        { "coin_id": 1, "coin_name": "BTC" },
        { "coin_id": 26081, "coin_name": "FDUSD" },
        { "coin_id": 825, "coin_name": "USDT" }]
    test('Function should extract market base asset with the currency_id and symbol_name for each object', () => {
        const coins = extractCoins(data)
        expectedCoins.forEach(expectedCoin => {
            expect(coins).toEqual(expect.arrayContaining([expect.objectContaining(expectedCoin)]));
        });
    });
    test('All extracted coins should be unique', () => {
        const coins = extractCoins(data);
        const uniqueCoins = Array.from(new Set(coins.map(coin => JSON.stringify(coin)))).map(str => JSON.parse(str));
        expect(uniqueCoins.length).toEqual(coins.length);
    });

    test('No extra coins should be present in the output', () => {
        const coins = extractCoins(data);
        expect(coins.length).toEqual(expectedCoins.length);
    });

    test('Each coin object should have the correct structure', () => {
        const coins = extractCoins(data);
        coins.forEach(coin => {
            expect(coin).toHaveProperty('coin_id');
            expect(coin).toHaveProperty('coin_name');
            expect(typeof coin.coin_id).toBe('number');
            expect(typeof coin.coin_name).toBe('string');
        });
    });

    test('Function should return an empty array if input data is empty', () => {
        const emptyData = [];
        const coins = extractCoins(emptyData);
        expect(coins).toEqual([]);
    });
});

describe('Testing functionality of extracting pairs from data', () => {
    const data = [
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68167.58,
                    "volume_24h_base": 104536.40099783,
                    "volume_24h_quote": 7125993477.931448,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 6.201394684837364
                },
                "USD": {
                    "price": 68015.66296916,
                    "volume_24h": 7109596789.538456,
                    "depth_negative_two": 5672867.9414484,
                    "depth_positive_two": 7220354.54566281,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1262381,
            "market_pair": "BTC/FDUSD",
            "category": "spot",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "BTC",
                "currency_symbol": "BTC",
                "currency_id": 1,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 68026.61,
                    "volume_24h_base": 54141.7351261,
                    "volume_24h_quote": 3683078700.1465,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 3.213240530881203
                },
                "USD": {
                    "price": 67966.94265906,
                    "volume_24h": 3683823675.7006164,
                    "depth_negative_two": 12311782.95658095,
                    "depth_positive_two": 14018876.56417525,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 9933,
            "market_pair": "BTC/USDT",
            "category": "spot",
            "fee_type": "percentage"
        },
        {
            "outlier_detected": 0,
            "exclusions": null,
            "market_pair_base": {
                "exchange_symbol": "FDUSD",
                "currency_symbol": "FDUSD",
                "currency_id": 26081,
                "currency_type": "cryptocurrency"
            },
            "market_pair_quote": {
                "exchange_symbol": "USDT",
                "currency_symbol": "USDT",
                "currency_id": 825,
                "currency_type": "cryptocurrency"
            },
            "quote": {
                "exchange_reported": {
                    "price": 0.9981,
                    "volume_24h_base": 2103583675.2662058,
                    "volume_24h_quote": 2099586866.2832,
                    "last_updated": "2024-03-17T21:56:15.000Z",
                    "volume_percentage": 1.831749513410799
                },
                "USD": {
                    "price": 0.99722455,
                    "volume_24h": 2100011549.2770936,
                    "depth_negative_two": 23175673.22791588,
                    "depth_positive_two": 33729841.7826564,
                    "last_updated": "2024-03-17T21:56:15.000Z"
                }
            },
            "market_id": 1261061,
            "market_pair": "FDUSD/USDT",
            "category": "spot",
            "fee_type": "percentage"
        }]
    test('Function should correctly extract pair data from input, without relying on order', () => {
        const pairs = extractPairs(data);
        const expectedPairs = [{
            "pair_id": 1262381,
            "pair_name": "BTC/FDUSD",
            "base_asset": "BTC",
            "quote_asset": "FDUSD",
        },
        {
            "pair_id": 9933,
            "pair_name": "BTC/USDT",
            "base_asset": "BTC",
            "quote_asset": "USDT",
        },
        {
            "pair_id": 1261061,
            "pair_name": "FDUSD/USDT",
            "base_asset": "FDUSD",
            "quote_asset": "USDT",
        }];
        expect(pairs.length).toEqual(3);
        expectedPairs.forEach(expectedPair => {
            expect(pairs).toEqual(expect.arrayContaining([expect.objectContaining(expectedPair)]));
        });
    });
    test('All extracted pairs should have correct and complete information', () => {
        const pairs = extractPairs(data);
        pairs.forEach(pair => {
            expect(pair).toHaveProperty('pair_id');
            expect(pair).toHaveProperty('pair_name');
            expect(pair).toHaveProperty('base_asset');
            expect(pair).toHaveProperty('quote_asset');
        });
    });
});


describe('Testing functionality of ()', () => {
    test('should ', () => {

    });
});

describe('Testing functionality of ()', () => {
    test('should ', () => {

    });
});