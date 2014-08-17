declare("ScreenStart", function() {
	include("Settings");
	include("Screen");
	include("Element");
	include("MenuBar");
    
    ScreenStart.prototype = screen.create();
    ScreenStart.prototype.$super = parent;
    ScreenStart.prototype.constructor = ScreenStart;
    
    function ScreenStart(id) {
        this.id = id;
                
        this.menuContent = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.screenInit = this.init;
        this.screenUpdate = this.update;
        this.screenHide = this.hide;
        this.screenShow = this.show;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.screenInit(parent);
            
            this.menuContent = element.create(this.id + "MenuContent");
            this.menuContent.init(this);
            
            this.menuBar = menuBar.create(this.id + "_menu");
            this.menuBar.init(this.menuContent);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
        };
        
        this.hide = function() {
            this.screenHide();
        };
        
        this.show = function() {
            this.screenShow();
        };
        
        // ---------------------------------------------------------------------------
        // screen functions
        // ---------------------------------------------------------------------------
    };
    
    return {
        create: function(id) { return new ScreenStart(id); }
    };
    
});