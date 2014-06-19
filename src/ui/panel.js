define(function(require) {
    var log = require("log");
    var element = require("ui/element");
    var button = require("ui/button");
    
    Panel.prototype = element.create();
    Panel.prototype.$super = parent;
    Panel.prototype.constructor = Panel;
    
    function Panel(id) {
        this.id = id;
        
        this.canClose = true;
        this.canShowInfo = true;
        
        this.onClose = undefined;
        this.onShowInfo = undefined;
        
        this.content = undefined;
        this.title = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            var background = element.create(this.id + "_bg");
            background.init(this);
            
            this.content = element.create(this.id + "_content");
            this.content.init(this);
            
            var contentBackground = element.create(this.content.id + "_bg");
            contentBackground.init(this.content);
            
            this.title = element.create(this.id + "_title");
            this.title.init(this);
            
            if (this.canClose === true) {
                var closeButton = button.create(this.id + "_btClose");
                closeButton.onClick = this.onCloseClick;
                closeButton.init(this);
                closeButton.setText("x");
            }
            
            if (this.canShowInfo === true) {
                var infoButton = button.create(this.id + "_btInfo");
                infoButton.onClick = this.onInfoClick;
                infoButton.init(this);
                infoButton.setText("i");
            }
        };
        
        // ---------------------------------------------------------------------------
        // panel functions
        // ---------------------------------------------------------------------------
        this.setTitle = function(title) {
            this.title.setText(title);
        };
        
        this.onCloseClick = function(event) {
            var self = event.data.self.parent;
            self.hide();
        };
        
        this.onInfoClick = function(event) {
            var self = event.data.self.parent;
            log.debug("onInfoClick: " +this.id);
        };
    };
    
    return {
        create: function(id) { return new Panel(id); }
    };
    
});