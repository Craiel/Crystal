define(["system/component"], function() {
	
	Crystal.isDebug = true;
	
	// For compatibility between older versions:
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    							   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
});