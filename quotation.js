var module = (function() {
    const request = include("./request.js");

    function _url_for_candles(interval) {
        return "https://api.upbit.com/v1/candles/" + ({
            "1m"   : "minutes/1",
            "3m"   : "minutes/3",
            "5m"   : "minutes/5",
            "15m"  : "minutes/15",
            "30m"  : "minutes/30",
            "60m"  : "minutes/60",
            "240m" : "minutes/240",
            "day"  : "days",
            "week" : "weeks",
            "month": "months",
        }[interval] || "days");
    }

    return {
        get_markets: function(currency) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/market/all";

                request.get(url)
                    .then(function(data) {
                        var markets = data.map(function(entry) {
                            return entry["market"];
                        });

                        if (currency) {
                            markets = markets.filter(function(market) {
                                return market.startsWith(currency);
                            });
                        }

                        resolve(markets);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_current_price: function(markets) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/ticker";
                var params = {
                    "markets": Array.isArray(markets) ? markets.join(",") : markets
                }

                request.get(url, params)
                    .then(function(data) {
                        var prices = data.reduce(function(map, entry) {
                            return Object.assign(map, {
                                [entry["market"]]: entry["trade_price"]
                            });
                        }, {});

                        if (!Array.isArray(markets) && data.length === 1) {
                            prices = Object.values(prices[0])[0];
                        }

                        resolve(prices);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_orderbook: function(markets) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orderbook";
                var params = {
                    "markets": Array.isArray(markets) ? markets.join(",") : markets
                }

                request.get(url, params)
                    .then(function(data) {
                        var orderbooks = data.reduce(function(map, entry) {
                            return Object.assign(map, {
                                [entry["market"]]: Object.keys(entry).filter(function(key) {
                                    return key !== "market";
                                })
                                .reduce(function(map, key) {
                                    return Object.assign(map, {
                                        [key]: entry[key]
                                    });
                                }, {})
                            });
                        }, {});

                        if (!Array.isArray(markets) && data.length === 1) {
                            orderbooks = Object.values(orderbooks[0])[0];
                        }

                        resolve(orderbooks);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_candles: function(market, options) {
            return new Promise(function(resolve, reject) {
                var interval = (options || {})["interval"] || "day";
                var url = _url_for_candles(interval);
                var params = {
                    "market": market,
                    "count": (options || {})["count"] || 1
                }

                request.get(url, params)
                    .then(function(data) {
                        var candles = data.map(function(entry) {
                            return Object.keys(entry).filter(function(key) {
                                    return key !== "market";
                                })
                                .reduce(function(map, key) {
                                    return Object.assign(map, {
                                        [key]: entry[key]
                                    });
                                }, {});
                        });

                        resolve(candles);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },
    }
})();

__MODULE__ = module;
