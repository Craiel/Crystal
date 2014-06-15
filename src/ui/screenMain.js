define(function(require) {
    var element = require("ui/element");
    var controlPanel = require('ui/controlPanel');
    
    ScreenMain.prototype = element.create();
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
            
            this.controlPanel = controlPanel.create("MainControlPanel");
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
    
    return {
        create: function(id) { return new ScreenMain(id); }
    };
    
});