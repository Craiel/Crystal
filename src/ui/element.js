define(function(require) {
    var log = require("log");
    var utils = require("utils");
    var assert = require("assert");
    var templates = require("data/templates");
    var component = require("component");
    
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
            this.parent = parent;
            this.componentInit();

            // try to get our element target
            this._mainDiv = $('#' + this.id);
            
            // Check if we have a valid element target, if not create it
            if(this._mainDiv === undefined || this._mainDiv.length === 0) {
                this._mainDiv = createElementContent(this.id, parent, this.templateName, attributes);
                
                // undefined means no registration, null will put it into root
                if(parent !== undefined) {
                    // either append to body or a given parent
                    if(parent === null) {
                        log.warning("Creating ui element in Root: " + this.id);
                        $(document.body).append(this._mainDiv);
                    } else {
                        assert.isDefined(parent.getMainElement(), "Parent needs to be of UIElement type and initialized");
                        log.debug("Appending child " + this.id + " to " + parent.id);
                        parent.getMainElement().append(this._mainDiv);
                    }
                }
            }
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
    };
    
    return {
        create: function(id) { return new UIElement(id); }
    };
});