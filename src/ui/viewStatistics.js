define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var utils = require("utils");
    var data = require("data");
    var element = require("ui/controls/element");
    var settings = require("settings");
    var templates = require("data/templates");
        
    var getStatDisplayFormatter = function(key) {
        switch(key) {
            case data.EnumAutoSaveCount: return settings.getNumberFormatter();
            case data.EnumStatGameLoadCount: return settings.getNumberFormatter();
            case data.EnumStatPlayTime: return function(n) { return utils.getDurationDisplay(n); };
            case data.EnumStatSessionCount: return settings.getNumberFormatter();
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
            
            for(var key in data.stats) {
            	var stat = data.stats[key];
                var template = templates.GetTemplate(this.id+'Entry', {id: this.id + '_T' + key, name: stat.name});
                this.entriesTotal[key] = $(template);
                totalContent.append(this.entriesTotal[key]);
                
                template = templates.GetTemplate(this.id+'Entry', {id: this.id + '_S' + key, name: stat.name});
                this.entriesSession[key] = $(template);
                sessionContent.append(this.entriesSession[key]);
            }
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            for(var key in data.stats) {
            	var stat = data.stats[key];;
                var value = settings.totalStats.get(key);
                var formatter = getStatDisplayFormatter(parseInt(key));
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
        	return StrLoc("Statistics");
        };
    };
    
    return {
        create: function(id) { return new ViewStatistics(id); }
    };
    
});