exports.extractCoins = (data) => {
  const coins = [];
  const seen = new Set();

  data.forEach((item) => {
    if (!seen.has(item.market_pair_base.currency_id)) {
      coins.push({
        coin_id: item.market_pair_base.currency_id,
        symbol: item.market_pair_base.currency_symbol,
        coin_name: null, 
        currency_type: item.market_pair_base.currency_type,
        logo_url: null, 
        is_active: true, 
        date_added: null, 
      });
      seen.add(item.market_pair_base.currency_id);
    }

    if (!seen.has(item.market_pair_quote.currency_id)) {
      coins.push({
        coin_id: item.market_pair_quote.currency_id,
        symbol: item.market_pair_quote.currency_symbol,
        coin_name: null,
        currency_type: item.market_pair_quote.currency_type,
        logo_url: null, 
        is_active: true, 
        date_added: null, 
      });
      seen.add(item.market_pair_quote.currency_id);
    }
  });

  return coins;
};

exports.updateCoinsData = (coinsData, coinInfoResponse) => {
  return coinsData.map((coin) => {
    const coinInfo = coinInfoResponse.data[coin.coin_id.toString()];
    if (coinInfo) {
      return {
        ...coin,
        coin_name: coinInfo.name, 
        logo_url: coinInfo.logo,  
        date_added: coinInfo.date_added 
      };
    }
    return coin;
  });
};

exports.extractPairs = (data) => {
  const pairs = [];
  const seen = new Set();

  data.forEach((item) => {
    if (!seen.has(item.market_id)) {
      pairs.push({
        pair_id: item.market_id,
        pair_name: item.market_pair,
        base_id: item.market_pair_base.currency_id,
        quote_id: item.market_pair_quote.currency_id,
        depth_positive_two: item.quote.USD.depth_positive_two,
        depth_negative_two: item.quote.USD.depth_negative_two,
        volume24hr: item.quote.USD.volume_24h,
        is_active: true, 
        date_added: new Date().toISOString(),
        last_updated: item.quote.USD.last_updated,
      });
      seen.add(item.market_id);
    }
  });

  return pairs;
};

exports.extractTradeData = (data) => {
  const tradeData = [];
  const seen = new Set();

  Object.values(data).forEach((coin) => {
    if (coin.quote && coin.quote.USD && !seen.has(coin.id)) {
      tradeData.push({
        coin_id: coin.id,
        price: coin.quote.USD.price,
        marketcap: coin.quote.USD.market_cap,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        volume24hr: coin.quote.USD.volume_24h,
        volume_percent_change24hr: coin.quote.USD.volume_change_24h,
        timestamp: coin.quote.USD.last_updated,
      });
      seen.add(coin.id);
    }
  });

  return tradeData;
};