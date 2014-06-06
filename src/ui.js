define(function(require) {
	var log = require("log");
	var state = require("game/state");
	
	UI.prototype = Crystal.createComponent();
	UI.prototype.$super = parent;
	UI.prototype.constructor = UI;
	
	function UI() {
		
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
	    	
	    };
	    
	    this.update = function(currentTime) {
	    	if(this.baseUpdate(currentTime) === false) {
	    		return;
	    	}
	    	
	    	// Todo
	    	this.updateFPS();
	    };
	    
	    this.updateFPS = function () {
	    	state.fpsSinceUpdate++;
	    	if(currentTime > state.fpsUpdateTime + 1000) {
	    		state.fps = state.fpsSinceUpdate;
	    		state.fpsUpdateTime = currentTime;
	    		state.fpsSinceUpdate = 0;
	    	};
	    };
	}
	
	return new UI();
	
});