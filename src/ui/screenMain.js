define(function(require) {
    var math = require("math");
    var element = require("ui/element");
    var panel = require("ui/panel");
    var pluginBar = require('ui/pluginBar');
    var controlPanel = require('ui/controlPanel');
    var statisticsView = require("ui/statisticsView");
    
    ScreenMain.prototype = element.create();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.testPanel = undefined;
        
        this.pluginBar = undefined;
        
        this.controlPanelFrame = undefined;
        this.controlPanel = undefined;
        
        this.statisticsView = undefined;
        
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
            
            this.pluginBar = pluginBar.create("PluginBar");
            this.pluginBar.init(this);
            
            this.controlPanelFrame = element.create("ControlPanelFrame");
            this.controlPanelFrame.init(this);
            
            this.controlPanel = controlPanel.create("ControlPanel");
            this.controlPanel.init(this.controlPanelFrame);
            
            this.statisticsView = statisticsView.create('StatisticsView');
            this.statisticsView.init();
            
            this.testPanel = panel.create("TestPanel");
            this.testPanel.templateName = "OptionPanel";
            this.testPanel.init(this);
            this.testPanel.setSize(math.point(400, 300));
            this.testPanel.setPosition(math.point(100, 50));
            this.testPanel.setTitle("Test Panel");
            this.testPanel.setContent(this.statisticsView);
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            // Update the controls
            this.controlPanel.update(currentTime);
            
            this.statisticsView.update(currentTime);
        };
    };
    
    return {
        create: function(id) { return new ScreenMain(id); }
    };
    
});