declare("NetworkControl", function() {
	include("Log");
	include("Assert");
	include("Element");
	include("Button");
	include("Resources");
	include("Network");
	include("NetworkClient");
	include("ProgressBar");
    
	NetworkControl.prototype = element.create();
	NetworkControl.prototype.$super = parent;
	NetworkControl.prototype.constructor = NetworkControl;
    
    function NetworkControl(id) {
        this.id = id;
        
        this.templateName = "networkControl";
                
        this.buttonSettings = undefined;
        
        this.signalProgress = undefined;
        
        this.statusIcon = undefined;
        this.networkStatus = undefined;
                
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        this.elementRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);
            
            this.buttonSettings = button.create(this.id + "ActionSettings");
            this.buttonSettings.onClick = this.onSettingsClick;
            this.buttonSettings.init(this);
            
            this.statusIcon = element.create(this.id + "StatusIcon");
            this.statusIcon.init(this);
            
            var progressPanel = element.create(this.id + "ProgressPanel");
            progressPanel.init(this);
            
            this.signalProgress = progressBar.create(this.id + "Progress");
            this.signalProgress.init(progressPanel);
        };
        
        this.update = function(currentTime) {
        	if(this.elementUpdate(currentTime) === false) {
                return;
            }
        	
        	if(this.networkStatus !== networkClient.status) {
        		this.networkStatus = networkClient.status;
        		this.updateNetworkStatus();
        	}
        };
        
        this.remove = function(keepDivAlive) {
            this.elementRemove(keepDivAlive);            
        };
        
        // ---------------------------------------------------------------------------
        // network control functions
        // ---------------------------------------------------------------------------
        this.updateNetworkStatus = function() {
        	var image = resources.IconNetworkUnknown;
        	switch(this.networkStatus) {
        	case network.EnumStatusAuthenticated:
        		image = resources.IconNetworkOnline;
        		break;
        		
        	case EnumStatusFailed:
        		image = resources.IconNetworkOffline;
        		break;
        	}
        	
        	this.statusIcon.setAttribute("src", image);
        };
        
        this.onSettingsClick = function() {
        	log.error("Settings are not implemented");
        };
    };
    
    return {
        create: function(id) { return new NetworkControl(id); }
    };
    
});
