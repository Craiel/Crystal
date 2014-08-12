define(function(require) {
	var log = require("log");
    var utils = require("utils");
    var settings = require("settings");
    var element = require("ui/controls/element");
    var pluginBar = require("ui/pluginBar");
    
    PluginTime.prototype = element.create();
    PluginTime.prototype.$super = parent;
    PluginTime.prototype.constructor = PluginTime;
    
    function PluginTime(id) {
        this.id = id;
        
        this.templateName = "PluginTime";
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            // Todo or remove...
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }

            // Update the time
            var host = this.getMainElement();
            var localTime = currentTime.getTime(true);
            var timeString = utils.getTimeDisplay(localTime, settings.use24hourTime);
            host.find('div').text(timeString);
        };
    };
    
    return {
        name: 'Time',
        description: StrLoc('Shows the current time'),
        
        create: function(id) { return new PluginTime(id); }
    };
    
});