declare('Server', function() {
	include('Assert');
	include('Static');
	include('Log');
	include('Component');
	include('Network');
    
    // ---------------------------------------------------------------------------
	// server functions
	// ---------------------------------------------------------------------------
    var serverGenerateGuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
	};
	
    Server.prototype = component.create();
    Server.prototype.$super = parent;
    Server.prototype.constructor = Server;
    
    function Server() {
        this.id = 'server';
        
        this.socket = undefined;
        
        this.activeClients = {};
                        
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
			
			network.ident = 'host';
			
            var WebSocketServer = require('ws').Server;
            this.socket = new WebSocketServer({port: network.port });
            this.socket.parent = this;
            this.socket.on('connection', this.OnSocketConnection);
            
            console.log("Sever running on port " + network.port);
        };
        
        this.update = function(currentTime) {
            if(!this.componentUpdate(currentTime)) {
                return;
            }
            
            // Todo: perform periodic server actions
        };
        
        // ---------------------------------------------------------------------------
        // server functions
        // ---------------------------------------------------------------------------
        this.OnSocketConnection = function(socket) {
    		console.log('New connection');
    		socket.parent = this.parent;
    	    socket.on('message', this.parent.OnSocketMessage);
    	};
    	
    	this.OnSocketMessage = function(data) {
    		this.parent.ProcessSocketMessage(this, data);
    	};
    	
    	this.ProcessSocketMessage = function(socket, data) {
    		var packet = network.getPacket(data);
    		log.debug("Received packet: "+packet);

    		switch(packet.command) {
    			
    			case network.EnumCommandPing: {
    				socket.send(network.buildPacket(network.EnumCommandPing));
    				break;
    			}
    			
    			case network.EnumCommandIdent: {
    				log.debug("Client sent Ident request");
    				var guid = serverGenerateGuid();
    				this.activeClients[guid] = {};
    				socket.send(network.buildPacket(network.EnumCommandIdent, guid));
    				break;
    			}
    			
    			case network.EnumCommandConnect: {
    				log.debug("Client sent connect");
    				socket.send(network.buildPacket(network.EnumCommandAccept));
    				break;
    			}
    			
    			case network.EnumCommandDisconnect: {
    				log.debug("Client sent disconnect");
    				break;
    			}
    			
    			case network.EnumCommandBlock: {
    				log.debug("Received block with " + packet.payload.count + " messages");
    				for(var i = 0; i < packet.payload.count; i++) {
    					// Rebuild a packet from the block and process
    					var message = packet.payload.messages[i];
    					var subPacket = network.buildPacket(message[0], message[1]);
    					this.ProcessSocketMessage(socket, subPacket);
    				}
    				
    				break;
    			}
    			
    			default: {
    				log.error("Received unknown command: " + packet.command);
    			}
    		};
    	};
    }
    
    return new Server();
    
});
