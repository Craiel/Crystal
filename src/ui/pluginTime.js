define(function(require) {
    var utils = require("utils");
    var element = require("ui/element");
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
            host.find('div').text(utils.getShortTimeDisplay(currentTime));
        };
    };
    
    return {
        name: 'Time',
        description: 'Shows the current time',
        
        create: function(id) { return new PluginTime(id); }
    };
    
});