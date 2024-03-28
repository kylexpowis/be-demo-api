const fs = require("fs");

exports.filterInitialData = (data) => {
  return data.filter((item) => item.category === "spot");
};

exports.extractCoins = (data) => {
  const coins = [];
  const seen = new Set();

  data.forEach((item) => {
    if (!seen.has(item.market_pair_base.currency_id)) {
      coins.push({
        coin_id: item.market_pair_base.currency_id,
        symbol: item.market_pair_base.currency_symbol,
      });
      seen.add(item.market_pair_base.currency_id);
    }

    if (!seen.has(item.market_pair_quote.currency_id)) {
      coins.push({
        coin_id: item.market_pair_quote.currency_id,
        symbol: item.market_pair_quote.currency_symbol,
      });
      seen.add(item.market_pair_quote.currency_id);
    }
  });

  return coins;
};

exports.extractPairs = (data) => {
  const pairs = [];
  const seen = new Set();

  data.forEach((item) => {
    if (
      item.market_pair_base.currency_type === "cryptocurrency" &&
      item.market_pair_quote.currency_type === "cryptocurrency" &&
      !seen.has(item.market_id)
    ) {
      pairs.push({
        pair_id: item.market_id,
        pair_name: item.market_pair,
        base_id: item.market_pair_base.currency_id,
        quote_id: item.market_pair_quote.currency_id,
      });
      seen.add(item.market_id);
    }
  });

  return pairs;
};

exports.formatPairsData = (data) => {
  return data.map((item) => ({
    ...item,
    is_active: null,
    date_added: null,
    date_removed: null,
  }));
};

exports.formatCoinsData = (data) => {
  return data.map((item) => ({
    ...item,
    coin_name: null,
    coin_slug: null,
    date_added: null,
    logo_url: null,
    is_active: null,
  }));
};
