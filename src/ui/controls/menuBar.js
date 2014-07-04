define(function(require) {
    var log = require("log");
    var assert = require("assert");
    var data = require("data");
    var button = require("ui/controls/button");
    var element = require("ui/controls/element");
    
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