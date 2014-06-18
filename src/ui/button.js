define(function(require) {
    var log = require("log");
    var assert = require("assert");
    var element = require("ui/element");
    
    Button.prototype = element.create();
    Button.prototype.$super = parent;
    Button.prototype.constructor = Button;
    
    function Button(id) {
        this.id = id;
        
        this.onClick = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            assert.isDefined(this.onClick, "No click event defined for button");
            
            this.getMainElement().click(this.onClick);
        };
    };
    
    return {
        create: function(id) { return new Button(id); }
    };
    
});