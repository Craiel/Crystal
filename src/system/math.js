define(function(require) {
    var log = require("log");
    var assert = require("assert");
    
    function Point(x, y) {
        this.x = x;
        this.y = y;
        
        this.isValid = function() {
            return this.x !== undefined && this.y !== undefined;
        };
    }
    
    function Rect(x, y, w, h) {
        this.position = new Point(x, y);
        this.size = new Point(w, h);
        
        this.isValid = function() {
            return this.position.isValid() && this.size.isValid();
        };
    }
    
    function MathExtension() {
    	
    	// Limiting most numbers to 1.000.000.000.000.000, which is the highest "pretty" number that still guarantees precision
    	this.maxInteger = 1000000000000000;
    	this.minInteger = -this.maxInteger;
    	
    	this.maxNumber = Number.MAX_VALUE;
    	this.minNumber = Number.MIN_VALUE;
    	    	
        this.point = function(x, y) {
            return new Point(x, y);
        };
        
        this.rect = function(x, y, w, h) {
            return new Rect(x, y, w, h);
        };
        
        this.safeAdd = function(originalValue, addValue) {
        	assert.isDefined(addValue);
        	assert.isDefined(originalValue);
        	assert.isTrue(!isNan(addValue), StrLoc("Value to add can't be NaN"));
        	assert.isTrue(addValue > 0, StrLoc("Value to add needs to be positive, use safeRemove otherwise"));
        	
        	var newValue = originalValue + addValue;
        	if(newValue > this.maxInteger) {
        		log.warning(StrLoc("SafeAdd: Lost value in add, number exceeded max!"));
        		return this.maxInteger;
        	}
        	
        	return newValue;
        };
        
        this.safeRemove = function(originalValue, removeValue) {
        	assert.isDefined(removeValue);
        	assert.isDefined(originalValue);
        	assert.isTrue(!isNan(removeValue), StrLoc("Value to remove can't be NaN"));
        	assert.isTrue(removeValue < 0, StrLoc("Value to remove needs to be negative, use safeAdd otherwise"));
        	
        	var newValue = originalValue - removeValue;
        	if(newValue < this.minInteger) {
        		log.warning(StrLoc("SafeRemove: Lost value in remove, number exceeded min!"));
        		return this.minInteger;
        	}
        	
        	return newValue;
        };
    };
    
    return new MathExtension();
    
});