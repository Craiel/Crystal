declare("Save", function(require) {
    include("$");
    include("Enums");
    include("Log");
    include("Assert");
    include("Utils");
    include("Type");
    
    // ---------------------------------------------------------------------------
    // save mapping entry, internal use only
    // ---------------------------------------------------------------------------
    function SaveMapping(host, name) {
        this.host = host;
        this.name = name;
        this.type = type.EnumDataTypeString;
        this.defaultValue = undefined;
        this.isPersistent = false;
        this.saveCallback = false;
        this.loadCallback = false;
        this.resetCallback = false;
        
        // ---------------------------------------------------------------------------
        // setting functions
        // ---------------------------------------------------------------------------
        this.asNumber = function(defaultValue) {
            this.type = type.EnumDataTypeNumber;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asFloat = function(defaultValue) {
            this.type = type.EnumDataTypeFloat;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asBool = function(defaultValue) {
            this.type = type.EnumDataTypeBool;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJson = function(defaultValue) {
            this.type = type.EnumDataTypeJson;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJsonArray = function(defaultValue) {
            this.type = type.EnumDataTypeJsonArray;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.withDefault = function(value) {
        	assert.isDefined(value);
        	var formattedValue = type.getReadValueByType(value, this.type);
        	assert.isDefined(formattedValue, StrLoc("Default value {0} did not match the selected mapping type {1}").format(value, this.type));
            
            this.defaultValue = type.getReadValueByType(value, this.type);
            this.host[this.name] = value;
            return this;
        };
        
        this.persistent = function(value) {
            if(value !== undefined && value !== true && value !== false) {
                throw new Error(StrLoc("Invalid argument for persistent: {0}").format(value));
            }
            
            this.isPersistent = value || true;
            return this;
        };
        
        this.withCallback = function(saveCallback, loadCallback, resetCallback) {
            this.saveCallback = saveCallback;
            this.loadCallback = loadCallback;
            this.resetCallback = resetCallback;
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
        	assert.isDefined(value);
        	var formattedValue = type.getReadValueByType(value, this.type);
        	assert.isDefined(formattedValue, StrLoc("Value {0} did not match the selected mapping type {1}").format(value, this.type));
            
            this.host[this.name] = formattedValue;
        };
        
        this.resetToDefault = function(ignorePersistent) {
            if(ignorePersistent !== true && this.isPersistent) {
                return;
            }
            
            this.host[this.name] = this.defaultValue;
        };
        
        this.callbackSave = function() {
            if(this.saveCallback === false) {
                return;
            }
            
            if(this.host.onSave === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onSave: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onSave();
        };
        
        this.callbackLoad = function() {
            if(this.loadCallback === false) {
                return;
            }
            
            if(this.host.onLoad === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onLoad: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onLoad();
        };
        
        this.callbackReset = function() {
            if(this.resetCallback === false) {
                return;
            }
            
            if(this.host.onReset === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onReset: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onReset();
        };
        
        // ---------------------------------------------------------------------------
        // internal functions
        // ---------------------------------------------------------------------------
        this._updateDefaultByType = function() {
            this.defaultValue = type.getDefaultValueByType(this.type);
            this.host[this.name] = this.defaultValue;
        };
    };
    
    // ---------------------------------------------------------------------------
    // main save object
    // ---------------------------------------------------------------------------
    function Save() {
        
        this.mappings = [];
        
        this.stateName = "undefined";
        this.stateSlot = 1;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.save = function() {
            var data = {};

            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                var key = mapping.getKey();
                
                var value = undefined;
                try
                {
                	value = type.getWriteValueByType(mapping.getValue(), mapping.type);                	
                } catch(e) {
                	log.error(StrLoc("Could not get write value for {0}").format(key));
                	console.log(mapping.getValue());
                	throw e;
                }
                
                log.debug(StrLoc("SaveMapping: {0} -> {1}").format(key, value));
                data[key] = value;
                
                // Call the callback if present
                mapping.callbackSave();
            }
                    	
            // Transfer the save into the storage slot
        	var compressedData = utils.lzwEncode(utils.utf8Encode(JSON.stringify(data)));
        	var storageKey = this.getStorageKey();
        	localStorage[storageKey] = compressedData;
            
            log.debug(StrLoc("Saved {0}  bytes, now at {1} bytes used").format(compressedData.length, this.getLocalStorageSize()));
        };

        this.load = function() {
        	var data = {};
            var storageKey = this.getStorageKey();
            var compressedData = localStorage[storageKey];
            if(compressedData !== undefined) {
            	log.debug(StrLoc("Loaded {0} bytes").format(compressedData.length));
            	data = JSON.parse(utils.utf8Decode(utils.lzwDecode(compressedData)));
            }
            
            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                var key = mapping.getKey();
                
                log.debug(StrLoc("LoadMapping: {0} -> {1}").format(key, data[key]));
                if(data[key] === undefined) {
                    continue;
                }
                
                var value = type.getReadValueByType(data[key], mapping.type);                
                mapping.setValue(value);
                
                mapping.callbackLoad();
            }
            
            log.debug(StrLoc("Loaded {0} bytes").format(this.getLocalStorageSize()));
        };
    
        this.reset = function(fullReset) {
            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                mapping.resetToDefault(fullReset);
                
                mapping.callbackReset();
            }
            
            log.debug(StrLoc("Reset done, full={0}").format(fullReset));
        };
        
        // ---------------------------------------------------------------------------
        // utility functions
        // ---------------------------------------------------------------------------
        this.getStorageKey = function() {
        	return this.stateName + "_" + this.stateSlot.toString();
        };
        
        this.register = function(host, name) {
            assert.isDefined(host);
            assert.isDefined(host.id, StrLoc("Host needs to have an id for saving state"));
            assert.isDefined(name);
            
            // Clear out the hosts value on register
            host[name] = undefined;
            
            // Create a setter and getter method
            var capitalName = utils.capitalizeString(name);
            var getterName = 'get' + capitalName;
            var setterName = 'set' + capitalName;
            
            assert.isUndefined(host[getterName]);
            assert.isUndefined(host[setterName]);

            host[getterName] = function(host, name) { return host[name]; }.bind(undefined, host, name);
            host[setterName] = function(host, name, value) { host[name] = value; }.bind(undefined, host, name);
            
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