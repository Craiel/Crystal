requirejs.config({
    baseUrl : '../src',

    paths : {
        // Map the system files for easier access
        component: 'system/component',
        assert: 'system/assert',
        event: 'system/event',
        utils: 'system/utils',
        save: 'system/save',
        log: 'system/log',
        
        jquery : 'external/jquery-2.1.1',
    }
});

require(["core"], function() {
    // Load globals
    require(["jquery", "log", "data", "game", "ui"], function($, log, data, game, ui) {
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
            currentTime = Date.now();
            
            data.update(currentTime);
            game.update(currentTime);
        };
        
        function onUIUpdate() {
            currentTime = Date.now();
            
            ui.update(currentTime);
            
            requestAnimationFrame(onUIUpdate);
        };
    });
});