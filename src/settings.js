declare("Settings", function() {
    include("Save");
    include("Utils");
    include("Assert");
    include("Statistics");
    
    // ---------------------------------------------------------------------------
    // settings object
    // ---------------------------------------------------------------------------
    function Settings() {
        this.id = "settings";
               
        // total stats are persistent
        this.totalStats = statistics.create(this.id + '_t', true);
        
        this.sessionStats = statistics.create(this.id + '_s');
    
        save.register(this, StrSha('isNewGame')).asBool(true);
        
        save.register(this, StrSha('autoSaveEnabled')).asBool(true).persistent();
        save.register(this, StrSha('autoSaveInterval')).asNumber(60 * 1000).persistent();
        
        save.register(this, StrSha('savedVersion')).asFloat().persistent();
        
        save.register(this, StrSha('numberFormatter')).withDefault('raw').persistent();
        
        save.register(this, StrSha('use24hourTime')).asBool(true).persistent();
        
        save.register(this, StrSha('activeModule')).asNumber();
        
        // UI Settings
        save.register(this, StrSha('optionStatisticsActive')).asBool();
        save.register(this, StrSha('optionEquipmentActive')).asBool();
        save.register(this, StrSha('optionInventoryActive')).asBool();
    
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
