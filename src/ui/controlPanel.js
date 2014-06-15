define(function(require) {
    var element = require("ui/element");
    
	ControlPanel.prototype = element.create();
    ControlPanel.prototype.$super = parent;
    ControlPanel.prototype.constructor = ControlPanel;
    
    function ControlPanel(id) {
        this.id = id;
    };
    
    return {
        create: function(id) { return new ControlPanel(id); }
    };
    
});