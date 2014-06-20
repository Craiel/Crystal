define(function(require) {
    var settings = require("settings");
    var save = require("save");
    var utils = require("utils");
    var state = require("game/state");
    var log = require("log");
    var component = require("component");
    
    if(Crystal.isDebug) {
        var debug = require("debug");
    }
    
    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;
    
    function Game() {
        this.id = 'game';
        
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
            
            save.load();
            
            this.checkVersion();
            
            settings.addStat(settings.stats.gameLoadCount);
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }
            
            // process auto-saving
            this.updateAutoSave(currentTime);
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
        
        this.updateAutoSave = function(currentTime) {
            
            if(!settings.autoSaveEnabled) {
                return;
            }
            
            if(currentTime - state.lastAutoSave < settings.autoSaveInterval) {
                return;
            }
            
            state.lastAutoSave = currentTime;
            save.save();
            settings.addStat(settings.stats.autoSaveCount);
        };
    }
    
    return new Game();
    
});