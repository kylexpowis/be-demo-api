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
        is_active: true,
        date_added: new Date().toISOString(),
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
        marketcap: coin.quote.USD.market_cap,
        volume24hr: coin.quote.USD.volume_24h,
        volume_percent_change24hr: coin.quote.USD.volume_change_24h,
        timestamp: coin.quote.USD.last_updated,
      });
      seen.add(coin.id);
    }
  });

  return tradeData;
};

exports.extractExchangeData = (data) => {
  if (!data || !data.data || !data.data['270']) {
    console.error('Invalid data structure');
    return null;
  }

  const exchangeData = data.data['270'];
  const exchangeInfo = {
    id: exchangeData.id,
    name: exchangeData.name,
    coin_count: exchangeData.num_coins,
    market_pairs_count: exchangeData.num_market_pairs,
    last_updated: exchangeData.last_updated,
  };
  return exchangeInfo;
}

exports.extractClosingMarketcapData = (data) => {
  return Object.entries(data).map(([coinId, coinData]) => ({
      coin_id: coinId,
      closing_marketcap: coinData.quotes[coinData.quotes.length - 1]?.quote.USD.market_cap || null,
      timestamp: coinData.quotes[coinData.quotes.length - 1]?.timestamp || null,
  }));
}