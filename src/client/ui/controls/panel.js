declare("Panel", function() {
	include("Log");
	include("Assert");
	include("GameState");
	include("Element");
	include("Button");
    
    Panel.prototype = element.create();
    Panel.prototype.$super = parent;
    Panel.prototype.constructor = Panel;
    
    function Panel(id) {
        this.id = id;

        this.setTemplate("panel");
        
        this.canClose = true;
        this.canShowInfo = true;
        this.canShowTitle = true;
        
        this.onClose = undefined;
        this.onInfo = undefined;
        
        this.contentProvider = undefined;
        this.content = undefined;
        this.title = undefined;
        this.closeButton = undefined;
        this.infoButton = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            this.content = element.create(this.id + "Content");
            this.content.init(this);
            
            if (this.canShowTitle === true) {
            	this.title = element.create(this.id + "Title");
            	this.title.init(this);
            }
            
            if (this.canClose === true) {
                this.closeButton = button.create(this.id + "ActionClose");
                this.closeButton.onClick = this.onCloseClick;
                this.closeButton.init(this);
                this.closeButton.setText("x");
            }
            
            if (this.canShowInfo === true) {
                this.infoButton = button.create(this.id + "ActionInfo");
                this.infoButton.onClick = this.onInfoClick;
                this.infoButton.init(this);
                this.infoButton.setText("i");
            }
        };
        
        this.remove = function(keepDivAlive) {
            this.elementRemove(keepDivAlive);
            
            this.content.remove();
            if(this.title !== undefined) {
                this.title.remove();
            }
            
            if(this.closeButton !== undefined) {
                this.closeButton.remove();
            }
            
            if(this.infoButton !== undefined) {
                this.infoButton.remove();
            }
        };
        
        // ---------------------------------------------------------------------------
        // panel functions
        // ---------------------------------------------------------------------------
        this.setTitle = function(title) {
        	assert.isTrue(this.canShowTitle);
        	
            this.title.setText(title);
        };
        
        this.setContent = function(contentProvider) {
            this.contentProvider = contentProvider;
            
            if(contentProvider.getTitle !== undefined) {
            	this.setTitle(contentProvider.getTitle());
            }
            
            this.content.setContent(contentProvider.getMainElement());
        };
        
        this.onCloseClick = function(source) {
            var self = source.parent;
            if (self.onClose !== undefined) {
            	self.onClose();
            }
        };
        
        this.onInfoClick = function(source) {
            var self = source.parent;

            if (self.onInfo !== undefined) {
            	self.onInfo();
            }
        };
    };
    
    return {
        create: function(id) { return new Panel(id); }
    };
    
});