define(function(require) {
    var log = require("log");
    var assert = require("assert");
    var data = require("data");
    var element = require("ui/controls/element");
    
    ProgressBar.prototype = element.create();
    ProgressBar.prototype.$super = parent;
    ProgressBar.prototype.constructor = ProgressBar;
    
    function ProgressBar(id) {
        this.id = id;

        this.templateName = "ProgressBar";
        
        this.value = 0;
        this.maxValue = 100;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);
            
            // Todo or remove
        };
        
        // ---------------------------------------------------------------------------
        // progress bar functions
        // ---------------------------------------------------------------------------
        this.setProgress = function(value, max) {
            var update = false;
            if(max !== undefined) {
                this.maxValue = max;
                update = true;
            }
            
            if(value !== undefined && value !== this.value) {
                this.value = value;
                update = true;
            };
            
            if(update === true) {
                this._updateProgressDiv();
            }
        };
        
        this._updateProgressDiv = function() {
            var host = this.getMainElement();
            var progressValue = (this.value / this.maxValue);
            var progressWidth = progressValue * host.width();
            progressValue *= 100;
            host.find('div').animate({ width: progressWidth }, 500).html(~~progressValue + "%&nbsp;");
        };
    };
    
    return {
        create: function(id) { return new ProgressBar(id); }
    };
    
});