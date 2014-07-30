define(function(require) {
	var log = require("log");
    var element = require("ui/controls/element");
        
    ViewSynthesize.prototype = element.create();
    ViewSynthesize.prototype.$super = parent;
    ViewSynthesize.prototype.constructor = ViewSynthesize;
    
    function ViewSynthesize(id) {
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
            
            log.error("ViewSynthesize is stub");
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
        };
        
        // ---------------------------------------------------------------------------
        // statistics functions
        // ---------------------------------------------------------------------------
        this.getTitle = function() {
        	return "Synthesize";
        };
    };
    
    return {
        create: function(id) { return new ViewSynthesize(id); }
    };
    
});