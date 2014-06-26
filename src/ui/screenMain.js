define(function(require) {
    var math = require("math");
    var settings = require("settings");
    var element = require("ui/element");
    var panel = require("ui/panel");
    var pluginBar = require('ui/pluginBar');
    var pluginTime = require('ui/pluginTime');
    var progressBar = require('ui/progressBar');
    var optionsPanel = require('ui/optionsPanel');
    var statisticsView = require("ui/statisticsView");
    
    ScreenMain.prototype = element.create();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.testPanel = undefined;
        
        this.pluginBar = undefined;
        
        this.optionsContent = undefined;
        this.optionsPanel = undefined;
        
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
            
            // Setup the plugin bar
            this.pluginBar = pluginBar.create("PluginBar");
            this.pluginBar.init(this);
            
            this.pluginBar.addPlugin(pluginTime);
            
            // Setup the options side pane
            this.optionsContent = element.create("OptionsContent");
            this.optionsContent.init();
            
            // Setup the control panel on top of the options pane and add the options to it
            this.optionsPanel = optionsPanel.create("OptionsPanel");
            this.optionsPanel.init();
            this.optionsPanel.addOption("CPOStatistics", "optionStatisticsActive");
            this.optionsPanel.addOption("CPOtest1", "test1");
            this.optionsPanel.addOption("CPOtest2", "test2");
            
            this.statisticsView = statisticsView.create('StatisticsView');
            this.statisticsView.init();
            
            var bla = progressBar.create("TestProgressBar");
            bla.init(this);
            bla.setProgress(5);
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
                        
            // Update the controls
            this.pluginBar.update(currentTime);
            this.optionsPanel.update(currentTime);
            
            this.updateStatistics();
        };
        
        this.updateStatistics = function() {
        	if (settings.optionStatisticsActive === true) {
        		if(this.statisticsFrame === undefined) {
        			var optionPanel = panel.create(this.statisticsView.id + "Panel");
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