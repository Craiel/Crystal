requirejs.config({
    baseUrl : '../src',

    paths : {
        // Map the system files for easier access
        component: 'system/component',
        assert: 'system/assert',
        event: 'system/event',
        utils: 'system/utils',
        save: 'system/save',
        type: 'system/type',
        log: 'system/log',
        math: 'system/math',
        runtime: 'system/runtime',
        
        jquery : 'external/jquery-2.1.1',
    }
});

require(["core"], function(core) {
    // Load globals
    require(["jquery", "log", "data", "game", "ui", "game/state"], function($, log, data, game, ui, state) {
        
        log.info("Initializing Barebone");
            
        // override our data root
        data.setRoot("../data/");
        
        // Add hook for document ready
        $(document).ready(onDocumentReady);
        console.log(state.timeZoneOffset);
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
            currentTime = Date.now() - state.timeZoneOffset;

            core.resetFrame();
            data.update(currentTime);
            game.update(currentTime);
        };
        
        function onUIUpdate() {
        	currentTime = Date.now() - state.timeZoneOffset;
            
            ui.update(currentTime);
            
            requestAnimationFrame(onUIUpdate);
        };
    });
});