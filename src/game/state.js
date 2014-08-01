define(function(require) {
    var save = require('save');
    var gameTime = require('gameTime');
    var component = require('component');
    
    State.prototype = component.create();
    State.prototype.$super = parent;
    State.prototype.constructor = State;
    
    function State() {
        this.id = "State";
        
        this.gameTime = gameTime.create();
        
        this.title = "Crystal";
        this.version = 0.1;
        this.versionForceReset = 0.1;
        
        this.lastAutoSave = this.gameTime.getTime();
        
        this.lastPlayedVersion = 0;
        this.resetForced = false;
        
        this.fpsUpdateTime = this.gameTime.getTime();
        this.fpsSinceUpdate = 0;
        this.fps = 0;
        
        this.isPaused = false;
        
        // saved game states
        save.register(this, 'gameActive').asBool();
        
        save.register(this, 'eterniumCrystals').asNumber().persistent(); // Prestige crystals
        
        save.register(this, 'coreXP').asNumber();
        save.register(this, 'coreLevel').asNumber(); // core level of the session
        save.register(this, 'credits').asNumber(); // base currency for everything
        
        save.register(this, 'globalCoreXPMultiplier').asNumber();
        save.register(this, 'globalCreditMultiplier').asNumber();
    };
    
    return new State();
});

