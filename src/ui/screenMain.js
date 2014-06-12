define(function(require) {
    
    // Load up required controls
    require('ui/controlPanel');
    
    ScreenMain.prototype = Crystal.UI.createUIElement();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.controlPanel = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            this.controlPanel = Crystal.UI.createControlPanel("MainControlPanel");
            this.controlPanel.init(this);
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            // Update the controls
            this.controlPanel.update(currentTime);
        };
    };
    
    Crystal.UI.createScreenMain = function(id) { return new ScreenMain(id); };
    
});