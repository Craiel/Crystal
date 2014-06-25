define(function(require) {
    var statistics = require("system/statistics");
    var save = require("save");
    
    // ---------------------------------------------------------------------------
    // settings object
    // ---------------------------------------------------------------------------
    function Settings() {
        this.id = "settings";
        
        this.stats = {
            autoSaveCount: 1,
            gameLoadCount: 2
        };
        
        this.totalStats = statistics.create(this.id + '_t', true); // total stats are persistent
        this.sessionStats = statistics.create(this.id + '_s');
    
        save.register(this, 'isNewGame').asBool(true);
        
        save.register(this, 'autoSaveEnabled').asBool(true).persistent();
        save.register(this, 'autoSaveInterval').asNumber(60 * 1000).persistent();
        
        save.register(this, 'savedVersion').asFloat().persistent();
        
        // UI Settings
        save.register(this, 'optionStatisticsActive').asBool();
    
        // ---------------------------------------------------------------------------
        // stats
        // ---------------------------------------------------------------------------
        this.addStat = function(key, value) {
            this.totalStats.add(key, value);
            this.sessionStats.add(key, value);
        };
    };
    
    // ---------------------------------------------------------------------------
    // Instance return
    // ---------------------------------------------------------------------------
    return new Settings();
});
