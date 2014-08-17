declare("GameModule", function() {
	include("Save");
	include("Log");
	include("Component");
    
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
        	
        	save.register(this, StrSha('isUnlocked')).asBool();
        	save.register(this, StrSha('isActive')).asBool();
        	
        	save.register(this, StrSha('xp')).asNumber(0);
        	save.register(this, StrSha('level')).asNumber(1);
        	save.register(this, StrSha('multiplier')).asFloat(1.0);
        };
        
        this.update = function(currentTime) {
        	if(this.componentUpdate(currentTime) === false) {
        		return false;
        	}
        	
        	if(this.isUnlocked === false || this.isActive === false) {
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