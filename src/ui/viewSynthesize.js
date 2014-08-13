define(function(require) {
	var log = require("log");
	var game = require("game");
	var data = require("data");
    var element = require("ui/controls/element");
        
    ViewSynthesize.prototype = element.create();
    ViewSynthesize.prototype.$super = parent;
    ViewSynthesize.prototype.constructor = ViewSynthesize;
    
    function ViewSynthesize(id) {
        this.id = id;
        
        this.module = undefined;
        this.hitTarget = undefined;
        this.animationArea = undefined;
        
        this.gainAnimationSpawnQueue = {};
        this.gainAnimationSpawnInterval = 300;
        this.gainAnimationSpawnTime = undefined;
        
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
            
            this.module = game.getModule(data.EnumModuleSynthesize);
            
            this.hitTarget = element.create(this.id + "HitTarget");
            this.hitTarget.init(this);
            this.hitTarget.getMainElement().on("click", { self: this}, this.onHit);
            
            this.animationArea = element.create(this.id + "HitAnimationArea");
            this.animationArea.init(this);
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            if(this.module === undefined || this.module.isActive === false || this.module.isUnlocked === false) {
            	return;
            }
            
            // Process the results
            this.processSynthesizeResults();
            
            // See if we can spawn a new set of gain animations
            if(this.gainAnimationSpawnTime === undefined || this.gainAnimationSpawnTime + this.gainAnimationSpawnInterval < currentTime.getTime()) {
            	this.spawnGainAnimations();
            	this.gainAnimationSpawnTime = currentTime.getTime();
            }
        };
        
        // ---------------------------------------------------------------------------
        // view functions
        // ---------------------------------------------------------------------------
        this.getTitle = function() {
        	return StrLoc("Synthesize");
        };
        
        this.onHit = function(parameter) {
        	var self = parameter.data.self;
        	if(self.module === undefined) {
        		log.warning("Module was not loaded!");
        		return;
        	}
        	
        	self.module.manualSynthesize();
        };
        
        this.processSynthesizeResults = function() {
        	var results = this.module.getCurrentSynthesizeResults();
        	
        	if(results === undefined || results.length <= 0) {
        		return;
        	}
        	
        	for(var i = 0; i < results.length; i++) {
        		if(this.gainAnimationSpawnQueue[results[i].gainType] === undefined) {
        			this.gainAnimationSpawnQueue[results[i].gainType] = 0;
        		}
        		
        		this.gainAnimationSpawnQueue[results[i].gainType] += results[i].value;
        	}
        };
        
        this.spawnGainAnimations = function() {
        	// Todo:
        	this.gainAnimationSpawnQueue = {};
        };
    };
    
    return {
        create: function(id) { return new ViewSynthesize(id); }
    };
    
});