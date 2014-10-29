declare("MenuBar", function() {
	include("Log");
	include("Assert");
	include("Static");
	include("Button");
	include("Element");
    
    MenuBar.prototype = element.create();
    MenuBar.prototype.$super = parent;
    MenuBar.prototype.constructor = MenuBar;
    
    function MenuBar(id) {
        this.id = id;
                
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);
            
            //assert.isDefined(this.onClick, "No click event defined for button");
            
            // Build the menu
        };
        
        // ---------------------------------------------------------------------------
        // button functions
        // ---------------------------------------------------------------------------
    };
    
    return {
        create: function(id) { return new MenuBar(id); }
    };
    
});
