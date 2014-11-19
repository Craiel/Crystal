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
    function NetworkClient() {
        this.id = "NetworkClient";
        
        this.socket = undefined;
        this.session = undefined;
        
        this.status = network.EnumStatusUnknown;
        
        this.lastPingResponse = undefined;
        this.lastPingTime = undefined;
        this.lastSendTime = undefined;
        
        this.sendQueue = [];        
        this.sendDelay = 10;
        this.sendBulkMax = 50;
        
        this.connectionRetryDelay = 200;
        this.connectionRetryTime = undefined;
        
        this.statusCheckDelay = 1000;
        this.statusCheckTime = undefined;
        
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
            
            switch(this.status)
            {
            case network.EnumStatusUnknown:
            case network.EnumStatusFailed:
            	this.reconnect(currentTime);
            	break;
            	
            case network.EnumStatusConnecting:
            	break;
            	
            case network.EnumStatusConnected:
            	this.checkNetworkStatus(currentTime);
            	this.receiveMessages(currentTime);
            	this.sendMessages(currentTime);
            	break;
            }
        };
        
        // ---------------------------------------------------------------------------
        // client functions
        // --------------------------------------------------------------------------- 
        this.checkNetworkStatus = function(currentTime) {
        	if(this.statusCheckTime <= currentTime.getTime()) {
				return true;
			}
        	
        	this.statusCheckTime = currentTime.getTime() + this.statusCheckDelay;
        	
        	if(network.ident === undefined) {
        		this.queueMessage(network.EnumCommandIdent);
        	}
        }
        
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
        	if(this.connectionRetryTime <= currentTime.getTime()) {
        		log.debug("Delaying reconnect!");
				return true;
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
				log.debug("Sending Message to server: " + command);
				this.socket.send(network.buildPacket(command, payload));
				return true;
			}
			catch(error) {
				this.handleSocketError(currentTime, error);
			}
			
			return false;
		};
		
		this.handleSocketError = function(currentTime, error) {
			this.connectionRetryTime = currentTime.getTime() + this.connectionRetryDelay;
			
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
					break;
				}
				
				case network.EnumCommandPing: {
					log.debug("Received ping response");
					//self.lastPingResponse = Date.now();
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
