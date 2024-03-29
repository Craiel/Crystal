declare("PluginBar", function() {
	include("Assert");
	include("Element");
    
    PluginBar.prototype = element.create();
    PluginBar.prototype.$super = parent;
    PluginBar.prototype.constructor = PluginBar;
    
    function PluginBar(id) {
        this.id = id;

        this.setTemplate("pluginBar");
        
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
            
            // Re-include Static if this needs to come back:
            //  this.getMainElement().css('background-image', 'url(' + static.imageRoot + 'pluginBarBG.png)');
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
        this.addPlugin = function(pluginDefinition, parameters) {
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
