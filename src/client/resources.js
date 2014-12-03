declare("Resources", function() {
	include("Static");
	include("Component");

	Resources.prototype = component.create();
    Resources.prototype.$super = parent;
    Resources.prototype.constructor = Resources;
    
    function Resources() {
        this.id = 'Resources';
        
        this.componentInit = this.init;
        
        // ---------------------------------------------------------------------------
    	// component functions
    	// ---------------------------------------------------------------------------	
        this.init = function() {
        	this.componentInit();
        	
        	this.ImageStartBackground = static.imageRoot + "TitleScreen.png"; 
            
            this.IconNetworkOffline = static.iconRoot + "network_offline.png";
            this.IconNetworkOnline = static.iconRoot + "network_online.png";
            this.IconNetworkUnknown = static.iconRoot + "network_unknown.png";
            
            this.IconPlaceHolder = static.iconRoot + "placeholder.png";
            this.IconPlaceHolderActive = static.iconRoot + "placeholder_active.png";
        };
    };
    
    return new Resources();
});

