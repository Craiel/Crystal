define(function(require) {
    var log = require("log");
    var save = require("save");
    var gameModule = require("game/gameModule");
    
    ModuleSynthesize.prototype = gameModule.create();
    ModuleSynthesize.prototype.$super = parent;
    ModuleSynthesize.prototype.constructor = ModuleSynthesize;
    
    function ModuleSynthesize() {
    	this.id = "ModuleSynthesize";

    	save.register(this, 'baseValue').asNumber(1);
    	
    	save.register(this, 'upgradesBought').asJsonArray().withCallback(false, true, true);
    	save.register(this, 'techResearched').asJsonArray().withCallback(false, true, true);
    	
    	// ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.moduleInit = this.init;
        this.moduleUpdate = this.update;
        this.moduleRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
        	this.moduleInit();
        	
        	log.debug(" ModuleSynthesize: " + this.id);
        	// Todo
        };
        
        this.update = function(currentTime) {
        	if(this.moduleUpdate(currentTime) === false) {
        		return false;
        	}
        	
        	// Todo
        };
        
        this.remove = function() {
            this.moduleRemove();
        };
    }
    
    return {
        create: function() { return new ModuleSynthesize(); }
    };
});