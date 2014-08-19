declare("Statistics", function() {
	include("Save");
    include("Assert");
    include("SaveKeys");
    
    // ---------------------------------------------------------------------------
    // statistic object
    // ---------------------------------------------------------------------------
    function Statistics(id, persistent) {
        this.id = id;
                
        var mapping = save.register(this, saveKeys.idnStats).asJson();
        if(persistent) {
            mapping.persistent();
        }
        
        // ---------------------------------------------------------------------------
        // statistic functions
        // ---------------------------------------------------------------------------
        this.add = function(key, count) {
            assert.isDefined(key);
            
            if(count === undefined) {
                count = 1;
            } else {
                assert.isNumber(count);
            }
            
            if(this[saveKeys.idnStats][key] === undefined) {
                this[saveKeys.idnStats][key] = 0;
            }
            
            this[saveKeys.idnStats][key] += count;
        };
        
        this.get = function(key) {
            return this[saveKeys.idnStats][key];
        };
    };
    
    return {
        create: function(id) { return new Statistics(id); }
    };
});
