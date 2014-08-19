declare("GameModuleSynthesize", function() {
	include("Log");
	include("Save");
	include("Data");
	include("MathExtension");
	include("Assert");
	include("Settings");
	include("GameModule");
    
    ModuleSynthesize.prototype = gameModule.create();
    ModuleSynthesize.prototype.$super = parent;
    ModuleSynthesize.prototype.constructor = ModuleSynthesize;
    
    function ModuleSynthesize() {
    	this.id = "ModuleSynthesize";
    	
    	this.minAutoInterval = 250;
    	this.currentSynthesizeResults = [];
    	
    	this.manualCount = 0;
        this.manualInterval = 250;
        this.manualTime = undefined;
        
        this.idnLastAuthoSynthesize = StrSha('lastAutoSynthesize');
        this.idnAutoInterval = StrSha('autoInterval');
        this.idnBasePerAuto = StrSha('basePerAuto');
        this.idnBasePerManual = StrSha('basePerManual');
        this.idnManualLimit = StrSha('manualLimit');
        this.idnCurrency = StrSha('currency');
        this.idnPower = StrSha('power');        
        this.idnUpgradeState = StrSha('upgradeState');
        this.idnBuildingCount = StrSha('buildingCount');
    	
    	save.register(this, this.idnLastAuthoSynthesize).asNumber(0);    	
    	save.register(this, this.idnAutoInterval).asNumber(60000);
    	save.register(this, this.idnBasePerAuto).asNumber(0);
    	save.register(this, this.idnBasePerManual).asNumber(1);
    	save.register(this, this.idnManualLimit).asNumber(15);
    	save.register(this, this.idnCurrency).asNumber(0);
    	save.register(this, this.idnPower).asNumber(10);
    	
    	save.register(this, this.idnUpgradeState).asJsonArray().withCallback(false, true, true);
    	save.register(this, this.idnBuildingCount).asJsonArray().withCallback(false, true, true);
    	
    	// ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.moduleInit = this.init;
        this.moduleUpdate = this.update;
        this.moduleRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
        	this.moduleInit();
        	
        	log.debug(StrLoc(" ModuleSynthesize: {0}").format(this.id));
        	// Todo
        };
        
        this.update = function(currentTime) {
        	if(this.moduleUpdate(currentTime) === false) {
        		return false;
        	}
        	
        	// Check and perform the auto synthesize
        	if(this[this.idnLastAuthoSynthesize] === undefined || this[this.idnLastAuthoSynthesize] + this[this.idnAutoInterval] <= currentTime.getTime()) {
        		this[this.idnLastAuthoSynthesize] = currentTime.getTime();
        		this.autoSynthesize();
        	}
        	
        	if(this.manualTime === undefined || this.manualTime + this.manualInterval < currentTime.getTime()) {
            	this.manualTime = currentTime.getTime();
            	this.manualCount = 0;
            }
        };
        
        this.remove = function() {
            this.moduleRemove();
        };
        
        // ---------------------------------------------------------------------------
        // synth functions
        // ---------------------------------------------------------------------------
        this.autoSynthesize = function() {
        	var value = this[this.idnBasePerAuto] * this[this.idnMultiplier];
        	
        	// Todo: apply bonus etc        	
        	
        	settings.addStat(data.EnumStatSynthAutoGain, value);
        	settings.addStat(data.EnumStatSynthAuto);
        	this.addSynthesizeResult(value, data.EnumValueGainAuto);
        };
        
        this.manualSynthesize = function() {
        	if(this.manualCount >= this[this.idnManualLimit]) {
        		return;
        	}
        	
        	var value = this[this.idnBasePerManual] * this[this.idnMultiplier];
        	
        	settings.addStat(data.EnumStatSynthManualGain, value);
        	settings.addStat(data.EnumStatSynthManual);
        	this.addSynthesizeResult(value, data.EnumValueGainManual);
        	
        	this.manualCount++;
        };
        
        // Return the current synth results and reset
        this.getCurrentSynthesizeResults = function() {
        	var result = this.currentSynthesizeResults;
        	this.currentSynthesizeResults = [];
        	return result;
        };
        
        this.addSynthesizeResult = function(value, valueGainType) {
        	if(value === undefined || value <= 0) {
        		return;
        	}
        	
        	if(valueGainType === undefined) {
        		valueGainType = data.EnumValueGainUndefined;
        	}
        	
        	this.currency = mathExtension.safeAdd(this[this.idnCurrency], value);
        	this.currentSynthesizeResults.push({value: value, gainType: valueGainType});
        };
    }
    
    return {
        create: function() { return new ModuleSynthesize(); }
    };
});