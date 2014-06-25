define(function(require) {
    var math = require("math");
    var settings = require("settings");
    var element = require("ui/element");
    var panel = require("ui/panel");
    var pluginBar = require('ui/pluginBar');
    var progressBar = require('ui/progressBar');
    var controlPanel = require('ui/controlPanel');
    var statisticsView = require("ui/statisticsView");
    
    ScreenMain.prototype = element.create();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.testPanel = undefined;
        
        this.pluginBar = undefined;
        
        this.optionsContent = undefined;
        this.controlPanel = undefined;
        
        this.statisticsFrame = undefined;
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
            
            this.optionsContent = element.create("OptionsContent");
            this.optionsContent.init();
            
            this.controlPanel = controlPanel.create("ControlPanel");
            this.controlPanel.init();
            this.controlPanel.addOption("CPOStatistics", "optionStatisticsActive");
            this.controlPanel.addOption("CPOtest1", "test1");
            this.controlPanel.addOption("CPOtest2", "test2");
            
            this.statisticsView = statisticsView.create('StatisticsView');
            this.statisticsView.init();
            
            var bla = progressBar.create("TestProgressBar");
            bla.init(this);
            bla.setProgress(50);
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
                        
            // Update the controls
            this.controlPanel.update(currentTime);
            
            this.updateStatistics();
        };
        
        this.updateStatistics = function() {
        	if (settings.optionStatisticsActive === true) {
        		if(this.statisticsFrame === undefined) {
        			var optionPanel = panel.create(this.statisticsView.id + "Panel");
        			optionPanel.templateName = "OptionPanel";
        			optionPanel.init(this.optionsContent);
        			optionPanel.setContent(this.statisticsView);
        			optionPanel.onClose = function() { settings.optionStatisticsActive = !settings.optionStatisticsActive; };
        			this.statisticsFrame = optionPanel;
        		}
        		
        		this.statisticsView.update(currentTime);
        	} else {
        		if(this.statisticsFrame !== undefined) {
        			this.statisticsFrame.remove();
        			this.statisticsFrame = undefined;
        		}
        	}
        };
    };
    
    return {
        create: function(id) { return new ScreenMain(id); }
    };
    
});