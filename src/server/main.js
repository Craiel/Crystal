Crystal.main = function() {
	include('Log');
	include('Static');
	include('Server');
	include('GameState');

	log.info("Initializing");
	
	// override our data root if we have it stored somewhere else
	static.setRoot("");
	
	// Initialize components
	static.init();
    server.init();
    
    // Set the server interval
    var interval = 1000 / 60;
    setInterval(function() {
        onUpdate();
    }, interval);

    function onUpdate() {
		gameState.gameTime.update();
	
		Crystal.resetFrame();
		static.update(gameState.gameTime);
		server.update(gameState.gameTime);
	};
};

Crystal.main();
