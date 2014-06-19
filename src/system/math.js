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
    
    function Math() {
        this.point = function(x, y) {
            return new Point(x, y);
        };
        
        this.rect = function(x, y, w, h) {
            return new Rect(x, y, w, h);
        };
    };
    
    return new Math();
    
});