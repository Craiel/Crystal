define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var element = require("ui/element");
    var settings = require("settings");
    var templates = require("data/templates");
    
    var getStatDisplayName = function(key) {
        switch(key) {
            case settings.stats.autoSaveCount: return 'Auto save count';
            case settings.stats.gameLoadCount: return 'Game load count';
            default: return 'ERR_' + key;
        }
    };
    
    StatisticsView.prototype = element.create();
    StatisticsView.prototype.$super = parent;
    StatisticsView.prototype.constructor = StatisticsView;
    
    function StatisticsView(id) {
        this.id = id;
        
        this.entriesTotal = {};
        this.entriesSession = {};
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        this.elementUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent) {
            this.elementInit(parent);
            
            var totalContent = this.getMainElement().find('#'+this.id+'_totalContent');
            var sessionContent = this.getMainElement().find('#'+this.id+'_sessionContent');
            
            for(var statKey in settings.stats) {
                var key = settings.stats[statKey];
                var template = templates.GetTemplate(this.id+'Entry', {id: this.id + '_T' + key, name: getStatDisplayName(key)});
                this.entriesTotal[key] = $(template);
                totalContent.append(this.entriesTotal[key]);
                
                template = templates.GetTemplate(this.id+'Entry', {id: this.id + '_S' + key, name: getStatDisplayName(key)});
                this.entriesSession[key] = $(template);
                sessionContent.append(this.entriesSession[key]);
            }
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            for(var statKey in settings.stats) {
                var key = settings.stats[statKey];
                var value = settings.totalStats.get(key);
                
                if(value === undefined || value === 0) {
                    this.entriesTotal[key].hide();
                    this.entriesSession[key].hide();
                } else {
                    this.entriesTotal[key].show();
                    this.entriesSession[key].show();
                    
                    this.getMainElement().find('#' + this.id + '_T' + key + '_value').text(value);
                    this.getMainElement().find('#' + this.id + '_S' + key + '_value').text(value);
                }
            }
        };
        
        
    };
    
    return {
        create: function(id) { return new StatisticsView(id); }
    };
    
});