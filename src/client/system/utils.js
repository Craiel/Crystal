declare("Utils", function() {
	include("$");
    
    function Utils() {
                
        // ---------------------------------------------------------------------------
        // element and jquery functions
        // ---------------------------------------------------------------------------
        
        // NOTE: this will not work when running from disk, at least for chrome.
        //   Both rules lists will be null
        this.getDefinedClasses = function() {
            var definedClasses = [];
            for(var i = 0;i < document.styleSheets.length; i++) {
                var styleSheet = document.styleSheets[i];
                var classes = styleSheet.rules || styleSheet.cssRules;
                for(var n = 0; n < classes.length; n++) {
                    if($.inArray( classes[n], definedClasses ) >= 0) {
                        console.assert(false, StrLoc("Potential duplicate CSS: {0}").format(classes[n]));
                        continue;
                    }
                    
                    definedClasses.push(classes[n]);
                }
            }
            
            return definedClasses;
        };
        
        this.getUsedClasses = function(elementObject) {
            var usedList = [];
            var processQueue = [elementObject];
            while(processQueue.length > 0) {
                var current = processQueue.pop();
                
                var children = current.children();
                for(var i = 0;i < children.length; i++) {
                    processQueue.push($(children[i]));
                }
                
                var rawClasses = current.attr("class");
                if(rawClasses === undefined) {
                    continue;
                }
                
                var split = $.trim(rawClasses).replace(/\s+/g,' ').split(' ');
                for(var i = 0; i < split.length; i++) {
                    if($.inArray( split[i], usedList ) >= 0) {
                        continue;
                    }
                    
                    usedList.push(split[i]);
                }
            };
            
            return usedList;
        };
        
    };
        
    return new Utils();
});
