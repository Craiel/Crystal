define(function(require) {
    var save = require('save');
    var component = require('component');
    
    State.prototype = component.create();
    State.prototype.$super = parent;
    State.prototype.constructor = State;
    
    function State() {
        this.id = "State";
        
        this.title = "Crystal";
        this.version = 0.1;
        this.versionForceReset = 0.1;
        
        this.lastAutoSave = Date.now();
        
        this.lastPlayedVersion = 0;
        this.resetForced = false;
        
        this.fpsUpdateTime = Date.now();
        this.fpsSinceUpdate = 0;
        this.fps = 0;
        
        // Core game
        save.register(this, 'credits').asNumber();
    };
    
    return new State();
});

