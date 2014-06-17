define(function(require) {
    var $ = require("jquery");
    var enums = require("enums");
    var log = require("log");
    var assert = require("assert");
    var utils = require("utils");
    var type = require("type");
    
    // ---------------------------------------------------------------------------
    // save mapping entry, internal use only
    // ---------------------------------------------------------------------------
    function SaveMapping(host, name) {
        this.host = host;
        this.name = name;
        this.type = undefined;
        this.defaultValue = undefined;
        this.isPersistent = false;
        this.saveCallback = false;
        this.loadCallback = false;
        this.resetCallback = false;
        
        // ---------------------------------------------------------------------------
        // setting functions
        // ---------------------------------------------------------------------------
        this.asNumber = function(defaultValue) {
            this.type = type.dataType.number;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asFloat = function(defaultValue) {
            this.type = type.dataType.float;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asBool = function(defaultValue) {
            this.type = type.dataType.bool;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJson = function(defaultValue) {
            this.type = type.dataType.json;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJsonArray = function(defaultValue) {
            this.type = type.dataType.jsonArray;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.withDefault = function(value) {
            assert.isTrue(type.isValueOfType(value, this.type), "Default value did not match the selected mapping type");
            
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
            assert.isTrue(type.isValueOfType(value, this.type), "Default value did not match the selected mapping type");
            
            this.host[this.name] = value;
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
            
            this.host.onSave();
        };
        
        this.callbackLoad = function() {
            if(this.loadCallback === false) {
                return;
            }
            
            this.host.onLoad();
        };
        
        this.callbackReset = function() {
            if(this.resetCallback === false) {
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
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.save = function() {
            var data = {};

            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                var key = mapping.getKey();
                            
                var value = type.getWriteValueByType(mapping.getValue(), mapping.type);
                log.debug("SaveMapping: "+key+" -> "+value);
                data[key] = value;
                
                // Call the callback if present
                mapping.callbackSave();
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
                
                var value = type.getReadValueByType(data[key], mapping.type);
                mapping.setValue(value);
                
                mapping.callbackLoad();
            }
            
            log.debug("Loaded "+this.getLocalStorageSize()+" bytes");
        };
    
        this.reset = function(fullReset) {
            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                mapping.resetToDefault(fullReset);
                
                mapping.callbackReset();
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