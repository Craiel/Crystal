declare("OptionsPanel", function() {
	include("Log");
	include("Assert");	
	include("Data");
	include("Settings");
	include("Element");
	include("Panel");
	include("Button");
    
	OptionsPanel.prototype = panel.create();
	OptionsPanel.prototype.$super = parent;
	OptionsPanel.prototype.constructor = OptionsPanel;
    
    function OptionsPanel(id) {
        this.id = id;
        
        this.canClose = false;
        this.canShowInfo = false;
        this.canShowTitle = false;
        
        this.contentTarget = undefined;
        
        this.options = {};
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.panelInit = this.init;
        this.panelUpdate = this.update;
        this.panelRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.panelInit(parent, attributes);
            
            this.contentTarget = element.create(this.id + "Content");
            this.contentTarget.init(this);
        };
        
        this.update = function(currentTime) {
        	if(this.panelUpdate(currentTime) === false) {
                return;
            }
        	
        	for(var key in this.options) {
        		var option = this.options[key].setActive(settings[key]);
        	};
        };
        
        this.remove = function(keepDivAlive) {
            this.panelRemove(keepDivAlive);
            
            this.contentTarget.remove(true);
        };
        
        // ---------------------------------------------------------------------------
        // control panel functions
        // ---------------------------------------------------------------------------
        this.addOption = function(id, stateSetting, arguments) {
            assert.isDefined(this.getMainElement(), StrLoc("addOption must be called after init"));
            assert.isDefined(stateSetting);
            
            var buttonIcon = data.iconPlaceholder;
            if(arguments !== undefined) {
            	if(buttonIcon === undefined) {
            		buttonIcon = data.iconPlaceholder;
            	}
            }

            // Build the option control div
            var optionButton = button.create(id + "_button");
            optionButton.isToggle = true;
            optionButton.templateName = "OptionsPanelButton";
            optionButton.onClick = function() { settings[stateSetting] = !settings[stateSetting]; };
            optionButton.init(this.contentTarget);
            optionButton.setIcon(buttonIcon);
            
            // Save the option to sync the states
            this.options[stateSetting] = optionButton;
        };
    };
    
    return {
        create: function(id) { return new OptionsPanel(id); }
    };
    
});