define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var data = require("data");
    var runtime = require("runtime");
    var templateData = require("data/generated/templates");
    
    return {
        init: function() {
            log.debug("DEBUG MODE - Initializing");
            runtime.loadDynamic([data.cssRoot + "colors.css"], 0);
            runtime.loadDynamic([data.cssRoot + "generic.css"], 0);
            runtime.loadDynamic([data.cssRoot + "optionsPanel.css"], 0);
            runtime.loadDynamic([data.cssRoot + "panel.css"], 0);
            runtime.loadDynamic([data.cssRoot + "pluginBar.css"], 0);
            runtime.loadDynamic([data.cssRoot + "pluginTime.css"], 0);
            runtime.loadDynamic([data.cssRoot + "progressBar.css"], 0);
            runtime.loadDynamic([data.cssRoot + "screenLoading.css"], 0);
            runtime.loadDynamic([data.cssRoot + "screenStart.css"], 0);
            runtime.loadDynamic([data.cssRoot + "screenMain.css"], 0);
            runtime.loadDynamic([data.cssRoot + "ui.css"], 0);
            runtime.loadDynamic([data.cssRoot + "viewSynthesize.css"], 0);
        }
    };
    
});