define(function(require) {
    var log = require("log");
    var state = require("game/state");
    var component = require("component");
    var screenMain = require('ui/screenMain');
    
    UI.prototype = component.create();
    UI.prototype.$super = parent;
    UI.prototype.constructor = UI;
        
    function UI() {
        this.id = 'ui';
        
        this.screenMain = undefined;
        
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
            
            this.screenMain = screenMain.create("MainScreen");
            this.screenMain.init(null);
            
            this.activeScreen = this.screenMain;
        };
        
        this.update = function(currentTime) {
            if(this.componentUpdate(currentTime) === false) {
                return;
            }
            
            this.updateFPS();
            
            // Update the active screen if present
            if(this.activeScreen) {
                this.activeScreen.update(currentTime);
            }
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