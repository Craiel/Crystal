define(function() {

    function Component() {
        
        this.updateTime = 0;
        this.updateInterval = 0;
        
        this.enabled = true;
        this.invalidated = true;
        this.updateWhenNeededOnly = false;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
        };
        
        this.update = function(currentTime) {
            if(this.enabled === false) {
                return false;
            }
            
            // If we don't need an update and we are only allowed to update then bail out
            if(this.invalidated === false && this.updateWhenNeededOnly === true) {
                return false;
            }
    
            // If we don't need an update and we are updating in intervals and our interval is not yet up, bail out
            if(this.invalidated === false && this.updateInterval > 0 && currentTime - this.updateTime < this.updateInterval) {
                return false;
            }
        
            this.updateTime = currentTime;
            this.invalidated = false;
            return true;
        };
        
        this.invalidate = function() {
            this.invalidated = true;
        };
    }
    
    return {
        create: function() { return new Component(); }
    };
    
});