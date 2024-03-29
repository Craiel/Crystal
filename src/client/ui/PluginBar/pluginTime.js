declare("PluginTime", function() {
	include("Log");
	include("CoreUtils");
	include("Settings");
	include("Element");
	include("PluginBar");
	include("SaveKeys");
    
    PluginTime.prototype = element.create();
    PluginTime.prototype.$super = parent;
    PluginTime.prototype.constructor = PluginTime;
    
    function PluginTime(id) {
        this.id = id;

        this.setTemplate("pluginTime");
        
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
            
            // Todo or remove...
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }

            // Update the time
            var host = this.getMainElement();
            var localTime = currentTime.getTime(true);
            var timeString = coreUtils.getTimeDisplay(localTime, settings[saveKeys.idnUse24HourTime]);
            host.find('div').text(timeString);
        };
    };
    
    return {
        name: 'Time',
        description: StrLoc('Shows the current time'),
        
        create: function(id) { return new PluginTime(id); }
    };
    
});
