var dgram = require('dgram');
var util = require("util");
var EventEmitter = require("events");

var regex = require('./regex/log.js');

function Logger(port) {
	
	EventEmitter.call(this);
	
	this.socket = dgram.createSocket('udp4');
	
	this.socket.on('message', this.parse);
	
	this.socket.on('listening', function() {
		var address = this.socket.address();
		this.emit('listening');
	}.bind(this));
	
	this.socket.bind(port);
}

util.inherits(Logger, EventEmitter);

Logger.prototype.parse = function(msg, info) {
	
	msg = msg.toString('ascii').slice(5, -1);
	
	var read = false;
	
	for(key in regex) {
		
		if(msg.match(regex[key]) != null) {
			
			read = true;
			var event = key.split('-')[0];
			this.emit(event, regex[key].exec(msg));
		}
	}
	
	if(!read)
		console.log("Unknown Message", msg);
}

module.exports = Logger;