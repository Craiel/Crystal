declare("LoginControl", function() {
	include("Log");
	include("Assert");
	include("Element");
	include("Button");
	include("Static");
    
	LoginControl.prototype = element.create();
	LoginControl.prototype.$super = parent;
	LoginControl.prototype.constructor = LoginControl;
    
    function LoginControl(id) {
        this.id = id;
        
        this.templateName = "loginControl";
        
        this.inputName = undefined;
        this.inputPass = undefined;
        
        this.buttonRegister = undefined;
        this.buttonLogin = undefined;
                
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
            
            this.inputName = element.create(this.id + "Name");
            this.inputName.init(this);
            
            this.inputPass = element.create(this.id + "Pass");
            this.inputPass.init(this);
            this.inputPass.setKeyPress(static.EnumKeyCodeEnter, this.onLoginClick);
            
            this.buttonRegister = button.create(this.id + "ActionRegister");
            this.buttonRegister.onClick = this.onRegisterClick;
            this.buttonRegister.init(this);
            
            this.buttonLogin = button.create(this.id + "ActionLogin");
            this.buttonLogin.onClick = this.onLoginClick;
            this.buttonLogin.init(this);
        };
        
        this.update = function(currentTime) {
        	if(this.elementUpdate(currentTime) === false) {
                return;
            }
        	
        };
        
        this.remove = function(keepDivAlive) {
            this.elementRemove(keepDivAlive);            
        };
        
        // ---------------------------------------------------------------------------
        // login control functions
        // ---------------------------------------------------------------------------
        this.onRegisterClick = function() {
        	log.error("Register is not implemented");
        };
        
        this.onLoginClick = function() {
        	log.error("Login is not implemented");
        };
        
        this.getUser = function() {
        	return this.inputName.getMainElement().val();
        };
        
        this.getPass = function() {
        	return this.inputPass.getMainElement().val();
        };
    };
    
    return {
        create: function(id) { return new LoginControl(id); }
    };
    
});
