Particle = function(position, velocity, direction, timeToLive) {
	this.position = position;
	this.velocity = velocity;
	this.direction = direction;
	this.timeToLive = timeToLive;
	this.maxTimeToLive = timeToLive + 0; //+0 to create a separate var
};

Particle.prototype = {
	
	getPosition: function() {
		return this.position;
	},	
	getDirection: function() {
		return this.direction;
	},
	getLifetime: function() {
		return this.timeToLive;
	},
	increaseLifetime: function(decrement) {
		this.timeToLive -= decrement;
	},
	updatePosition: function() {
		var y = Math.sin(this.direction);
		var x = Math.cos(this.direction);
		this.position.x += x * this.velocity;
		this.position.y += y * this.velocity;
	},
	getFade: function() {
		return (this.timeToLive/this.maxTimeToLive);
	}
};
