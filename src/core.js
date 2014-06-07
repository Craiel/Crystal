define(["system/component"], function() {
    
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
});