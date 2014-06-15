define(function(require) {
    var log = require("log");
    var data = require("data/generated/templates");
    
    function Templates() {
        this.GetTemplate = function(id) {
            if(data[id] !== undefined) {
                return data[id];
            }
            
            log.warning("Template.Default: "+id);
            return '<div id="' + id + '"></div>';
        };
    };
    
    return new Templates();
    
});