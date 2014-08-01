define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var utils = require("utils");
    var element = require("ui/controls/element");
    var settings = require("settings");
    var templates = require("data/templates");
    
    var getStatDisplayName = function(key) {
        switch(key) {
            case settings.stats.autoSaveCount: return 'Auto save count';
            case settings.stats.gameLoadCount: return 'Game load count';
            case settings.stats.playTime: return 'Played time';
            case settings.stats.sessionCount: return 'Sessions';
            default: return 'ERR_' + key;
        }
    };
    
    var getStatDisplayFormatter = function(key) {
        switch(key) {
            case settings.stats.autoSaveCount: return settings.getNumberFormatter();
            case settings.stats.gameLoadCount: return settings.getNumberFormatter();
            case settings.stats.playTime: return function(n) { return utils.getDurationDisplay(n); };
            case settings.stats.sessionCount: return settings.getNumberFormatter();
            default: return utils.formatRaw;
        }
    };
    
    ViewStatistics.prototype = element.create();
    ViewStatistics.prototype.$super = parent;
    ViewStatistics.prototype.constructor = ViewStatistics;
    
    function ViewStatistics(id) {
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
                var formatter = getStatDisplayFormatter(key);
                var formattedValue = formatter(value);
                
                if(value === undefined || value === 0) {
                    this.entriesTotal[key].hide();
                    this.entriesSession[key].hide();
                } else {
                    this.entriesTotal[key].show();
                    this.entriesSession[key].show();
                    
                    this.getMainElement().find('#' + this.id + '_T' + key + '_value').text(formattedValue);
                    this.getMainElement().find('#' + this.id + '_S' + key + '_value').text(formattedValue);
                }
            }
        };
        
        // ---------------------------------------------------------------------------
        // statistics functions
        // ---------------------------------------------------------------------------
        this.getTitle = function() {
        	return "Statistics";
        };
    };
    
    return {
        create: function(id) { return new ViewStatistics(id); }
    };
    
});