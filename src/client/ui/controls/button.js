declare("Button", function() {
	include("Log");
	include("Assert");
	include("Static");
    include("Element");
    
    Button.prototype = element.create();
    Button.prototype.$super = parent;
    Button.prototype.constructor = Button;
    
    function Button(id) {
        this.id = id;

        this.setTemplate("button");
        
        this.isToggle = false;
        this.isActive = false;
        this.isUsingActiveIcon = false;
        
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
            
            assert.isDefined(this.onClick, StrLoc("No click event defined for button"));

            this.setOnClick(this.onButtonClick);
        };
        
        // ---------------------------------------------------------------------------
        // button functions
        // ---------------------------------------------------------------------------
        this.setIcon = function(icon) {
        	this.icon = icon;
        	this.iconActive = icon.replace(".png", "_active.png");
        	
        	this.updateIcon(true);
        };
        
        this.setActive = function(value) {
        	this.isActive = value;
        	this.updateIcon();
        };
        
        this.updateIcon = function(forceIcon) {
        	var iconElement = this.getMainElement().find("#" + this.id + "_icon");
        	var overlayElement = this.getMainElement().find("#" + this.id + "_overlay");

        	if(this.isToggle && this.isActive) {
        		overlayElement.addClass("colorAccentBackground");
        		if(this.isUsingActiveIcon === true) {
        			iconElement.attr("src", this.iconActive);
        		}
        	} else {
        		overlayElement.removeClass("colorAccentBackground");
        		
        		if(forceIcon === true || this.isUsingActiveIcon === true) {
        			iconElement.attr("src", this.icon);
        		}
        	}
        };
        
        this.onButtonClick = function(self) {
            console.log("onButtonClick!");

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
