Particle = function(position, velocity, direction) {
	this.position = position;
	this.velocity = velocity;
	this.direction = direction;
	this.lifetime = 0;
};

Particle.prototype = {
	
	getPosition: function() {
		return this.position;
	},	
	getDirection: function() {
		return this.direction;
	},
	getLifetime: function() {
		return this.lifetime;
	},
	increaseLifetime: function(increment) {
		this.lifetime += increment;
	},
	updatePosition: function() {
		var x = Math.sin(this.direction);
		var y = Math.cos(this.direction);
		this.position.x += x * this.velocity;
		this.position.y += y * this.velocity;
	}
};
