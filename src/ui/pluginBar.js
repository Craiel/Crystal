define(function(require) {
    var data = require("data");
    var assert = require("assert");
    var element = require("ui/controls/element");
    
    PluginBar.prototype = element.create();
    PluginBar.prototype.$super = parent;
    PluginBar.prototype.constructor = PluginBar;
    
    function PluginBar(id) {
        this.id = id;
        
        this.plugins = {};
        
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
            
            //this.getMainElement().css('background-image', 'url(' + data.imageRoot + 'pluginBarBG.png)');
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            // Update the plug-ins
            for(var definition in this.plugins) {
                var plugin = this.plugins[definition];
                
                plugin.update(currentTime);
            }
        };
        
        // ---------------------------------------------------------------------------
        // bar functions
        // ---------------------------------------------------------------------------
        this.addPlugin = function(pluginDefinition, arguments) {
            assert.isDefined(this.getMainElement(), StrLoc("addPlugin must be called after init"));
            assert.isDefined(pluginDefinition, StrLoc("addPlugin called without content"));
            
            var plugin = pluginDefinition.create(this.id + pluginDefinition.name);
            plugin.init(this);
            
            this.plugins[pluginDefinition] = plugin;
        };
    };
    
    return {
        create: function(id) { return new PluginBar(id); }
    };
    
});