define(function(require) {
    var panel = require("ui/panel");
    
	ControlPanel.prototype = panel.create();
    ControlPanel.prototype.$super = parent;
    ControlPanel.prototype.constructor = ControlPanel;
    
    function ControlPanel(id) {
        this.id = id;
        
        this.canClose = false;
        this.canShowInfo = false;
        
        this.options = {};
        
        this.addOption = function(id, arguments) {
            assert.isDefined(this.getMainElement(), "addOption must be called after init");
            
            // Build the option control div
        };
    };
    
    return {
        create: function(id) { return new ControlPanel(id); }
    };
    
});