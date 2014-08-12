define(function(require) {
    var log = require("log");
    var save = require("save");
    var data = require("data");
    var assert = require("assert");
    var settings = require("settings");
    var gameModule = require("game/gameModule");
    
    ModuleSynthesize.prototype = gameModule.create();
    ModuleSynthesize.prototype.$super = parent;
    ModuleSynthesize.prototype.constructor = ModuleSynthesize;
    
    function ModuleSynthesize() {
    	this.id = "ModuleSynthesize";
    	
    	this.minAutoInterval = 250;
    	this.currentSynthesizeResult = 0;
    	
    	save.register(this, StrSha('lastAutoSynthesize')).asNumber(0);
    	
    	save.register(this, StrSha('autoInterval')).asNumber(60000);
    	save.register(this, StrSha('basePerAuto')).asNumber(0);
    	save.register(this, StrSha('basePerManual')).asNumber(1);
    	save.register(this, StrSha('currency')).asNumber(0);
    	
    	save.register(this, StrSha('upgradesBought')).asJsonArray().withCallback(false, true, true);
    	save.register(this, StrSha('techResearched')).asJsonArray().withCallback(false, true, true);
    	
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
        	if(this.lastAutoSynthesize === undefined || this.lastAutoSynthesize + this.autoInterval <= currentTime.getTime()) {
        		this.lastAutoSynthesize = currentTime.getTime();
        		this.autoSynthesize();
        	}
        };
        
        this.remove = function() {
            this.moduleRemove();
        };
        
        // ---------------------------------------------------------------------------
        // synth functions
        // ---------------------------------------------------------------------------
        this.autoSynthesize = function() {
        	var value = this.basePerAuto * this.multiplier;
        	
        	// Todo: apply bonus etc
        	
        	
        	settings.addStat(data.EnumStatSynthAutoGain, value);
        	settings.addStat(data.EnumStatSynthAuto);
        	this.addSynthesizeResult(value);
        };
        
        this.manualSynthesize = function() {
        	var value = this.basePerManual * this.multiplier;
        	
        	settings.addStat(data.EnumStatSynthManualGain, value);
        	settings.addStat(data.EnumStatSynthManual);
        	this.addSynthesizeResult(value);
        };
        
        // Return the current synth result count and reset
        this.getCurrentSynthesizeResult = function() {
        	var result = this.currentSynthesizeResult;
        	this.currentSynthesizeResult = 0;
        	return result;
        };
        
        this.addSynthesizeResult = function(value) {
        	if(value === undefined || value <= 0) {
        		return;
        	}
        	        	
        	this.currency += value;
        	this.currentSynthesizeResult += value;
        };
    }
    
    return {
        create: function() { return new ModuleSynthesize(); }
    };
});