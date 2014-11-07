declare('Network', function() {
	include('Log');
	include('Static');
	include('Component');
	include('NetworkPacket');
    
    function Network() {
        this.id = "Network";
        
        this.ident = undefined;
        this.address = 'localhost';
        this.port = 9089;
        this.pingInterval = 60 * 1000;
        
        this.EnumCommandPing = 0;
        this.EnumCommandIdent = 1;
        
        // ---------------------------------------------------------------------------
        // network functions
        // ---------------------------------------------------------------------------
        this.createSocket = function() {
			log.debug('Creating socket: ' + this.address + ':' + this.port);
			return new WebSocket('ws://' + this.address + ':' + this.port);
		};
		
		this.buildPacket = function(command, payload) {
			var packet = networkPacket.create();
			packet.ident = this.ident;
			packet.command = command;
			packet.payload = payload;
			return packet.build();
		};
		
		this.getPacket = function(data) {
			var packet = networkPacket.create();
			packet.loadFrom(data);
			return packet;
		};
    };
    
    return new Network();
});
