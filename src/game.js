define(function(require) {
    var settings = require("settings");
    var save = require("save");
    var utils = require("utils");
    var state = require("game/state");
    var log = require("log");
    
    // Load up the basic game elements
    require('game/inventory');
    
    
    Game.prototype = Crystal.createComponent();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;
    
    function Game() {
        this.title = "#no name";
        this.version = 0.1;
        this.versionForceReset = 0.1;
        
        this.testInventory = Crystal.createInventory("Test");
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.baseInit = this.init;
        this.baseUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            this.baseInit();
            
            save.load();
            
            this.checkVersion();
            
            settings.addStat(settings.stats.gameLoadCount);
        };
        
        this.update = function(currentTime) {
            if(!this.baseUpdate(currentTime)) {
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
            if(settings.savedVersion < this.versionForceReset) {
                log.warning("Saved version is too old (" + settings.savedVersion + "), forcing reset!");
                save.reset();
                state.resetForced = true;
            }
            
            settings.savedVersion = this.version;
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