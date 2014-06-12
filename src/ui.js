define(function(require) {
    var log = require("log");
    var state = require("game/state");
    
    // Load up the basic ui elements
    require("ui/uielement");
    require('ui/screenMain');
    
    UI.prototype = Crystal.createComponent();
    UI.prototype.$super = parent;
    UI.prototype.constructor = UI;
        
    function UI() {
        
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
            
            this.screenMain = Crystal.UI.createScreenMain("MainScreen");
            this.screenMain.init();
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