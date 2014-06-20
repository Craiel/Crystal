define(function() {
    
    // set the main namespace
    Crystal = {
            componentUpdateList: [],
            componentUpdateCount: 0,
            componentInitCount: 0
    };
    
    // Set debug mode
    Crystal.isDebug = true;
    
    // For compatibility between older versions:
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
    // This will implement isArray if its not there, older browsers don't have it
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function(obj) {
            return Object.toString.call(obj) === '[object Array]';
        };
    };
    
    return {
        resetFrame: function() {
            Crystal.componentUpdateList = [];
            Crystal.componentUpdateCount = 0;
        }
    };
});