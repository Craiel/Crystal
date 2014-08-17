declare("Game", function() {
	include("Assert");
	include("Settings");
	include("Save");
	include("Data");
	include("Utils");
	include("GameState");
	include("Log");
	include("Component");
	include("GameModuleSynthesize");
        
    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;
    
    function Game() {
        this.id = 'game';
        
        this.gameModules = {};
        
        this.lastGameUpdateTime = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            this.componentInit();
                        
            // Modules need to be loaded before the state load
            this.loadModules();
            
            save.stateName = gameState.title;
            save.load();
            
            this.checkVersion();
            
            settings.addStat(data.EnumStatGameLoadCount);
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }
            
            // Update the modules
            for(var moduleType in this.gameModules) {
            	var module = this.gameModules[moduleType];
            	module.update(currentTime);
            }
            
            // process auto-saving
            this.updateAutoSave(currentTime);
            
            // Register the elapsed time
            if (this.lastGameUpdateTime !== undefined) {
            	settings.addStat(data.EnumStatPlayTime, currentTime.getTime() - this.lastGameUpdateTime);            	
            }
            
            this.lastGameUpdateTime = currentTime.getTime();
        };
        
        // ---------------------------------------------------------------------------
        // game functions
        // ---------------------------------------------------------------------------
        this.checkVersion = function() {            
            // If the saved version is below the force threshold we reset automatically
            var updateSaveVersion = false;
            if(settings.savedVersion < gameState.versionForceReset) {
                log.warning(StrLoc("Saved version is too old ({0}), forcing reset to {1}!").format(settings.savedVersion, gameState.version));
                save.reset();
                
                // Reset the state to default before the load
                this.resetToDefaultState();
                
                gameState.resetForced = true;
                updateSaveVersion = true;
            } else if (settings.savedVersion < gameState.versionRecommendReset) {
            	log.warning(StrLoc("Saved version is out of date ({0}), recommending reset to {1}!").format(settings.savedVersion, gameState.version));
            	gameState.resetRecommended = true;
            } else {
            	updateSaveVersion = true;
            }
            
            if(updateSaveVersion === true) {
            	settings.savedVersion = gameState.version;            	
            }
        };
        
        this.resetToDefaultState = function() {
        	// Lock and deactivate all modules
        	for(var key in data.modules) {
        		this.lockModule(key);
        	}
        	
        	// Unlock default modules
        	this.unlockModule(data.EnumModuleSynthesize);
        	
        	// Activate synthesize by default
        	this.activateModule(data.EnumModuleSynthesize);
        };
        
        this.loadModules = function() {
        	
        	// Initialize all the modules and register them, this is a bit manual right now...
        	var module = gameModuleSynthesize.create();
        	module.init();
        	this.gameModules[data.EnumModuleSynthesize] = module;
        };
        
        this.updateAutoSave = function(currentTime) {
            
            if(!settings.autoSaveEnabled) {
                return;
            }
            
            if(currentTime.getTime() - gameState.lastAutoSave < settings.autoSaveInterval) {
                return;
            }
            
            gameState.lastAutoSave = currentTime.getTime();
            save.save();
            settings.addStat(data.EnumAutoSaveCount);
        };
        
        this.getActiveModuleType = function() {
        	return settings.activeModule;
        };
        
        this.getModule = function(moduleType) {
        	if(this.gameModules[moduleType] === undefined) {
        		log.warning(StrLoc("Module not loaded: {0}").format(moduleType));
        		return;
        	}
        	
        	return this.gameModules[moduleType];
        };
        
        this.lockModule = function(moduleType) {
        	if(this.gameModules[moduleType] === undefined) {
        		log.warning(StrLoc("Module not loaded: {0}").format(moduleType));
        		return;
        	}
        	
        	var module = this.gameModules[moduleType];
        	module.isUnlocked = true;
        };
        
        this.unlockModule = function(moduleType) {
        	if(this.gameModules[moduleType] === undefined) {
        		log.warning(StrLoc("Module not loaded: {0}").format(moduleType));
        		return;
        	}
        	
        	var module = this.gameModules[moduleType];
        	module.isUnlocked = true;
        };
        
        this.activateModule = function(moduleType) {
        	if(this.gameModules[moduleType] === undefined) {
        		log.warning(StrLoc("Module not loaded: {0}").format(moduleType));
        		return;
        	}
        	        	
        	var module = this.gameModules[moduleType];
        	module.isActive = true;
        	
        	settings.activeModule = moduleType;
        };
        
        this.deactivateModule = function() {
        	if(settings.activeModule === data.EnumModuleSynthesize) {
        		log.warning(StrLoc("Can not deactivate Synthesize module!"));
        		return;
        	}
        	
        	var module = this.gameModules[settings.activeModule];
        	module.isActive = false;
        	
        	// Deactivating any module will default to synthesize since it's always enabled
        	this.activateModule(data.EnumModuleSynthesize);
        };
    }
    
    return new Game();
    
});