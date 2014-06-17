define(function(require) {
    var log = require("log");
    var data = require("data/generated/templates");
    var assert = require("assert");
    
    var applyTemplateAttributes = function(template, attributes) {
        assert.isDefined(template);
        assert.isDefined(attributes);
        
        var result = template;
        for(var key in attributes) {
            result = result.replace(new RegExp('{{'+key+'}}', "gi"), attributes[key]);
        }
        
        return result;
    };
    
    function Templates() {
        this.GetTemplate = function(id, attributes) {
            var template;
            if(data[id] !== undefined) {
                template = data[id];
            } else {
                log.warning("Template.Default: " + id);
                template = '<div id="{{id}}"></div>';
            }
            
            template = applyTemplateAttributes(template, {id: id});
            if(attributes !== undefined) {
                return applyTemplateAttributes(template, attributes);
            }
            
            return template;
        };
    };
    
    return new Templates();
    
});