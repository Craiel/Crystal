define(function(require) {
    var log = require("log");
    var assert = require("assert");
    
    UIElement.prototype = Crystal.createComponent();
    UIElement.prototype.$super = parent;
    UIElement.prototype.constructor = UIElement;
    
    function UIElement() {
        this.id = undefined;
        
        this.isVisible = true;
        
        this._mainDiv = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.componentInit();
            
            assert.isDefined(this.id, "UIElement needs valid Id");
            
            // try to get our element target
            this._mainDiv = $('#' + this.id);
            
            // Check if we have a valid element target, if not create it
            if(this._mainDiv === undefined || this._mainDiv.length === 0) {
                this._mainDiv = $('<div id="' + this.id + '"></div>');
                
                // We are creating it so either append to body or a given parent
                if(parent === undefined) {
                    log.warning("Creating ui element in Root: " + this.id);
                    $(document.body).append(this._mainDiv);
                } else {
                    assert.isDefined(parent.getMainElement(), "Parent needs to be of UIElement type and initialized");
                    log.debug("Appending child " + this.id + " to " + parent.id);
                    parent.getMainElement().append(this._mainDiv);
                }
            }
        };
        
        this.update = function(currentTime) {
            if(!this.isVisible) {
                return false;
            }
    
            return this.componentUpdate(currentTime);
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
    };
    
    Crystal.UI.createUIElement = function() { return new UIElement(); };
});