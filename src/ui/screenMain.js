declare("ScreenMain", function() {
	include("Data");
	include("Game");
	include("Settings");
	include("Screen");
	include("Element");
	include("Panel");
	include('PluginBar');
	include('PluginMenu');
	include('PluginTime');
	include('ProgressBar');
	include('OptionsPanel');
	include('ViewEquipment');
	include('ViewInventory');
	include("ViewStatistics");
	include("ViewSynthesize");
    
    ScreenMain.prototype = screen.create();
    ScreenMain.prototype.$super = parent;
    ScreenMain.prototype.constructor = ScreenMain;
    
    function ScreenMain(id) {
        this.id = id;
        
        this.pluginBar = undefined;
        
        this.mainContentFrame = undefined;
        
        this.optionsContent = undefined;
        this.optionsPanel = undefined;
        
        this.statisticsFrame = undefined;
        this.statisticsView = undefined;
        
        this.equipmentFrame = undefined;
        this.equipmentView = undefined;
        
        this.inventoryFrame = undefined;
        this.inventoryView = undefined;
        
        this.moduleViewType = undefined;
        this.moduleView = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.screenInit = this.init;
        this.screenUpdate = this.update;
        this.screenHide = this.hide;
        this.screenShow = this.show;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.screenInit(parent);
            
            // Setup the main content area
            this.mainContentFrame = element.create("ScreenMainContent");
            this.mainContentFrame.init(this);
            
            // Setup the plug-in bar
            this.pluginBar = pluginBar.create("PluginBar");
            this.pluginBar.init(this);
            
            this.pluginBar.addPlugin(pluginMenu);
            this.pluginBar.addPlugin(pluginTime);
            
            // Setup the options side pane
            this.optionsContent = element.create("OptionsContent");
            this.optionsContent.init(this);
            
            // Setup the control panel on top of the options pane and add the options to it
            this.optionsPanel = optionsPanel.create("OptionsPanel");
            this.optionsPanel.init(this);
            this.optionsPanel.addOption("CPOStatistics", "optionStatisticsActive");
            this.optionsPanel.addOption("CPOEquipment", "optionEquipmentActive");
            this.optionsPanel.addOption("CPOInventory", "optionInventoryActive");
            
            this.statisticsView = viewStatistics.create('ViewStatistics');
            this.statisticsView.init(null);
            
            this.equipmentView = viewEquipment.create('ViewEquipment');
            this.equipmentView.init(null);
            
            this.inventoryView = viewInventory.create('ViewInventory');
            this.inventoryView.init(null);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
                        
            // Update the controls
            this.pluginBar.update(currentTime);
            this.optionsPanel.update(currentTime);
            
            this.updateStatistics(currentTime);
            this.updateEquipment(currentTime);
            this.updateInventory(currentTime);
            this.updateModuleViews(currentTime);
        };
        
        this.hide = function() {
            // For now just simply hide, but we want to do more animating here
            this.screenHide();
        };
        
        this.show = function() {
            this.screenShow();
        };
        
        // ---------------------------------------------------------------------------
        // screen functions
        // ---------------------------------------------------------------------------        
        this.updateStatistics = function(currentTime) {
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
        
        this.updateEquipment = function(currentTime) {
            if (settings.optionEquipmentActive === true) {
                if(this.equipmentFrame === undefined) {
                    var optionPanel = panel.create(this.equipmentView.id + "Panel");
                    optionPanel.init(this.optionsContent);
                    optionPanel.setContent(this.equipmentView);
                    optionPanel.onClose = function() { settings.optionEquipmentActive = !settings.optionEquipmentActive; };
                    this.equipmentFrame = optionPanel;
                }
                
                this.equipmentView.update(currentTime);
            } else {
                if(this.equipmentFrame !== undefined) {
                    this.equipmentFrame.remove();
                    this.equipmentFrame = undefined;
                }
            }
        };
        
        this.updateInventory = function(currentTime) {
            if (settings.optionInventoryActive === true) {
                if(this.inventoryFrame === undefined) {
                    var optionPanel = panel.create(this.inventoryView.id + "Panel");
                    optionPanel.init(this.optionsContent);
                    optionPanel.setContent(this.inventoryView);
                    optionPanel.onClose = function() { settings.optionInventoryActive = !settings.optionInventoryActive; };
                    this.inventoryFrame = optionPanel;
                }
                
                this.inventoryView.update(currentTime);
            } else {
                if(this.inventoryFrame !== undefined) {
                    this.inventoryFrame.remove();
                    this.inventoryFrame = undefined;
                }
            }
        };
        
        this.updateModuleViews = function(currentTime) {
        	var activeModuleType = game.getActiveModuleType();
        	
        	// Check if we are transitioning the module view
        	if(this.moduleViewType === undefined || activeModuleType !== this.moduleViewType) {
        		if(this.moduleView !== undefined) {
        			// Todo: Transition properly
        			this.moduleView.remove();
        			this.moduleView = undefined;
        			this.moduleViewType = undefined;
        		}

        		switch(activeModuleType) {
        			case data.EnumModuleSynthesize: {
        				this.moduleView = viewSynthesize.create("ViewSynthesize");
        				break;
        			}
        			default: throw StrLoc("Module view not implemented for {0}").format(activeModuleType);
        		}
        		
        		this.moduleViewType = activeModuleType;
        		this.moduleView.init(this.mainContentFrame);
        	}
        	
        	if(this.moduleView !== undefined) {
        		this.moduleView.update(currentTime);	
        	}
        };
    };
    
    return {
        create: function(id) { return new ScreenMain(id); }
    };
    
});