define(function(require) {
    var log = require("log");
    var assert = require("assert");
    var state = require("game/state");
    var component = require("component");
    var screenMain = require('ui/screenMain');
    var screenLoading = require('ui/screenLoading');
    
    UI.prototype = component.create();
    UI.prototype.$super = parent;
    UI.prototype.constructor = UI;
    
    function UI() {
        this.id = 'ui';
        
        this.inTransition = false;
        this.transitionTime = undefined;
        this.transitionFrom = undefined;
        this.transitionTo = undefined;
        
        this.screenMain = undefined;
        this.screenLoading = undefined;
        
        this.activeScreen = undefined;
        
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
            
            this.screenMain = screenMain.create("ScreenMain");
            this.screenMain.init(undefined);
            
            this.screenLoading = screenLoading.create("ScreenLoading");
            this.screenLoading.init(undefined);
            
            this.activateScreen(this.screenLoading);
        };
        
        this.update = function(currentTime) {
            if(this.componentUpdate(currentTime) === false) {
                return;
            }
            
            this.updateFPS();
            
            // Check if we are in transition
            if(this.inTransition === true) {
                this.updateTransition();
                return;
            }
            
            // Update the active screen if present
            if(this.activeScreen) {
                this.activeScreen.update(currentTime);
            }
        };
        
        // ---------------------------------------------------------------------------
        // ui functions
        // ---------------------------------------------------------------------------
        this.updateFPS = function () {
            state.fpsSinceUpdate++;
            if(currentTime > state.fpsUpdateTime + 1000) {
                state.fps = state.fpsSinceUpdate;
                state.fpsUpdateTime = currentTime;
                state.fpsSinceUpdate = 0;
            };
        };
        
        this.updateTransition = function() {
            if(currentTime < this.transitionTime) {
                // We are still waiting for the transition to complete, bail out
                return;
            }
            
            if(this.transitionFrom !== undefined) {
                // We transitioned away from the previous one, initiate transition to target
                log.debug("Transition proceeding to "+this.transitionTo.id);
                this.transitionFrom.getMainElement().remove();
                this.transitionFrom = undefined;
                this.transitionTime = this.updateTime + this.transitionTo.transitionTimeTo;
                $("body").append(this.transitionTo.getMainElement());
                this.transitionTo.show();
                this.activeScreen = this.transitionTo;
            } else {
                log.debug("Transition completed");
                this.transitionTo = undefined;
                this.inTransition = false;
            }
        };
        
        this.activateScreen = function(screen) {
            assert.isDefined(screen);
            
            if(this.inTransition === true) 
            {
                assert.isDefined(this.transitionTo, "Already in transition to next screen, can not activate screen");
                
                // We are still in transition from the old screen so just swap the target
                this.transitionTo = screen;
                return;
            }
            
            log.info("Transitioning to screen "+screen.id);
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
    }
    
    return new UI();
    
});