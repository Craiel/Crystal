define(function(require) {
    var math = require("math");
    var settings = require("settings");
    var screen = require("ui/controls/screen");
    var panel = require("ui/controls/panel");
    var progressBar = require('ui/controls/progressBar');
    
    ScreenLoading.prototype = screen.create();
    ScreenLoading.prototype.$super = parent;
    ScreenLoading.prototype.constructor = ScreenLoading;
    
    function ScreenLoading(id) {
        this.id = id;
        
        this.mainProgressBar = undefined;
        this.subProgressBar = undefined;
        
        this.progressDetailText = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.screenInit = this.init;
        this.screenUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.screenInit(parent);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
            
            // load...
        };
    };
    
    return {
        create: function(id) { return new ScreenLoading(id); }
    };
    
});