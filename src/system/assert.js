define(function() {

	function Assert() {
		this.isDefined = function(arg, msg) {
			if(Crystal.isDebug === false){
				return;
			}
			
			console.assert(arg !== undefined, msg);
		};
		
		this.isUndefined = function(arg, msg) {
			if(Crystal.isDebug === false){
				return;
			}
			
			console.assert(arg === undefined, msg);
		};
		
		this.isTrue = function(eval, msg) {
			if(Crystal.isDebug === false){
				return;
			}
			
			console.assert(eval === true, msg);
		};
		
		this.isFalse = function(eval, msg) {
			if(Crystal.isDebug === false){
				return;
			}
			
			console.assert(eval === false, msg);
		};
	}
	
	return new Assert();
	
});