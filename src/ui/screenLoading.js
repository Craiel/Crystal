define(function(require) {
    var math = require("math");
    var settings = require("settings");
    var screen = require("ui/controls/screen");
    var panel = require("ui/controls/panel");
    var element = require("ui/controls/element");
    var progressBar = require('ui/controls/progressBar');
    
    ScreenLoading.prototype = screen.create();
    ScreenLoading.prototype.$super = parent;
    ScreenLoading.prototype.constructor = ScreenLoading;
    
    function ScreenLoading(id) {
        this.id = id;
        
        this.progressBar = undefined;
        this.progressText = undefined;
        
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
            
            this.progressBar = progressBar.create(this.id + "Progress");
            this.progressBar.init(this);
            this.progressBar.setProgress(50);
            
            this.progressText = element.create(this.id + "ProgressText");
            this.progressText.init(this);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
            
            this.progressBar.update(currentTime);
        };
    };
    
    return {
        create: function(id) { return new ScreenLoading(id); }
    };
    
});