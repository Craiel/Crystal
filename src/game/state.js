define(function() {
	
	State.prototype = Crystal.createComponent();
	State.prototype.$super = parent;
	State.prototype.constructor = State;
	
	function State() {
		
		this.lastAutoSave = Date.now();
		
		this.lastPlayedVersion = 0;
		this.resetForced = false;
		
		this.fpsUpdateTime = Date.now();
		this.fpsSinceUpdate = 0;
		this.fps = 0;
		
	};
	
	return new State();
});

