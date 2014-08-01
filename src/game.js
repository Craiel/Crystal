define(function(require) {
    var settings = require("settings");
    var save = require("save");
    var utils = require("utils");
    var state = require("game/state");
    var log = require("log");
    var data = require("data");
    var component = require("component");
    var moduleSynthesize = require("game/modules/moduleSynthesize");
    
    if(Crystal.isDebug) {
        var debug = require("debug");
    }
    
    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;
    
    function Game() {
        this.id = 'game';
        
        this.moduleSynthesize = undefined;
        
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
            
            if(Crystal.isDebug) {
                debug.init();
            }
            
            // Modules need to be loaded before the state load
            this.loadModules();
            
            save.stateName = state.title;
            save.load();
            
            this.checkVersion();
            
            settings.addStat(settings.stats.gameLoadCount);
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }
            
            // Update the modules
            this.moduleSynthesize.update(currentTime);
            
            // process auto-saving
            this.updateAutoSave(currentTime);
            
            // Register the elapsed time
            if (this.lastGameUpdateTime !== undefined) {
            	settings.addStat(settings.stats.playTime, currentTime.getTime() - this.lastGameUpdateTime);            	
            }
            
            this.lastGameUpdateTime = currentTime.getTime();
        };
        
        // ---------------------------------------------------------------------------
        // game functions
        // ---------------------------------------------------------------------------
        this.checkVersion = function() {
            state.lastPlayedVersion = settings.savedVersion;
            
            // If the saved version is below the force threshold we reset automatically
            if(settings.savedVersion < state.versionForceReset) {
                log.warning("Saved version is too old (" + settings.savedVersion + "), forcing reset!");
                save.reset();
                state.resetForced = true;
            }
            
            settings.savedVersion = state.version;
        };
        
        this.loadModules = function() {
        	this.moduleSynthesize = moduleSynthesize.create();
        	this.moduleSynthesize.init();
        };
        
        this.updateAutoSave = function(currentTime) {
            
            if(!settings.autoSaveEnabled) {
                return;
            }
            
            if(currentTime.getTime() - state.lastAutoSave < settings.autoSaveInterval) {
                return;
            }
            
            state.lastAutoSave = currentTime.getTime();
            save.save();
            settings.addStat(settings.stats.autoSaveCount);
        };
    }
    
    return new Game();
    
});