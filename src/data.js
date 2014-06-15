define(function(require) {
    var component = require("component");
    
    Data.prototype = component.create();
    Data.prototype.$super = parent;
    Data.prototype.constructor = Data;
    
    function Data() {
        
        // ---------------------------------------------------------------------------
        // data functions
        // ---------------------------------------------------------------------------
        this.setRoot = function(root) {
            this.root = root;
            this.imageRoot = this.root + "images/";
            this.iconRoot = this.imageRoot + "icons/";
            
            this.enableDragDrop = true;
            this.dragDelay = 300; // delay before starting to drag
            
            this.floatFadeDelay = 300; // delay for floating windows to fade on close 
            
            // Icons
            this.iconPlaceholder = 'icon_placeholder.png';
        };
        
    };
    
    return new Data();
});

