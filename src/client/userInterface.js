declare("UserInterface", function() {
	include("$");
	include("Log");
	include("Save");
	include("Assert");
	include("Element");
	include("GameState");
	include("Component");
	include('ScreenStart');
	include('ScreenMain');
	include('ScreenLoading');
    
	UserInterface.prototype = component.create();
	UserInterface.prototype.$super = parent;
	UserInterface.prototype.constructor = UserInterface;
    
    function UserInterface() {
        this.id = 'ui';
        
        this.inTransition = false;
        this.transitionTime = undefined;
        this.transitionFrom = undefined;
        this.transitionTo = undefined;
        
        this.screenMain = undefined;
        this.screenStart = undefined;
        this.screenLoading = undefined;
        
        this.activeScreen = undefined;
        this.loadTarget = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            this.componentInit();
            
            this.screenStart = screenStart.create("ScreenStart");
            this.screenStart.init();
            
            this.screenMain = screenMain.create("ScreenMain");
            this.screenMain.init();
            
            this.screenLoading = screenLoading.create("ScreenLoading");
            this.screenLoading.init();
            
            // Load the starting screen
            //this.loadAndActivate(this.screenStart);
            this.loadAndActivate(this.screenMain);
            
            // To make sure settings are saved when reloading / navigating away
            $(window).on('beforeunload', function(){ save.save(); });
        };
        
        this.update = function(currentTime) {
            if(this.componentUpdate(currentTime) === false) {
                return;
            }
            
            this.updateFPS(currentTime);
            
            // Check if we are in transition
            if(this.inTransition === true) {
                this.updateTransition(currentTime);
                return;
            }
            
            // Check if we where loading and switch over to the target
            if(this.loadTarget !== undefined && this.activeScreen === this.screenLoading && this.screenLoading.isFinished === true) 
            {
            	this.activateScreen(this.loadTarget);
            	this.loadTarget = undefined;
            }
            
            // Update the active screen if present
            if(this.activeScreen) {
                this.activeScreen.update(currentTime);
            }
        };
        
        // ---------------------------------------------------------------------------
        // ui functions
        // ---------------------------------------------------------------------------
        this.updateFPS = function (currentTime) {
            gameState.fpsSinceUpdate++;
            if(currentTime.getTime() > gameState.fpsUpdateTime + 1000) {
            	gameState.fps = gameState.fpsSinceUpdate;
            	gameState.fpsUpdateTime = currentTime.getTime();
            	gameState.fpsSinceUpdate = 0;
            };
        };
        
        this.updateTransition = function(currentTime) {
            if(currentTime.getTime() < this.transitionTime) {
                // We are still waiting for the transition to complete, bail out
                return;
            }
            
            if(this.transitionFrom !== undefined) {
                // We transitioned away from the previous one, initiate transition to target
                log.debug(StrLoc("Transition proceeding to {0}").format(this.transitionTo.id));
                this.transitionFrom.getMainElement().remove();
                this.transitionFrom = undefined;
                this.transitionTime = this.updateTime + this.transitionTo.transitionTimeTo;
                $("body").append(this.transitionTo.getMainElement());
                this.transitionTo.show();
                this.activeScreen = this.transitionTo;
            } else {
                log.debug(StrLoc("Transition completed"));
                this.transitionTo = undefined;
                this.inTransition = false;
            }
        };
        
        this.activateScreen = function(screen) {
            assert.isDefined(screen);
            
            if(this.inTransition === true) 
            {
                assert.isDefined(this.transitionTo, StrLoc("Already in transition to next screen, can not activate screen"));
                
                // We are still in transition from the old screen so just swap the target
                this.transitionTo = screen;
                return;
            }
            
            log.info(StrLoc("Transitioning to screen {0}").format(screen.id));
            this.inTransition = true;
            this.transitionFrom = this.activeScreen;
            this.transitionTo = screen;
            
            if(this.transitionFrom !== undefined) {
                this.transitionFrom.hide();
                this.transitionTime = this.updateTime + this.transitionFrom.transitionTimeFrom;
            } else {
                $("body").append(this.transitionTo.getMainElement());
                this.transitionTime = this.updateTime + this.transitionTo.transitionTimeTo;
                this.transitionTo.show();
                this.activeScreen = this.transitionTo;
            }
        };
        
        this.loadAndActivate = function(screen) {
        	assert.isFalse(this.activeScreen === screen, StrLoc("Screen is already active: {0}").format(screen.id));
        	assert.isFalse(screen === this.screenLoading, StrLoc("Can not load and activate loading screen {0}").format(screen.id));

        	var actionData = screen.getLoadingActions();
        	for(var key in actionData) {
        		var action = screenLoading.createAction(screen, actionData[key]);
            	action.text = key;
            	this.screenLoading.queueAction(action);	
        	}
        	
        	this.loadTarget = screen;
        	this.activateScreen(this.screenLoading);
        };
    }
    
    return new UserInterface();
    
});