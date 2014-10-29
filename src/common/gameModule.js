declare("GameModule", function() {
	include("Save");
	include("Log");
	include("Component");
	include("SaveKeys");
    
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
        	        	
        	save.register(this, saveKeys.idnIsUnlocked).asBool();
        	save.register(this, saveKeys.idnIsActive).asBool();
        	
        	save.register(this, saveKeys.idnXp).asNumber(0);
        	save.register(this, saveKeys.idnLevel).asNumber(1);
        	save.register(this, saveKeys.idnMultiplier).asFloat(1.0);
        };
        
        this.update = function(currentTime) {
        	if(this.componentUpdate(currentTime) === false) {
        		return false;
        	}
        	
        	if(this[this.idnIsUnlocked] === false || this[saveKeys.idnIsActive] === false) {
        		return false;
        	}
        	
        	// Todo
        	
            return true;
        };
        
        this.remove = function() {
            this.componentRemove();
        };
    }
    
    return {
        create: function() { return new GameModule(); }
    };
});