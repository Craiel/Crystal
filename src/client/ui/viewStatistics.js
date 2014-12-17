declare("ViewStatistics", function() {
	include("$");
	include("Log");
	include("CoreUtils");
	include("Static");
	include("Element");
	include("Settings");
	include("SaveKeys");
	include("TemplateProvider");
        
    var getStatDisplayFormatter = function(key) {
        switch(key) {
            case static.EnumAutoSaveCount: return coreUtils.formatters[settings[saveKeys.idnNumberFormatter]];
            case static.EnumStatGameLoadCount: return coreUtils.formatters[settings[saveKeys.idnNumberFormatter]];
            case static.EnumStatPlayTime: return function(n) { return coreUtils.getDurationDisplay(n); };
            case static.EnumStatSessionCount: return coreUtils.formatters[settings[saveKeys.idnNumberFormatter]];
            default: return coreUtils.formatRaw;
        }
    };
    
    ViewStatistics.prototype = element.create();
    ViewStatistics.prototype.$super = parent;
    ViewStatistics.prototype.constructor = ViewStatistics;
    
    function ViewStatistics(id) {
        this.id = id;

        this.setTemplate("viewStatistics");
        
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
            
            for(var key in static.stats) {
            	var stat = static.stats[key];
                var template = templateProvider.GetTemplate(this.id+'Entry', {id: this.id + '_T' + key, name: stat.name});
                this.entriesTotal[key] = $(template);
                totalContent.append(this.entriesTotal[key]);
                
                template = templateProvider.GetTemplate(this.id+'Entry', {id: this.id + '_S' + key, name: stat.name});
                this.entriesSession[key] = $(template);
                sessionContent.append(this.entriesSession[key]);
            }
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            for(var key in static.stats) {
            	var stat = static.stats[key];;
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
