define(function() {
    
	ControlPanel.prototype = Crystal.UI.createUIElement();
    ControlPanel.prototype.$super = parent;
    ControlPanel.prototype.constructor = ControlPanel;
    
    function ControlPanel(id) {
        this.id = id;
    };
    
    Crystal.UI.createControlPanel = function(id) { return new ControlPanel(id); };
    
});