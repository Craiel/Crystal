declare("ScreenStart", function() {
	include("Log");
	include("Settings");
	include("Screen");
	include("Element");
	include("MenuBar");
	include("LoginControl");
	include("Network");
	include("NetworkClient");
    
    ScreenStart.prototype = screen.create();
    ScreenStart.prototype.$super = parent;
    ScreenStart.prototype.constructor = ScreenStart;
    
    function ScreenStart(id) {
        this.id = id;
        
        this.loginControls = undefined;
        
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
            this.startImage.setAttribute("src", "TitleScreen.png");
            
            this.controlsParent = element.create(this.id + "Controls");
            this.controlsParent.init(this);
            
            this.loginControls = loginControl.create(this.id + "LoginControls");
            this.loginControls.onLoginClick = this.onLoginClick;
            this.loginControls.init(this.controlsParent);
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