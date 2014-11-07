declare("ViewInventory", function() {
	include("$");
	include("Log");
	include("Element");
	include("Settings");
    
    ViewInventory.prototype = element.create();
    ViewInventory.prototype.$super = parent;
    ViewInventory.prototype.constructor = ViewInventory;
    
    function ViewInventory(id) {
        this.id = id;
        
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

            // Todo
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            // Todo
        };
        
        // ---------------------------------------------------------------------------
        // statistics functions
        // ---------------------------------------------------------------------------
        this.getTitle = function() {
            return StrLoc("Inventory");
        };
    };
    
    return {
        create: function(id) { return new ViewInventory(id); }
    };
    
});
