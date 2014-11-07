declare("Session", function() {
	include('Log');
	
	function Session() {
		this.ident = undefined;
		this.user = undefined;
		this.pass = undefined;
		
		// ---------------------------------------------------------------------------
		// session functions
		// ---------------------------------------------------------------------------
	};
        
    return {
		create: function() { return new Session(); }
	};
});
