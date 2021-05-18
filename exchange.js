var module = (function() {
    const request = include("./request.js");

    return {
        get_balances: function(credential) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/accounts";

                request.get(url, {}, credential)
                    .then(function(data) {
                        var balances = data.reduce(function(map, entry) {
                            return Object.assign(map, {
                                [entry["currency"]]: Object.keys(entry).filter(function(key) {
                                    return key !== "currency";
                                })
                                .reduce(function(map, key) {
                                    return Object.assign(map, {
                                        [key]: entry[key]
                                    });
                                }, {})
                            });
                        }, {});

                        resolve(balances);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        buy_limit_order: function(credential, market, price, volume) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orders";
                var params = {
                    "market": market,
                    "side": "bid",
                    "ord_type": "limit",
                    "volume": volume.toString(),
                    "price": price.toString()
                };
                
                request.post(url, params, credential)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        buy_market_order: function(credential, market, price) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orders";
                var params = {
                    "market": market,
                    "side": "bid",
                    "ord_type": "price",
                    "price": price.toString()
                };

                request.post(url, params, credential)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        sell_limit_order: function(credential, market, price, volume) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orders";
                var params = {
                    "market": market,
                    "side": "ask",
                    "ord_type": "limit",
                    "volume": volume.toString(),
                    "price": price.toString()
                };

                request.post(url, params, credential)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        sell_market_order: function(credential, market, volume) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orders";
                var params = {
                    "market": market,
                    "side": "ask",
                    "ord_type": "market",
                    "price": price.toString()
                };
                
                request.post(url, params, credential)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_order: function(credential, uuid) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/orders";
                var params = {
                    "uuid": uuid
                };

                request.get(url, params, credential)
                    .then(function(result) {
                        if (result.length > 0 && result[0]["uuid"] === uuid) {
                            resolve(result[0]);
                        } else {
                            resolve();
                        }
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        cancel_order: function(credential, uuid) {
            return new Promise(function(resolve, reject) {
                var url = "https://api.upbit.com/v1/order";
                var params = {
                    "uuid": uuid
                };

                request.delete(url, params, credential)
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_order_price: function(price) {
            if (price >= 2000000) {
                return Math.round(price / 1000) * 1000;
            }

            if (price >= 1000000) {
                return Math.round(price / 500) * 500;
            }

            if (price >= 500000) {
                return Math.round(price / 100) * 100;
            }

            if (price >= 100000) {
                return Math.round(price / 50) * 50;
            }

            if (price >= 10000) {
                return Math.round(price / 10) * 10;
            }

            if (price >= 1000) {
                return Math.round(price / 5) * 5;
            }

            if (price >= 100) {
                return Math.round(price / 1) * 1;
            }

            if (price >= 10) {
                return Math.round(price / 0.1) * 0.1;
            }

            return Math.round(price / 0.01) * 0.01;
        },
    }
})();

__MODULE__ = module;
