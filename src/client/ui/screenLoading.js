declare("ScreenLoading", function() {
	include("Log");
	include("Assert");
	include("Settings");
	include("Screen");
	include("Panel");
	include("Element");
	include('ProgressBar');
    
    ScreenLoading.prototype = screen.create();
    ScreenLoading.prototype.$super = parent;
    ScreenLoading.prototype.constructor = ScreenLoading;
    
    function ScreenLoadingAction(actionHost, action) {
    	this.actionHost = actionHost;
    	this.action = action;
    	this.text = undefined;
    	this.host = undefined;
    	
    	this.execute = function(host) 
    	{
    		this.host = host;
    		this.action(this);
    		this.hose = undefined;
    	};
    	
    	this.setSubProgressText = function(text) {
    		this.host.setSubProgressText(text);
    	};
    }
    
    function ScreenLoading(id) {
        this.id = id;
        
        this.templateName = "screenLoading";
        
        this.progressBar = undefined;
        this.progressText = undefined;
        
        this.currentOperation = -1;
        this.currentOperations = undefined;
        this.timeSinceProgressUpdate = undefined;
        
        this.pendingOperations = [];
        this.isFinished = true;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.screenInit = this.init;
        this.screenUpdate = this.update;
        this.screenShow = this.show;
        this.screenHide = this.hide;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.screenInit(parent);
            
            this.progressBar = progressBar.create(this.id + "Progress");
            this.progressBar.init(this);
            
            this.progressText = element.create(this.id + "ProgressText");
            this.progressText.init(this);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
            
            // Check if we are initiating a new set of loading operations
            if(this.currentOperations === undefined) {
            	if(this.pendingOperations.length > 0) {
            		this.currentOperation = -1;
            		this.currentOperations = this.pendingOperations;
            		this.pendingOperations = [];
            		this.isFinished = false;
            	} else {
            		return;
            	}
            }
            
            // check if we are currently done to avoid more computing
            if(this.isFinished === true) {
            	return;
            }
            
            // Check if we are in time to perform the next loading operations
            if(this.timeSinceProgressUpdate === undefined || currentTime.getTime() - this.timeSinceProgressUpdate > 500) {
            	this.currentOperation++;
            	if(this.currentOperation >= this.currentOperations.length) {
            		this.currentOperations = undefined;
            		this.isFinished = true;
            		return;
            	}
            	
            	var operation = this.currentOperations[this.currentOperation];
            	
            	this.progressBar.setProgress(this.currentOperation + 1, this.currentOperations.length);
            	this.progressText.setText(operation.text);
            	
            	this.timeSinceProgressUpdate = currentTime.getTime();
            	
            	operation.execute(this);
            }
        };
        
        this.show = function() {
        	this.screenShow();
        };
        
        this.hide = function() {
        	this.screenHide();
        	
        };
        
     	// ---------------------------------------------------------------------------
        // screen functions
        // ---------------------------------------------------------------------------
        this.queueAction = function(action) {
        	assert.isDefined(action.execute);
        	this.pendingOperations.push(action);
        	this.isFinished = false;
        };
        
        this.setSubProgressText = function(text) {
    		this.progressText.setText(text);
    	};
    };
    
    return {
        create: function(id) { return new ScreenLoading(id); },
    	createAction: function(actionHost, action) { return new ScreenLoadingAction(actionHost, action); }
    };
    
});