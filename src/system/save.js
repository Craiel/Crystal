define(function(require) {
	var $ = require("jquery");
	var enums = require("enums");
	var log = require("log");
	var assert = require("assert");
	var utils = require("utils");
	
	var objectConstructor = {}.constructor;
	
	var dataType = {
			string: 1,
			number: 2,
			float: 3,
			bool: 4,
			json: 5,
		};
	
	function isValueOfType(value, type) {
		if(value === undefined || value === NaN) {
			return false;
		}
		
		switch(type) {
			case dataType.string: return typeof value === "string";
			case dataType.number: return $.isNumeric(value) && value % 1 == 0;
			case dataType.float: return $.isNumeric(value);
			case dataType.bool: return typeof value === "boolean";
			case dataType.json: return value.constructor === objectConstructor;
			
			default: throw new Error("isValueOfType not implemented for " + type);
		}
	};
	
	function getDefaultValueByType(type) {
		switch(type) {
			case dataType.string: undefined;
			case dataType.number: return 0;
			case dataType.float: return 0;
			case dataType.bool: return false;
			case dataType.json: return {};
			
			default: throw new Error("getDefaultValueByType not implemented for " + type);
		}
	};
	
	function getReadValueByType(value, type) {
		// Check if the value is already correct, no conversion needed
		if(isValueOfType(value, type)) {
			return value;
		}
		
		switch(type) {
			case dataType.string: return value.toString();
			case dataType.number: return parseInt(value, 10);
			case dataType.float: return parseFloat(value);
			case dataType.bool: return value === "1";
			case dataType.json: {
				try {
					return JSON.parse(value);					
				} catch (e) {
					utils.logError("Failed to load JSON value: " + value + "\n" + e);
				}
			}
		
			default: throw new Error("getReadValueByType not implemented for " + type);
		}
	};
	
	function getWriteValueByType(value, type) {
		// Check if the value is already correct, no conversion needed
		if(!isValueOfType(value, type)) {
			throw new Error("getWriteValueByType arguments mismatch: '" + value + "' as '" + type + "'");
		}
		
		switch(type) {
			case dataType.string: return value;
			case dataType.number: return value.toString();
			case dataType.float: return value.toString();
			case dataType.bool: return value === true ? "1" : "0";
			case dataType.json: return JSON.stringify(value);
		
			default: throw new Error("getWriteValueByType not implemented for " + type);
		}
	};
	
	// ---------------------------------------------------------------------------
    // save mapping entry, internal use only
    // ---------------------------------------------------------------------------
	function SaveMapping(host, name) {
		this.host = host;
		this.name = name;
		this.type = undefined;
		this.defaultValue = undefined;
		this.isPersistent = false;
		
		// ---------------------------------------------------------------------------
	    // setting functions
	    // ---------------------------------------------------------------------------
		this.asNumber = function(defaultValue) {
			this.type = dataType.number;
			if(defaultValue !== undefined) {
				return this.withDefault(defaultValue);
			}
			
			this._updateDefaultByType();
			return this;
		};
		
		this.asFloat = function(defaultValue) {
			this.type = dataType.float;
			if(defaultValue !== undefined) {
				return this.withDefault(defaultValue);
			}
			
			this._updateDefaultByType();
			return this;
		};
		
		this.asBool = function(defaultValue) {
			this.type = dataType.bool;
			if(defaultValue !== undefined) {
				return this.withDefault(defaultValue);
			}
			
			this._updateDefaultByType();
			return this;
		};
		
		this.asJson = function(defaultValue) {
			this.type = dataType.json;
			if(defaultValue !== undefined) {
				return this.withDefault(defaultValue);
			}
			
			this._updateDefaultByType();
			return this;
		};
		
		this.withDefault = function(value) {
			assert.isTrue(isValueOfType(value, this.type), "Default value did not match the selected mapping type");
			
			this.defaultValue = value;
			this.host[this.name] = value;
			return this;
		};
		
		this.persistent = function(value) {
			if(value !== undefined && value !== true && value !== false) {
				throw new Error("Invalid argument for persistent: " + value);
			}
			
			this.isPersistent = value || true;
			return this;
		};
		
		// ---------------------------------------------------------------------------
	    // save functions
	    // ---------------------------------------------------------------------------
		this.getKey = function() {
			return this.host.id + '_' + this.name;
		};
		
		this.getValue = function() {
			return this.host[this.name];
		};
		
		this.setValue = function(value) {
			assert.isTrue(isValueOfType(value, this.type), "Default value did not match the selected mapping type");
			
			this.host[this.name] = value;
		};
		
		this.resetToDefault = function(ignorePersistent) {
			if(ignorePersistent !== true && this.isPersistent) {
				return;
			}
			
			this.host[this.name] = this.defaultValue;
		};
		
		// ---------------------------------------------------------------------------
	    // internal functions
	    // ---------------------------------------------------------------------------
		this._updateDefaultByType = function() {
			this.defaultValue = getDefaultValueByType(this.type);
			this.host[this.name] = this.defaultValue;
		};
	};
	
	// ---------------------------------------------------------------------------
    // main save object
    // ---------------------------------------------------------------------------
	function Save() {
		
		this.mappings = [];
		
		// ---------------------------------------------------------------------------
	    // main functions
	    // ---------------------------------------------------------------------------
		this.save = function() {
			var data = {};

			for(var i = 0; i < this.mappings.length; i++) {
	    		var mapping = this.mappings[i];
	    		var key = mapping.getKey();
	    		    		
	    		var value = getWriteValueByType(mapping.getValue(), mapping.type);
	    		log.debug("SaveMapping: "+key+" -> "+value);
	    		data[key] = value;
	    	}
			
			// Transfer the save into the storage
			for(var key in data) {
				localStorage[key] = data[key];
			}
			
			log.debug("Saved "+this.getLocalStorageSize()+" bytes");
	    };
	
	    this.load = function() {
	    	var data = {};
	    	for(var key in localStorage) {
	    		data[key] = localStorage[key];
	    	}
	    	
	    	for(var i = 0; i < this.mappings.length; i++) {
	    		var mapping = this.mappings[i];
	    		var key = mapping.getKey();
	    		
	    		log.debug("LoadMapping: "+key+" -> "+data[key]);
	    		if(data[key] === undefined) {
	    			continue;
	    		}
	    		
	    		var value = getReadValueByType(data[key], mapping.type);
	    		mapping.setValue(value);
	    	}
			
			log.debug("Loaded "+this.getLocalStorageSize()+" bytes");
	    };
	
	    this.reset = function(fullReset) {
	    	for(var i = 0; i < this.mappings.length; i++) {
	    		var mapping = this.mappings[i];
	    		mapping.resetToDefault(fullReset);
	    	}
			
			log.debug("Reset done, full="+fullReset);
	    };
	    
	    // ---------------------------------------------------------------------------
	    // utility functions
	    // ---------------------------------------------------------------------------
	    this.register = function(host, name) {
	    	assert.isDefined(host);
	    	assert.isDefined(host.id, "Host needs to have an id for saving state");
	    	assert.isDefined(name);
	    	
	    	// Clear out the hosts value on register
	    	host[name] = undefined;
	    	
	    	var mapping = new SaveMapping(host, name);
	    	this.mappings.push(mapping);
	    	return mapping;
	    };
	    
	    this.getLocalStorageSize = function() {
	    	var size = 3072; // General overhead for localstorage is around 3kb
	    	for(var entry in localStorage) {
	    		size += (entry.length + localStorage[entry].length) * 16;
	    	}
	    	
	    	return size;
	    };
	    
	    this.debugLocalStorage = function() {
	    	for(var entry in localStorage) {
	    		log.debug(entry + ": " + localStorage[entry].length);
	    	}
	    };
	}
	
	return new Save();
	
});