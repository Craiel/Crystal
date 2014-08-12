requirejs.config({
    baseUrl : '../src',

    paths : {
        // Map the system files for easier access
    	assert: 'system/assert',
        component: 'system/component',
        event: 'system/event',
        gameTime: 'system/gameTime',
        log: 'system/log',
        math: 'system/math',
        runtime: 'system/runtime',
        save: 'system/save',
        type: 'system/type',        
        utils: 'system/utils',
        jquery : 'external/jquery-2.1.1',
    }
});

// Implement these since we don't process the scripts
var StrLoc = function(str) {
	return str;
};
var StrSha = function(str) {
	return str;
};

require(["core"], function(core) {
    // Load globals
    require(["jquery", "log", "data", "game", "ui", "game/state"], function($, log, data, game, ui, state) {
            	
        log.info("Initializing Barebone");
        
        // override our data root
        data.setRoot("../data/");
        
        // Add hook for document ready
        $(document).ready(onDocumentReady);
        
        function onDocumentReady() {
            
            // Initialize components
            data.init();
            game.init();
            ui.init();

            // Set the update interval for the non-ui components
            var interval = 1000 / 60;
            setInterval(function() {
                onUpdate();
            }, interval);
            
            // Set the update for the ui, we use animation frame which usually is around 60 fps but is tied to refresh rate
            //  this is generally nicer than using setInterval for animations and UI
            requestAnimationFrame(onUIUpdate);
        };
        
        function onUpdate() {
        	state.gameTime.update();

            core.resetFrame();
            data.update(state.gameTime);
            game.update(state.gameTime);
        };
        
        function onUIUpdate() {        	
            ui.update(state.gameTime);
            
            requestAnimationFrame(onUIUpdate);
        };
    });
});