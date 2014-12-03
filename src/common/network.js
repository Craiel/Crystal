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
        
        this.EnumCommandConnect = 0;
        this.EnumCommandDisconnect = 1;
        this.EnumCommandConnectReject = 2;
        this.EnumCommandConnectAccept = 3;
        this.EnumCommandIdent = 4;
        this.EnumCommandPing = 5;
        this.EnumCommandAuth = 6;
        
        this.EnumCommandBlock = 10;
                
        this.EnumStatusUnknown = 0;
        this.EnumStatusConnecting = 1;
        this.EnumStatusConnected = 2;
        this.EnumStatusAuthenticating = 3;
        this.EnumStatusAuthenticated = 4;
        this.EnumStatusFailed = 5;
        
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
