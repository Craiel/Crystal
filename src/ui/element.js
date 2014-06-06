define(function() {
	
	Element.prototype = Crystal.createComponent();
	Element.prototype.$super = parent;
	Element.prototype.constructor = Element;
	
	function Element(id) {		
	    this.id = id;
	    
	    this.parent = undefined;
	    this.classes = undefined;
	    
	    this.mainDiv = undefined;
	    
	    this.isVisible = true;
	    
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
	    	
	    	// If we have an id try to get our element target
	    	if(this.id) {
	    		this.mainDiv = $('#' + this.id);	    		
	    	}
	    	
	    	// Check if we have a valid element target, if not create it
	    	if(!this.mainDiv || this.mainDiv.length === 0) {
	    		this.mainDiv = $('<div id="' + this.id + '"></div>');
	    		if(this.classes) {
	    			this.mainDiv.addClass(this.classes);
	    		}
	    		
	    		// We are creating it so either append to body or a given parent
	    		if(this.parent === undefined) {
	    			$(document.body).append(this.mainDiv);
	    		} else {
	    			this.parent.append(this.mainDiv);
	    		}
	    	}
	    };
	    
	    this.update = function(currentTime) {    	
	        if(!this.isVisible) {
	            return false;
	        }
	
	        return this.baseUpdate(currentTime);
	    };
	    
	    // ---------------------------------------------------------------------------
	    // ui functions
	    // ---------------------------------------------------------------------------
	    this.hide = function() {
	    	this.isVisible = false;
	    	this.mainDiv.hide();
	    };
	    
	    this.show = function() {
	    	this.isVisible = true;
	    	this.mainDiv.show();
	    	this.invalidate();
	    };
	    
	    this.getMainElement = function() {
			return this.mainDiv;
		};
	};
	
	Crystal.UI.createElement = function(id) { return new Element(id); };
});