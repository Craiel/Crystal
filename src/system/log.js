define(["enums", "utils"], function(enums, utils) {
        
    var level = {
            debug : 1,
            info : 2,
            error : 3,
            warning: 4,
        };
    
    var getLevelDisplay = function(level) {
        switch(level) {
            case level.info: {
                return "INFO";
                break;
            };
            
            case level.error: {
                return "ERROR";
                break;
            };
            
            case level.warning: {
                return "WARNING";
                break;
            };
            
            case level.debug: {
                return "DEBUG";
                break;
            };
        };
    };
    
    var logFormat = function(time, level, message) {
        var time = '[' + utils.getShortTimeDisplay(time || Date.now()) + ']: ';
        var fullMessage = time + getLevelDisplay(level) + ' ' + message;
    
        switch(level) {
            case level.error: {
                throw new Error(fullMessage);
                break;
            }
            
            default: {
                console.log(fullMessage);
                break;
            }
        }
    };
    
    function Log() {
        this.startTime = Date.now();
        this.lastLogTime = Date.now();
        
        // ---------------------------------------------------------------------------
        // logging functions
        // ---------------------------------------------------------------------------
        this.info = function(message, silent) {
            logFormat(Date.now() - this.startTime, level.info, message);
        };
        
        this.error = function(message) {
            logFormat(Date.now() - this.startTime, level.error, message);
        };
        
        this.warning = function(message) {
            logFormat(Date.now() - this.startTime, level.warning, message);
        };
        
        this.debug = function(message) {
            if(Crystal.isDebug === false) {
                return;
            }
            
            logFormat(Date.now() - this.startTime, level.debug, message);
        };
    };
    
    return new Log();
});