define(function(require) {
    var save = require("save");
    var log = require("log");
    var component = require("component");
    
    GameModule.prototype = component.create();
    GameModule.prototype.$super = parent;
    GameModule.prototype.constructor = GameModule;
    
    function GameModule() {

    	// ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        this.componentRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
        	this.componentInit();
        	
        	save.register(this, 'isUnlocked').asBool();
        	
        	save.register(this, 'xp').asNumber(0);
        	save.register(this, 'level').asNumber(1);
        	save.register(this, 'multiplier').asFloat(1.0);
        };
        
        this.update = function(currentTime) {
        	if(!this.isUnlocked) {
        		return false;
        	}
        	
        	// Todo
    
            return this.componentUpdate(currentTime);
        };
        
        this.remove = function() {
            this.componentRemove();
        };
    }
    
    return {
        create: function() { return new GameModule(); }
    };
});