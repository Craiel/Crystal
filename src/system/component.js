define(function(require) {
    var assert = require("assert");
    
    if(Crystal.isDebug === true) {
        idCheck = {};
    }
    
    function Component() {
        this.initDone = false;
        this.updateTime = 0;
        this.updateInterval = 0;
        
        this.enabled = true;
        this.invalidated = true;
        this.updateWhenNeededOnly = false;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            assert.isDefined(this.id, "Component needs valid Id");
            
            if(Crystal.isDebug === true) {
                assert.isUndefined(idCheck[this.id], "Duplicate ID: " + this.id);
                idCheck[this.id] = true;
            }
            
            Crystal.componentInitCount++;
            
            this.initDone = true;
        };
        
        this.update = function(currentTime) {
            assert.isTrue(this.initDone, "Init must be called before update!");
            
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
            
            Crystal.componentUpdateList.push(this.id);
            Crystal.componentUpdateCount++;
            
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