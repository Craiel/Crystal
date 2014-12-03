declare("PluginMenu", function() {
	include("Log");
	include("Settings");
	include("Element");
	include("PluginBar");
    
    PluginMenu.prototype = element.create();
    PluginMenu.prototype.$super = parent;
    PluginMenu.prototype.constructor = PluginMenu;
    
    function PluginMenu(id) {
        this.id = id;
        
        this.templateName = "pluginMenu";
        
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

            // Update the menu status
            //  Todo
        };
    };
    
    return {
        name: 'Menu',
        description: StrLoc('Menu'),
        
        create: function(id) { return new PluginMenu(id); }
    };
    
});
