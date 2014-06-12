//Set the namespace
Crystal = {};

require(["core"], function() {
    // Load globals
    require(["jquery", "log", "data", "game", "ui"], function($, log, data, game, ui) {
        log.info("Initializing");
        
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