define(function(require) {
	var $ = require("jquery");
    var log = require("log");
    var utils = require("utils");
    var assert = require("assert");
    var templates = require("data/templates");
    var component = require("component");
    
    var RootParentKey = "__ROOT__";
        
    var createElementContent = function(id, parent, templateName, attributes) {
        // Check if we are using a custom template, if not we will look-up by id
        if(templateName === undefined) {
            templateName = id;
        }
        
        // Ensure attributes is valid
        if(attributes === undefined) {
            attributes = {};
        }
        
        if(attributes.id === undefined) {
            attributes["id"] = id;
        }
        
        // fetch the template to use, either custom or go by the id
        var template = templates.GetTemplate(templateName, attributes);
        
        return $(template);
    };
        
    // ---------------------------------------------------------------------------
    // class definition
    // ---------------------------------------------------------------------------
    UIElement.prototype = component.create();
    UIElement.prototype.$super = parent;
    UIElement.prototype.constructor = UIElement;
    
    function UIElement(id) {
        this.id = id;
        
        this.isVisible = true;
        
        this.parent = undefined;
        
        this.templateName = undefined;
        
        this._mainDiv = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        this.componentRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
        	this.componentInit();
        	
        	log.debug(" ELEMENT: " + this.id)
        	assert.isDefined(parent, "Parent must be defined");
        	if(parent !== null) {
        		if(parent === RootParentKey) {
        			log.warning("  --> Appending to ROOT!");
        			this.parent = $(document.body);
        		} else {
        			log.debug("  --> Appending to " + parent.id);
        			this.parent = parent;
        		}
        	} else {
        		log.debug("  --> skipping parent");
        	}

        	// Store the target for this element
        	var elementTarget = undefined;
        	
            // try to get our element target
            if(this.parent !== undefined) {
            	if(this.parent.getMainElement !== undefined) {
            		elementTarget = this.parent.getMainElement();
            	} else {
            		elementTarget = this.parent;            		
            	}   
            	
            	this._mainDiv = elementTarget.find('#' + this.id);
            } else {
                this._mainDiv = $('#' + this.id);
            }
            
            if(this._mainDiv.length <= 0) {
                this._mainDiv = undefined;
                log.debug("  --> from template");
            } else {
            	log.debug("  --> from content");
            }
            
            // Check if we have a valid element target, if not create it
            if(this._mainDiv === undefined) {
                this._mainDiv = createElementContent(this.id, this.parent, this.templateName, attributes);
                                
                // null means no registration
                if(elementTarget !== undefined) {
                	assert.isDefined(elementTarget, "Parent needs to be of UIElement type and initialized");
                	elementTarget.append(this._mainDiv);
                }
            }
            
            // Wire up some default events
            this._mainDiv.mouseenter({self: this}, this.onMouseEnter);
            this._mainDiv.mouseleave({self: this}, this.onMouseLeave);
            this._mainDiv.mousemove({self: this}, this.onMouseMove);
        };
        
        this.update = function(currentTime) {
            if(!this.isVisible) {
                return false;
            }
    
            return this.componentUpdate(currentTime);
        };
        
        this.remove = function(keepDivAlive) {
            this.componentRemove();
            
            if(keepDivAlive !== true) {
                this._mainDiv.remove();
            }
        };
        
        // ---------------------------------------------------------------------------
        // ui functions
        // ---------------------------------------------------------------------------
        this.hide = function() {
            this.isVisible = false;
            this._mainDiv.hide();
        };
        
        this.show = function() {
            this.isVisible = true;
            this._mainDiv.show();
            this.invalidate();
        };
        
        this.getMainElement = function() {
            return this._mainDiv;
        };
        
        this.checkClassExist = function(className) {
            if(Crystal.isDebug === false) {
                return;
            }
            
            if($("."+className).length > 0) {
                return;
            }
            
            log.warning("ClassVerifyError: "+className+" on "+this.id);
        };
        
        this.addClass = function(className) {
            assert.isFalse(this._mainDiv.hasClass(className));
            this.checkClassExist(className);
            
            this._mainDiv.addClass(className);
        };
        
        this.removeClass = function(className) {
            assert.isTrue(this._mainDiv.hasClass(className));
            this.checkClassExist(className);
            
            this._mainDiv.removeClass(className);
        };
        
        this.toggleClass = function(className) {
            if(this._mainDiv.hasClass(className) === true) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            };
        };
        
        this.setPosition = function(point) {
            assert.isTrue(point.isValid(), "Point needs to be a valid structure");
            
            this._mainDiv.offset({ left: point.x, top: point.y});
        };
        
        this.setSize = function(size) {
            assert.isTrue(size.isValid(), "Size needs to be a valid structure");
            
            this._mainDiv.width(size.x);
            this._mainDiv.height(size.y);
            this._mainDiv.trigger( "updatelayout" );
        };
        
        this.setContent = function(content) {
            this._mainDiv.empty();
            this._mainDiv.append(content);
        };
        
        this.setText = function(text) {
            this._mainDiv.text(text);
        };
        
        this.onMouseMove = function(event) {
        	var self = event.data.self;
        	var position = [event.pageX, event.pageY];
        	
        	// Todo
        };
                
        this.onMouseEnter = function(event) {
        	var self = event.data.self;
        	
        	//log.debug("MouseEnter: "+self.id);
        	// Todo
        };
        
        this.onMouseLeave = function(event) {
        	var self = event.data.self;
        	
        	//log.debug("MouseExit: "+self.id);        	
        	// Todo
        };
    };
    
    return {
    	rootParent: RootParentKey,
    	
        create: function(id) { return new UIElement(id); }
    };
});