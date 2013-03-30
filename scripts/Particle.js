
//-------------------------BASE------------------------//

ParticleBase = function(position, velocity, direction, diameter) {
	this.position = position;
	this.velocity = velocity;
	this.direction = direction;
	this.diameter = diameter;
};

ParticleBase.prototype = {
	
	getPosition: function() {
		return this.position;
	},	
	getDirection: function() {
		return this.direction;
	},
	setDirection: function(newDirection) {
		this.direction = newDirection;
	},
	updatePosition: function() {
		var y = Math.sin(this.direction);
		var x = Math.cos(this.direction);
		this.position.x += x * this.velocity;
		this.position.y += y * this.velocity;
	},
	getVelocity: function() {
		return this.velocity;
	},
	setVelocity: function(newVelocity) {
		this.velocity = newVelocity;
	},
	getDiameter: function() {
		return this.diameter;
	},
	setDiameter: function(newDiameter) {
		this.diameter = newDiameter;
	}
};

//-------------------------SMOKE------------------------//

ParticleSmoke = function(position, velocity, direction, timeToLive, diameter) {
	
	ParticleSmoke.baseConstructor.call(this, position, velocity, direction, diameter);
	
	this.timeToLive = timeToLive;
	this.maxTimeToLive = timeToLive + 0; //+0 to create a separate var
};

InheritenceManager.extend(ParticleSmoke, ParticleBase);

ParticleSmoke.prototype.getLifetime = function() {
	return this.timeToLive;
};
ParticleSmoke.prototype.decreaseLifetime = function(decrement) {
	this.timeToLive -= decrement;
};
ParticleSmoke.prototype.getFade = function() {
	return (this.timeToLive/this.maxTimeToLive);
};

//-------------------------FLUID------------------------//

ParticleFluid = function(position, velocity, direction, diameter, density){
	ParticleFluid.baseConstructor.call(this, position, velocity, direction, diameter);
	
	this.density = density;
};
	
InheritenceManager.extend(ParticleFluid, ParticleBase);





