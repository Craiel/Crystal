define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var data = require("data");
    var runtime = require("runtime");
    var templateData = require("data/generated/templates");
    
    return {
        init: function() {
            log.debug("DEBUG MODE - Initializing");
            runtime.loadDynamic([data.cssRoot + "controlPanel.css"], 0);
            runtime.loadDynamic([data.cssRoot + "generic.css"], 0);
            runtime.loadDynamic([data.cssRoot + "panel.css"], 0);
            runtime.loadDynamic([data.cssRoot + "pluginBar.css"], 0);
            runtime.loadDynamic([data.cssRoot + "ui.css"], 0);
            
            // This only works running from http:\\
            /*var templates = ["MainControlPanel", "MainScreen", 
                             "OptionPanel", "StatisticsView", 
                             "StatisticsViewEntry"];
            // Load the templates for debug
            for(var i = 0; i < templates.length; i++) {
                var key = templates[i];
                var content = $.get(data.root+"templates\\" + key + ".html");
                templateData[key] = content;
            }*/
        }
    };
    
});