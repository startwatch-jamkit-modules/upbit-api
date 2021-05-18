var module = (function() {
    const crypto  = require("crypto"),
          jwt     = require("jwt");

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
        get: function(url, params, credential) {
            var query = _to_query_string(params || {});
            var headers = {
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            return fetch(url + "?" + query, {
                headers: headers
            })
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

        post: function(url, params, credential) {
            var query = _to_query_string(params || {});
            var headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            return fetch(url, {
                method: "POST",
                body: query,
                headers: headers
            })
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

        delete: function(url, params, credential) {
            var query = _to_query_string(params || {});
            var headers = {
                "Accept": "application/json"
            }

            if (credential) {
                headers["Authorization"] = "Bearer " + _sign_query(credential, query);
            }

            console.log(query)
            console.log(JSON.stringify(headers))

            return fetch(url + "?" + query, {
                method: "DELETE",
                headers: headers
            })
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
