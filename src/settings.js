define(function(require) {
    var save = require("save");
    var utils = require("utils");
    var assert = require("assert");
    var statistics = require("system/statistics");
    
    // ---------------------------------------------------------------------------
    // settings object
    // ---------------------------------------------------------------------------
    function Settings() {
        this.id = "settings";
        
        this.stats = {
            autoSaveCount: 1,
            gameLoadCount: 2,
            playTime: 3,
            sessionCount: 4,
        };
        
        this.totalStats = statistics.create(this.id + '_t', true); // total stats are persistent
        this.sessionStats = statistics.create(this.id + '_s');
    
        save.register(this, 'isNewGame').asBool(true);
        
        save.register(this, 'autoSaveEnabled').asBool(true).persistent();
        save.register(this, 'autoSaveInterval').asNumber(60 * 1000).persistent();
        
        save.register(this, 'savedVersion').asFloat().persistent();
        
        save.register(this, 'numberFormatter').withDefault('raw').persistent();
        
        // UI Settings
        save.register(this, 'optionStatisticsActive').asBool();
    
        // ---------------------------------------------------------------------------
        // stats
        // ---------------------------------------------------------------------------
        this.addStat = function(key, value) {
            this.totalStats.add(key, value);
            this.sessionStats.add(key, value);
        };
        
        this.getSessionStat = function(key) {
            return this.sessionStats[key];
        };
        
        this.getTotalStat = function(key) {
            return this.totalStats[key];
        };
        
        this.getNumberFormatter = function() {
            assert.isDefined(this.numberFormatter);
            assert.isDefined(utils.formatters[this.numberFormatter]);
            
            return utils.formatters[this.numberFormatter];
        };
    };
    
    // ---------------------------------------------------------------------------
    // Instance return
    // ---------------------------------------------------------------------------
    return new Settings();
});
