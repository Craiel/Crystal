define(function(require) {
    var data = require("data");
    var element = require("ui/element");
    
    PluginBar.prototype = element.create();
    PluginBar.prototype.$super = parent;
    PluginBar.prototype.constructor = PluginBar;
    
    function PluginBar(id) {
        this.id = id;
        
        this.plugins = {};
        
        this.pluginAlignment = {
                left: 0,
                center: 1,
                right: 2,
        };
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            this.getMainElement().css('background-image', 'url(' + data.imageRoot + 'pluginBarBG.png)');
        };
        
        // ---------------------------------------------------------------------------
        // bar functions
        // ---------------------------------------------------------------------------
        this.addPlugin = function(id, content, arguments) {
            assert.isDefined(this.getMainElement(), "addPlugin must be called after init");
            assert.isDefined(content, "addPlugin called without content");
            // Build the plug-in and add it
        };
    };
    
    return {
        create: function(id) { return new PluginBar(id); }
    };
    
});