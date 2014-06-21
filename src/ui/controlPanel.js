define(function(require) {
	var log = require("log");
	var assert = require("assert");	
	var data = require("data");
	var state = require("game/state");
	var element = require("ui/element");
    var panel = require("ui/panel");
    var button = require("ui/button");
    
	ControlPanel.prototype = panel.create();
    ControlPanel.prototype.$super = parent;
    ControlPanel.prototype.constructor = ControlPanel;
    
    function ControlPanel(id) {
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
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.panelInit(parent, attributes);
            
            this.contentTarget = element.create(this.id + "Content");
            this.contentTarget.init();
        };
        
        this.update = function(currentTime) {
        	if(this.panelUpdate(currentTime) === false) {
                return;
            }
        	
        	for(var key in this.options) {
        		var option = this.options[key].setActive(state[key]);
        	};
        };
        
        // ---------------------------------------------------------------------------
        // control panel functions
        // ---------------------------------------------------------------------------
        this.addOption = function(id, stateSetting, arguments) {
            assert.isDefined(this.getMainElement(), "addOption must be called after init");
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
            optionButton.templateName = "ControlPanelButton";
            optionButton.onClick = function() { state[stateSetting] = !state[stateSetting]; };
            optionButton.init(this.contentTarget);
            optionButton.setIcon(buttonIcon);
            
            // Save the option to sync the states
            this.options[stateSetting] = optionButton;
        };
    };
    
    return {
        create: function(id) { return new ControlPanel(id); }
    };
    
});