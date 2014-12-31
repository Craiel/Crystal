declare("Assert", function() {

    function Assert() {
        this.assertCount = 0;

        this.isDefined = function(arg, msg) {
            if(Crystal.isDebug === false){
                return;
            }

            if(arg === undefined) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isUndefined = function(arg, msg) {
            if(Crystal.isDebug === false){
                return;
            }

            if(arg !== undefined) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isTrue = function(eval, msg) {
            if(Crystal.isDebug === false){
                return;
            }

            if(eval === false) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isFalse = function(eval, msg) {
            if(Crystal.isDebug === false){
                return;
            }

            if(eval === true) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isNumber = function(arg, msg) {
            if($.isNumeric(arg)) {
                return;
            }

            this.assertCount++;
            console.assert(false, msg);
        };

        this.hasAsserted = function() {
            return this.assertCount > 0;
        };
    }
    
    return new Assert();
    
});