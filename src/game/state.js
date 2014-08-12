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
        
        this.title = StrLoc("Crystal");
        this.version = 0.2;
        this.versionForceReset = 0.2;
        this.versionRecommendReset = 0.2;
        
        this.lastAutoSave = this.gameTime.getTime();
        
        this.resetForced = false;
        this.resetRecommended = false;
        
        this.fpsUpdateTime = this.gameTime.getTime();
        this.fpsSinceUpdate = 0;
        this.fps = 0;
        
        this.isPaused = false;
        
        // saved game states
        save.register(this, StrSha('gameActive')).asBool();
        
        save.register(this, StrSha('eterniumCrystals')).asNumber().persistent(); // Prestige crystals
        
        save.register(this, StrSha('coreXP')).asNumber();
        save.register(this, StrSha('coreLevel')).asNumber(); // core level of the session
        save.register(this, StrSha('credits')).asNumber(); // base currency for everything
        
        save.register(this, StrSha('globalCoreXPMultiplier')).asNumber();
        save.register(this, StrSha('globalCreditMultiplier')).asNumber();
    };
    
    return new State();
});