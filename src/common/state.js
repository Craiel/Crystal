declare("GameState", function() {
	include('Save');
	include('GameTime');
	include('Component');
	include('SaveKeys');
    
    State.prototype = component.create();
    State.prototype.$super = parent;
    State.prototype.constructor = State;
    
    function State() {
        this.id = "State";
        
        this.gameTime = gameTime.create();
        
        this.title = StrLoc("Crystal");
        this.version = 0.3;
        this.versionForceReset = 0.3;
        this.versionRecommendReset = 0.3;
        
        this.lastAutoSave = this.gameTime.getTime();
        
        this.resetForced = false;
        this.resetRecommended = false;
        
        this.fpsUpdateTime = this.gameTime.getTime();
        this.fpsSinceUpdate = 0;
        this.fps = 0;
        
        this.isPaused = false;
                
        save.register(this, saveKeys.idnGameActive).asBool();
        
        save.register(this, saveKeys.idnEterniumCrystals).asNumber().persistent(); // Prestige crystals
        
        save.register(this, saveKeys.idnCoreXP).asNumber();
        save.register(this, saveKeys.idnCoreLevel).asNumber(); // core level of the session
        save.register(this, saveKeys.idnCredits).asNumber(); // base currency for everything
        
        save.register(this, saveKeys.idnGlobalCoreXPMultiplier).asNumber();
        save.register(this, saveKeys.idnGlobalCreditMultiplier).asNumber();
    };
    
    return new State();
});