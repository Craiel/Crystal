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
	}
	
	var serverProcessMessage = function(socket, data) {
		var packet = network.getPacket(data);
		log.debug("Received packet: "+packet);
		switch(packet.command) {
			case network.EnumCommandIdent: {
				socket.send(network.buildPacket(network.EnumCommandIdent, serverGenerateGuid()));
				break;
			}
			
			case network.EnumCommandPing: {
				socket.send(network.buildPacket(network.EnumCommandPing));
				break;
			}
			
			default: {
				log.error("Received unknown command: " + packet.command);
			}
		};
	};
	
	var serverOnConnection = function(socket) {
		console.log('New connection');
	    socket.on('message', function(data) { serverProcessMessage(socket, data); });
	};
    
    Server.prototype = component.create();
    Server.prototype.$super = parent;
    Server.prototype.constructor = Server;
    
    function Server() {
        this.id = 'server';
        
        this.socket = undefined;
                        
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
            this.socket.on('connection', serverOnConnection);
            
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
        
    }
    
    return new Server();
    
});
