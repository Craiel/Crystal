declare('NetworkClient', function() {
	include('Log');
	include('GameState');
	include('Assert');
	include('Network');
	include('Component');
    
    NetworkClient.prototype = component.create();
    NetworkClient.prototype.$super = parent;
    NetworkClient.prototype.constructor = NetworkClient;
    
    // ---------------------------------------------------------------------------
	// client functions
	// ---------------------------------------------------------------------------	
    function NetworkClient() {
        this.id = "NetworkClient";

		this.enabled = false;

        this.socket = undefined;
        this.session = undefined;
        
        this.status = network.EnumStatusUnknown;
        
        this.lastPingResponse = undefined;
        this.lastPingTime = undefined;
        this.lastSendTime = undefined;
        
        this.sendQueue = [];        
        this.sendDelay = 10;
        this.sendBulkMax = 50;
        
        this.connectionDelay = 200;
        this.connectionTime = undefined;
        
        this.authenticateTimeout = 1000;
        this.authenticateTimeoutTime = undefined;
        
        this.pingDelay = 10000;
        this.pingTime = undefined;
        this.pingLastResponse = undefined;
        
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
            
            // This ensures the disconnect is called right away, sometimes it can take a moment otherwise
            window.onbeforeunload = this.disconnect;
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }

			if(this.enabled === false) {
				return;
			}

            switch(this.status)
            {
            case network.EnumStatusUnknown:
            case network.EnumStatusFailed:
            	this.reconnect(currentTime);
            	break;
            	
            case network.EnumStatusConnecting:
            	break;
            	
            case network.EnumStatusConnected:
            	this.authenticate(currentTime);
            	break;
            	
            case network.EnumStatusAuthenticating:
            	break;
            	
            case network.EnumStatusAuthenticated:
            	this.ping(currentTime);
            	break;
            }
            
            this.receiveMessages(currentTime);
        	this.sendMessages(currentTime);
        };
        
        // ---------------------------------------------------------------------------
        // client functions
        // --------------------------------------------------------------------------- 
        this.authenticate = function(currentTime) {
        	log.debug("Authenticating network...");
        	
        	this.status = network.EnumStatusAuthenticating;
        	
        	this.queueMessage(network.EnumCommandIdent);
        };
        
        this.ping = function(currentTime) {
        	if (this.pingTime !== undefined && this.pingTime + this.pingDelay >= currentTime.getTime()) {
				return;
			}
        	
        	this.pingTime = currentTime.getTime();
    		this.queueMessage(network.EnumCommandPing);
        };
        
        this.disconnect = function() {
        	if (this.socket === undefined) {
        		return;
        	}
        	
        	this.sendMessage(currentTime, network.EnumCommandDisconnect);
        	
        	this.socket.parent = undefined;
        	this.socket.onopen = undefined;
        	this.socket.onclose = undefined;
        	this.socket.onmessage = undefined;
        	this.socket.onerror = undefined;
        	this.socket.close();
        	this.socket = undefined;
        };
        
        this.reconnect = function(currentTime) {
        	if (this.connectionTime !== undefined && this.connectionTime + this.connectionDelay >= currentTime.getTime()) {
				log.debug("Delaying send!");
				return;
			}
        	
        	log.debug("Reconnecting to server...");
        	
        	this.socket = network.createSocket();
        	this.socket.parent = this;
            this.socket.onopen = function(event) { this.parent.OnSocketConnect(event); };
            this.socket.onclose = function(event) { this.parent.OnSocketDisconnect(event); };
			this.socket.onmessage = function(data) { this.parent.OnSocketMessageReceived(data); };
			this.socket.onerror = function(error) { this.parent.OnSocketError(error); };
        	
        	this.status = network.EnumStatusConnecting;

        	// Queue the connect
        	this.queueMessage(network.EnumCommandConnect);
        };
        
        this.isClientReady = function() {
        	return this.status === network.EnumStatusAuthenticated;
        };
        
        this.queueClientMessage = function(command, payload) {
        	if(this.status !== network.EnumStatusAuthenticated) {
        		log.error("Can not queue client message without authentication!");
        		return;
        	}
        	
        	this.queueMessage(command, payload);
        };
        
        this.queueMessage = function(command, payload) {
        	this.sendQueue.push([command, payload]);
        };
        
        this.receiveMessages = function(currentTime) {
        	
        };
		
		this.sendMessages = function(currentTime) {
			if (this.lastSendTime !== undefined && this.lastSendTime + this.sendDelay >= currentTime.getTime()) {
				log.debug("Delaying send!");
				return;
			}
			
			var messageBlock = { count: 0, messages: [] };
			var i = 0;
			while (i < this.sendBulkMax && this.sendQueue.length > 0) {				
				var message = this.sendQueue.shift();
				messageBlock.count++;
				messageBlock.messages.push(message);				
				i++;
			}
			
			if(messageBlock.count <= 0) {
				return;
			}
			
			this.sendMessage(currentTime, network.EnumCommandBlock, messageBlock);
		};
		
		this.sendMessage = function(currentTime, command, payload) {
			try {
				// log.debug("Sending Message to server: " + command);
				this.socket.send(network.buildPacket(command, payload));
				return true;
			}
			catch(error) {
				this.handleSocketError(currentTime, error);
			}
			
			return false;
		};
		
		this.handleSocketError = function(currentTime, error) {
			this.connectionTime = currentTime.getTime();
			
			// InvalidStateError is ignored for now
			if(error.code === 11) {
				return;
			}
			
			log.error("Socket threw unexpected error: " + error);
			console.log(error);
			this.status = network.EnumStatusFailed;
		};
		
		this.OnSocketConnect = function() {
			console.log('Connected to server');
			this.status = network.EnumStatusConnected;
		};
		
		this.OnSocketDisconnect = function() {
			console.log('Disconnected from server');
			this.status = network.EnumStatusFailed;
		};
		
		this.OnSocketMessageReceived = function(data) {
			var packet = network.getPacket(data.data);
			switch(packet.command) {
				case network.EnumCommandAccept: {
					this.status = network.EnumStatusConnected;
					log.debug("Server accepted connection");
					break;
				}
				
				case network.EnumCommandIdent: {
					assert.isDefined(packet.payload);
					network.ident = packet.payload;
					log.debug("Received ident as " + network.ident);
					this.status = network.EnumStatusAuthenticated;
					break;
				}
				
				case network.EnumCommandPing: {
					this.pingLastResponse = gameState.gameTime.getTime();
					break;
				}
				
				default: {
					log.error("Received unknown command: " + packet.command);
					break;
				}
			}
		};
		
		this.OnSocketError = function(error) {
			log.error("Socket received error: " + error);
		};
    };
    
    return new NetworkClient();
});
