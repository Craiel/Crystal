define(function(require) {
	var log = require("log");
    var math = require("math");
    var settings = require("settings");
    var element = require("ui/controls/element");
    
    Screen.prototype = element.create();
    Screen.prototype.$super = parent;
    Screen.prototype.constructor = Screen;
    
    function Screen() {
        
        // Time it needs to transition from and to this screen
        this.transitionTimeFrom = 1000;
        this.transitionTimeTo = 1000;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        this.elementHide = this.hide;
        this.elementShow = this.show;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            // Screens start off hidden by default
            this.elementHide();
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
        };
        
        this.show = function() {
            this.getMainElement().fadeIn(this.transitionTimeTo);
        };
        
        this.hide = function() {
            this.getMainElement().fadeOut(this.transitionTimeFrom, function() { $(this).remove(); });
        };
        
        this.getLoadingActions = function() {
        	var generalId = StrLoc('General Loading');
        	return {
        		generalId: this.load
        	};
        };
        
        this.load = function(loadAction) {
        	var self = loadAction.actionHost;
        	
        	loadAction.setSubProgressText("File 1");
        	log.debug(StrLoc("No loading in screen {0}").format(self.id));
        };
    };
    
    return {
        create: function() { return new Screen(); }
    };
    
});