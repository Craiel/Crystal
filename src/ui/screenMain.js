define(function(require) {
    var math = require("math");
    var element = require("ui/element");
    var panel = require("ui/panel");
    var controlPanel = require('ui/controlPanel');
    
    ScreenMain.prototype = element.create();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.testPanel = undefined;
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
            
            this.testPanel = panel.create("TestPanel");
            this.testPanel.templateName = "OptionPanel";
            this.testPanel.init(this);
            this.testPanel.setSize(math.point(400, 300));
            this.testPanel.setPosition(math.point(100, 50));
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