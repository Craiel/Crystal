define(function(require) {
    var save = require("save");
    var assert = require("assert");
    
    // ---------------------------------------------------------------------------
    // statistic object
    // ---------------------------------------------------------------------------
    function Statistics(id, persistent) {
        this.id = id;
        
        var mapping = save.register(this, StrSha('stats')).asJson();
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
            
            if(this.stats[key] === undefined) {
                this.stats[key] = 0;
            }
            
            this.stats[key] += count;
        };
        
        this.get = function(key) {
            return this.stats[key];
        };
    };
    
    return {
        create: function(id) { return new Statistics(id); }
    };
});
