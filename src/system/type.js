define(function(require) {
    var $ = require("jquery");
    var log = require("log");
    var assert = require("assert");
    var utils = require("utils");
    
    var objectConstructor = {}.constructor;    
    
    // ---------------------------------------------------------------------------
    // main type object
    // ---------------------------------------------------------------------------
    function Type() {
        this.dataType = {
                string: 1,
                number: 2,
                float: 3,
                bool: 4,
                json: 5,
                jsonArray: 6,
            };
        
        this.isValueOfType = function(value, type) {
            if(value === undefined || value === NaN) {
                return false;
            }
            
            switch(type) {
                case this.dataType.string: return typeof value === "string";
                case this.dataType.number: return $.isNumeric(value) && value % 1 == 0;
                case this.dataType.float: return $.isNumeric(value);
                case this.dataType.bool: return typeof value === "boolean";
                case this.dataType.json: return value.constructor === objectConstructor;
                case this.dataType.jsonArray: return Array.isArray(value);
                
                default: throw new Error("isValueOfType not implemented for " + type);
            }
        };
        
        this.getDefaultValueByType = function(type) {
            switch(type) {
                case this.dataType.string: undefined;
                case this.dataType.number: return 0;
                case this.dataType.float: return 0;
                case this.dataType.bool: return false;
                case this.dataType.json: return {};
                case this.dataType.jsonArray: return [];
                
                default: throw new Error("getDefaultValueByType not implemented for " + type);
            }
        };
        
        this.getReadValueByType = function(value, type) {
            // Check if the value is already correct, no conversion needed
            if(this.isValueOfType(value, type) === true) {
                return value;
            }
            
            switch(type) {
                case this.dataType.string: return value.toString();
                case this.dataType.number: return parseInt(value, 10);
                case this.dataType.float: return parseFloat(value);
                case this.dataType.bool: return value === "1";
                case this.dataType.json: {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        utils.logError("Failed to load JSON value: " + value + "\n" + e);
                    }
                }
                
                case this.dataType.jsonArray: {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        utils.logError("Failed to load JSON Array value: " + value + "\n" + e);
                    }
                }
            
                default: throw new Error("getReadValueByType not implemented for " + type);
            }
        };
        
        this.getWriteValueByType = function(value, type) {
            // Check if the value is already correct, no conversion needed
            if(this.isValueOfType(value, type) !== true) {
                throw new Error("getWriteValueByType arguments mismatch: '" + value + "' as '" + type + "'");
            }
            
            switch(type) {
                case this.dataType.string: return value;
                case this.dataType.number: return value.toString();
                case this.dataType.float: return value.toString();
                case this.dataType.bool: return value === true ? "1" : "0";
                case this.dataType.json: return JSON.stringify(value);
                case this.dataType.jsonArray: return JSON.stringify(value);
            
                default: throw new Error("getWriteValueByType not implemented for " + type);
            }
        };
    }
    
    return new Type();
    
});