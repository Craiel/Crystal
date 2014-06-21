define(function(require) {
    var log = require("log");
    var assert = require("assert");
    var data = require("data");
    var element = require("ui/element");
    
    Button.prototype = element.create();
    Button.prototype.$super = parent;
    Button.prototype.constructor = Button;
    
    function Button(id) {
        this.id = id;
        
        this.isToggle = false;
        this.isActive = false;
        
        this.icon = undefined;
        this.iconActive = undefined;
        
        this.onClick = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);
            
            assert.isDefined(this.onClick, "No click event defined for button");
            
            this.getMainElement().click({self: this}, this.onButtonClick);
        };
        
        // ---------------------------------------------------------------------------
        // button functions
        // ---------------------------------------------------------------------------
        this.setIcon = function(icon) {
        	this.icon = icon;
        	this.iconActive = icon.replace(".png", "_active.png");
        	
        	this.updateIcon();
        };
        
        this.setActive = function(value) {
        	this.isActive = value;
        	this.updateIcon();
        };
        
        this.updateIcon = function() {
        	var element = this.getMainElement().find("#" + this.id + "_icon");
        	
        	if(this.isToggle && this.isActive) {
        		element.attr("src", data.iconRoot + this.iconActive);
        	} else {
        		element.attr("src", data.iconRoot + this.icon);
        	}
        };
        
        this.onButtonClick = function(parameters) {
        	var self = parameters.data.self;

        	if(self.isToggle) {
        		self.isActive = !self.isActive;
        		self.updateIcon();
        	};
        	
        	if(self.onClick !== undefined) {
        		self.onClick(self);
        	}
        };
    };
    
    return {
        create: function(id) { return new Button(id); }
    };
    
});