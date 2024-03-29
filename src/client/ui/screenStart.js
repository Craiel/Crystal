declare("ScreenStart", function() {
	include("Log");
	include("Settings");
	include("Screen");
	include("Element");
	include("MenuBar");
	include("LoginControl");
	include("Resources");
	include("Network");
	include("NetworkClient");
	include("NetworkControl");
    
    ScreenStart.prototype = screen.create();
    ScreenStart.prototype.$super = parent;
    ScreenStart.prototype.constructor = ScreenStart;
    
    function ScreenStart(id) {
        this.id = id;

        this.setTemplate("screenStart");
        
        this.loginControl = undefined;
        
        this.networkControl = undefined;
        
        this.startImage = undefined;
        
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
            
            this.startImage = element.create(this.id + "StartImage");
            this.startImage.init(this);
            this.startImage.setAttribute("src", resources.ImageStartBackground);
            
            this.controlsParent = element.create(this.id + "Controls");
            this.controlsParent.init(this);
            
            this.loginControl = loginControl.create(this.id + "LoginControls");
            this.loginControl.onLoginClick = this.onLoginClick;
            this.loginControl.init(this.controlsParent);
            
            this.networkControl = networkControl.create(this.id + "NetworkStatus");
            this.networkControl.init(this.controlsParent);
        };
        
        this.update = function(currentTime) {
            if(this.screenUpdate(currentTime) === false) {
                return;
            }
            
            this.loginControl.update(currentTime);
            this.networkControl.update(currentTime);
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
        this.onLoginClick = function(source) {
        	var user = source.parent.getUser();
        	var pass = source.parent.getPass();
        	if(user.length <= 0 || pass.length <= 0) {
        		log.error("User or pass was not supplied!");
        		return;
        	}
        	
        	log.debug("Login triggered: " + user + " | " + pass);
        	networkClient.queueClientMessage(network.EnumCommandAuth, { user: user, pass: pass });
        };
    };
    
    return {
        create: function(id) { return new ScreenStart(id); }
    };
    
});