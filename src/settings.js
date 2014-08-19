declare("Settings", function() {
    include("Save");
    include("Utils");
    include("Assert");
    include("Statistics");
    include("SaveKeys");
    
    // ---------------------------------------------------------------------------
    // settings object
    // ---------------------------------------------------------------------------
    function Settings() {
        this.id = "settings";
               
        // total stats are persistent
        this.totalStats = statistics.create(this.id + '_t', true);
        
        this.sessionStats = statistics.create(this.id + '_s');
        
        save.register(this, saveKeys.idnIsNewGame).asBool(true);
        
        save.register(this, saveKeys.idnAutoSaveEnabled).asBool(true).persistent();
        save.register(this, saveKeys.idnAutoSaveInterval).asNumber(60 * 1000).persistent();
        
        save.register(this, saveKeys.idnSavedVersion).asFloat().persistent();
        
        save.register(this, saveKeys.idnNumberFormatter).withDefault('raw').persistent();
        
        save.register(this, saveKeys.idnUse24HourTime).asBool(true).persistent();
        
        save.register(this, saveKeys.idnActiveModule).asNumber();
        
        // UI Settings
        save.register(this, saveKeys.idnOptionStatisticsActive).asBool();
        save.register(this, saveKeys.idnOptionEquipmentActive).asBool();
        save.register(this, saveKeys.idnOptionInventoryActive).asBool();
    
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
        
        this.getCurrentNumberFormatter = function() {
            assert.isDefined(this[saveKeys.idnNumberFormatter]);
            assert.isDefined(utils.formatters[this[saveKeys.idnNumberFormatter]]);
            return utils.formatters[this[saveKeys.idnNumberFormatter]];
        };
    };
    
    // ---------------------------------------------------------------------------
    // Instance return
    // ---------------------------------------------------------------------------
    return new Settings();
});
