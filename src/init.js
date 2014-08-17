// set the main namespace
Crystal = {
		isDebug: true,
        componentUpdateList: [],
        componentUpdateCount: 0,
        componentInitCount: 0,
        resetFrame: function() {
            Crystal.componentUpdateList = [];
            Crystal.componentUpdateCount = 0;
        }
};

// Implement some handlers in debug mode
if(Crystal.isDebug) {
	var StrLoc = function(str) {
		return str;
	};
	var StrSha = function(str) {
		return str;
	};
	var require = function() {
		
	};
}

declare("$", jQuery);