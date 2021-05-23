var module = (function() {
    const quotation = include("./quotation.js"),
          exchange  = include("./exchange.js");

    return Object.assign({
        initialize: function(config) {
            var proxy = (config || {})["proxy"];

            if (proxy) {
                exchange.set_proxy(proxy);
            }

            return this;
        }
    }, quotation, exchange);
})();

__MODULE__ = module;
