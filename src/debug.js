define(function(require) {
    var log = require("log");
    var data = require("data");
    var runtime = require("runtime");
    
    return {
        init: function() {
            log.debug("DEBUG MODE - Initializing");
            runtime.loadDynamic([data.cssRoot + "generic.css"], 0);
        }
    };
    
});