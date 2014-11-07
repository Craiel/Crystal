declare('NetworkClient', function() {
	include('Log');
	include('Assert');
	include('Network');
	include('Component');
    
    NetworkClient.prototype = component.create();
    NetworkClient.prototype.$super = parent;
    NetworkClient.prototype.constructor = NetworkClient;
    
    // ---------------------------------------------------------------------------
	// client functions
	// ---------------------------------------------------------------------------
	var clientOnConnect = function(self) {
		console.log('Connected to server');
	};
	
	var clientOnDisconnect = function(self) {
		console.log('Disconnected from server');
	};
	
	var clientOnMessageReceived = function(self, data) {
		var packet = network.getPacket(data.data);
		switch(packet.command) {
			case network.EnumCommandIdent: {
				assert.isDefined(packet.payload);
				network.ident = packet.payload;
				log.info("Received ident as " + network.ident);
				break;
			}
			
			case network.EnumCommandPing: {
				self.lastPingResponse = Date.now();
				break;
			}
			
			default: {
				log.error("Received unknown command: " + packet.command);
				break;
			}
		}
	};
	
	var clientOnError = function(self, error) {
		log.error("Socket received error: " + error);
	};
	
    function NetworkClient() {
        this.id = "NetworkClient";
        
        this.socket = undefined;
        this.session = undefined;
        
        this.lastPingResponse = undefined;
        this.lastPingTime = undefined;
        this.waitingForIdent = false;
        this.isOffline = false;
        this.sendErrorDelay = 200;
        this.nextSendTime = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            this.componentInit();
            
            var self = this;
            this.socket = network.createSocket();
            this.socket.onopen = function() { clientOnConnect(self); };
            this.socket.onclose = function() { clientOnDisconnect(self); };
			this.socket.onmessage = function(data) { clientOnMessageReceived(self, data); };
			this.socket.onerror = function(error) { clientOnError(self, error); };
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }
            
            if(network.ident === undefined) {
				if(this.waitingForIdent === true) {
					return;
				}
				
				this.sendIdent(currentTime);
				
				// Nothing else to do if we are not identified yet
				return;
			}
			
			// Ping the server for alive
            if(this.lastPingTime === undefined || this.lastPingTime + network.pingInterval < currentTime.getTime()) {
				this.lastPingTime = currentTime.getTime();
				this.sendPing(currentTime);
				return;
			}
        };
        
        // ---------------------------------------------------------------------------
        // client functions
        // ---------------------------------------------------------------------------
        this.canSend = function(currentTime) {
			if(this.nextSendTime === undefined || this.nextSendTime <= currentTime.getTime()) {
				return true;
			}
			
			return false;
		};
		
        this.sendIdent = function(currentTime) {
			if(this.canSend(currentTime) === false) {
				return false;
			}
			
			try {
				this.socket.send(network.buildPacket(network.EnumCommandIdent));
				this.waitingForIdent = true;
				return true;
			} 
			catch(error) {
				this.handleSocketError(currentTime, error);
			}
			
			return false;
		};
		
		this.sendPing = function(currentTime) {
			if(this.canSend(currentTime) === false) {
				return false;
			}
			
			try {
				this.socket.send(network.buildPacket(network.EnumCommandPing));
				return true;
			}
			catch(error) {
				this.handleSocketError(currentTime, error);
			}
			
			return false;
		};
		
		this.handleSocketError = function(currentTime, error) {
			this.nextSendTime = currentTime.getTime() + this.sendErrorDelay;
			
			// InvalidStateError is ignored for now
			if(error.code === 11) {
				return;
			}
			
			log.error("Socket threw unexpected error: " + error);
			console.log(error);
		};
    };
    
    return new NetworkClient();
});
