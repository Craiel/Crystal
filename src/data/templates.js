define(function(require) {
    var log = require("log");
    var data = require("data/generated/templates");
    var assert = require("assert");
    
    var applyTemplateAttributes = function(template, attributes) {
        assert.isDefined(template);
        assert.isDefined(attributes);
        console.log(attributes)
        var result = template;
        for(var key in attributes) {
        	log.debug(key + " -> " + attributes[key])
            result = result.replace(new RegExp('{{'+key+'}}', "gi"), attributes[key]);
        }
        
        return result;
    };
    
    function Templates() {
        this.GetTemplate = function(templateName, attributes) {
            var template;
            if(data[templateName] !== undefined) {
                template = data[templateName];
            } else {
                log.warning("Template.Default: " + templateName);
                template = '<div id="{{id}}"></div>';
            }
            
            if(attributes !== undefined) {
                return applyTemplateAttributes(template, attributes);
            }
            
            return template;
        };
        
        this.SetTemplate = function(templateName, data) {
        	assert.isUndefined(data[templateName]);
        	
        	data[templateName] = data;
        };
    };
    
    return new Templates();
    
});