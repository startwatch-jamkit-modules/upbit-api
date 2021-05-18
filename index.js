var module = (function() {
    const quotation = include("./quotation.js"),
          exchange  = include("./exchange.js");

    return Object.assign({}, quotation, exchange);
})();

__MODULE__ = module;
