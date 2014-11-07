declare("NetworkPacket", function() {
	include('Log');
	include("CoreUtils");
	
	function NetworkPacket() {
		this.ident = undefined;
		this.command = undefined;
		this.payload = undefined;
		
		this.packetSeparator = String.fromCharCode(720);
				
		// ---------------------------------------------------------------------------
        // packet functions
        // ---------------------------------------------------------------------------
		this.isValid = function() {
			return this.command !== undefined;
		};
		
		this.build = function() {
			var data = this.ident + this.packetSeparator + this.command + this.packetSeparator;
			if(this.payload !== undefined) {
				data += JSON.stringify(this.payload);
			}
			
			return coreUtils.lzwEncode(coreUtils.utf8Encode(data));
		};
		
		this.loadFrom = function(rawData) {
			log.debug('NetworkPacket: ');
			console.log(rawData);
			var data = coreUtils.utf8Decode(coreUtils.lzwDecode(rawData));
			console.log(data);
			var segments = data.split(this.packetSeparator);
			console.log(segments);
			this.ident = segments[0];
			this.command = parseInt(segments[1]);
			if(segments.length > 1 && segments[2] !== undefined && segments[2].length > 0) {
				this.payload = JSON.parse(segments[2]);
			}
		};
	};
        
    return {
		create: function() { return new NetworkPacket(); }
	};
});
