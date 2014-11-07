declare("GameState", function() {
	include('GameTime');
	include('Component');
    
    State.prototype = component.create();
    State.prototype.$super = parent;
    State.prototype.constructor = State;
    
    function State() {
        this.id = "State";
        
        this.gameTime = gameTime.create();
        
        this.title = StrLoc("Crystal Server");
        this.version = 0.1;
        
        this.fpsUpdateTime = this.gameTime.getTime();
        this.fpsSinceUpdate = 0;
        this.fps = 0;
    };
    
    return new State();
});
