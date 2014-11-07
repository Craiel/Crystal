declare("Element", function() {
	include("$");
	include("Log");
	include("Assert");
	include("TemplateProvider");
	include("Component");
    
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
        var content = templateProvider.GetTemplate(templateName, attributes);        
        return $(content);
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
        	
        	log.debug(StrLoc(" ELEMENT: {0}").format(this.id));
        	assert.isDefined(parent, StrLoc("Parent must be defined"));
        	if(parent !== null) {
        		if(parent === RootParentKey) {
        			log.warning(StrLoc("  --> Appending to ROOT!"));
        			this.parent = $(document.body);
        		} else {
        			log.debug(StrLoc("  --> Appending to {0}").format(parent.id));
        			this.parent = parent;
        		}
        	} else {
        		log.debug(StrLoc("  --> skipping parent"));
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
                log.debug(StrLoc("  --> from template"));
            } else {
            	log.debug(StrLoc("  --> from content"));
            }
            
            // Check if we have a valid element target, if not create it
            if(this._mainDiv === undefined) {
                this._mainDiv = createElementContent(this.id, this.parent, this.templateName, attributes);
                                
                // null means no registration
                if(elementTarget !== undefined) {
                	assert.isDefined(elementTarget, StrLoc("Parent needs to be of UIElement type and initialized"));
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
            
            log.warning(StrLoc("ClassVerifyError: {0} on {1}").format(className, this.id));
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
            assert.isTrue(point.isValid(), StrLoc("Point needs to be a valid structure"));
            
            this._mainDiv.offset({ left: point.x, top: point.y});
        };
        
        this.setSize = function(size) {
            assert.isTrue(size.isValid(), StrLoc("Size needs to be a valid structure"));
            
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
