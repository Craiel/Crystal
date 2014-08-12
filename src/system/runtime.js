define(function(require) {
    var $ = require("jquery");
    var log = require("log");
    var utils = require("utils");
    
    var loadedScripts = [];
    
    function Runtime() {
        
        this.loadDynamic = function(scripts, nextId, finish) {
            if (nextId >= scripts.length) {
                if (finish !== undefined) {
                    finish();
                }
                return;
            }
    
            var script = scripts[nextId];
            var loaded = $.inArray(script, loadedScripts);
            if (loaded >= 0) {
                log.warning(StrLoc("Script is already loaded: {0}").format(nextId), false);
                this.loadDynamic(scripts, nextId + 1, finish);
                return;
            }
    
            loadedScripts.push(script);
            try {
                if (/\.js$/.exec(script)) {
                    $.getScript(script).done(function(script, textStatus) {
                        log.debug("  -> DONE", false);
                        this.loadDynamic(scripts, nextId + 1, finish);
                    }).fail(
                            function(jqxhr, settings, exception) {
                                log.error("  -> FAIL: " + exception + "\n" + exception.stack);
                            });
                } else if (/\.css$/.exec(script)) {
                    // Append the style
                    $('<link>').attr({
                        rel : 'stylesheet',
                        type : 'text/css',
                        href : script
                    }).appendTo($('head'));
                    
                    this.loadDynamic(scripts, nextId + 1, finish);
                } else {
                    log.error(StrLoc("Unhandled script type!"));
                }
            } catch (e) {
                log.error(e +": "+ e.stack);
            }
        };
    }
    
    return new Runtime();
});