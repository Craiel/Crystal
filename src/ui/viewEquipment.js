define(function(require) {
    var $ = require('jquery');
    var log = require("log");
    var utils = require("utils");
    var element = require("ui/controls/element");
    var settings = require("settings");
    var templates = require("data/templates");
    
    ViewEquipment.prototype = element.create();
    ViewEquipment.prototype.$super = parent;
    ViewEquipment.prototype.constructor = ViewEquipment;
    
    function ViewEquipment(id) {
        this.id = id;
        
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

            // Todo
        };
        
        this.update = function(currentTime) {
            if(this.elementUpdate(currentTime) === false) {
                return;
            }
            
            // Todo
        };
        
        // ---------------------------------------------------------------------------
        // statistics functions
        // ---------------------------------------------------------------------------
        this.getTitle = function() {
            return StrLoc("Equipment");
        };
    };
    
    return {
        create: function(id) { return new ViewEquipment(id); }
    };
    
});