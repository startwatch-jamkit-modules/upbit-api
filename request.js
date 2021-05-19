var module = (function() {
    const crypto  = require("crypto"),
          jwt     = require("jwt");

    function _send_request(url, options, proxy) {
        if (proxy) {
            return fetch(proxy, {
                method: "POST",
                body: JSON.stringify(Object.assign({
                    url: url
                }, options || {})),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        return fetch(url, options);
    }

    function _to_query_string(params) {
        return Object.keys(params).map(function(k) {
            return k + "=" + params[k];
        }).join('&');
    }

    function _sign_query(credential, query) {
        var payload = {
            "access_key": credential["access_key"],
            "nonce": _uuidv4()
        }

        if (query) {
            Object.assign(payload, {
                "query_hash": crypto.hex_from_bits(crypto.sha512.digest(query)),
                "query_hash_alg": "SHA512"
            });
        }

        return jwt.sign(payload, credential["secret_key"]);
    }

    function _uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return {
        get: function(url, params, credential, proxy) {
            var query = _to_query_string(params || {});
            var headers = {
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            return _send_request(url + "?" + query, {
                method: "GET",
                headers: headers
            }, proxy)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject({ 
                            status: response.status,
                            message: response.statusText
                        });
                    }
                });
        },

        post: function(url, params, credential, proxy) {
            var query = _to_query_string(params || {});
            var headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            return _send_request(url, {
                method: "POST",
                body: query,
                headers: headers
            }, proxy)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject({ 
                            status: response.status,
                            message: response.statusText
                        });
                    }
                });
        },

        delete: function(url, params, credential, proxy) {
            var query = _to_query_string(params || {});
            var headers = {
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            return _send_request(url + "?" + query, {
                method: "DELETE",
                headers: headers
            }, proxy)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject({ 
                            status: response.status,
                            message: response.statusText
                        });
                    }
                });
        },
    }
})();

__MODULE__ = module;
