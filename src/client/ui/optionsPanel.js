declare("OptionsPanel", function() {
	include("Log");
	include("Assert");	
	include("Static");
	include("Settings");
	include("Element");
    include("Element");
	include("Button");
    include("Resources");
    
	OptionsPanel.prototype = element.create();
	OptionsPanel.prototype.$super = parent;
	OptionsPanel.prototype.constructor = OptionsPanel;
    
    function OptionsPanel(id) {
        this.id = id;

        this.setTemplate("optionsPanel");
        
        this.canClose = false;
        this.canShowInfo = false;
        this.canShowTitle = false;
        
        this.contentTarget = undefined;
        
        this.options = {};
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        this.elementRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);
            
            this.contentTarget = element.create(this.id + "OptionContent");
            this.contentTarget.init(this);
        };
        
        this.update = function(currentTime) {
        	if(this.elementUpdate(currentTime) === false) {
                return;
            }
        	
        	for(var key in this.options) {
        		var option = this.options[key].setActive(settings[key]);
        	};
        };
        
        this.remove = function(keepDivAlive) {
            this.elementRemove(keepDivAlive);
            
            this.contentTarget.remove(true);
        };
        
        // ---------------------------------------------------------------------------
        // control panel functions
        // ---------------------------------------------------------------------------
        this.addOption = function(id, stateSetting, parameters) {
            assert.isDefined(this.getMainElement(), StrLoc("addOption must be called after init"));
            assert.isDefined(stateSetting);

            // Ensure we have a valid parameters struct for easier evaluation
            if(parameters === undefined) {
            	parameters = {};
            }

            var buttonIcon = parameters.icon !== undefined ? parameters.icon : resources.IconPlaceHolder;

            // Build the option control div
            var optionButton = button.create(id + "Button");
            optionButton.isToggle = true;
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
