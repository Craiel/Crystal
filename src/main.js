Crystal.main = function() {
	include('Log');
	include('Data');
	include('UserInterface');
	include('Game');
	include('GameState');

	log.info("Initializing");
	
	// override our data root
	data.setRoot("../data/");
	
	// Set the template data
	include('TemplateProvider').SetData(include('TemplateContent'));
	
	// Initialize components
	data.init();
    game.init();
    userInterface.init();

    // Set the update interval for the non-ui components
    var interval = 1000 / 60;
    setInterval(function() {
        onUpdate();
    }, interval);
    
    // Set the update for the ui, we use animation frame which usually is around 60 fps but is tied to refresh rate
    //  this is generally nicer than using setInterval for animations and UI
    requestAnimationFrame(onUIUpdate);
	
	function onUpdate() {
		gameState.gameTime.update();
	
	    Crystal.resetFrame();
	    data.update(gameState.gameTime);
	    game.update(gameState.gameTime);
	};
	
	function onUIUpdate() {        	
		userInterface.update(gameState.gameTime);
	    
	    requestAnimationFrame(onUIUpdate);
	};
};

$(document).ready(function() {
	Crystal.main();
});