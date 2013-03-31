
//-------------------------BASE------------------------//

ParticleBase = function(position, velocity, diameter, rotation) {
	this.position = position;
	this.velocity = velocity;
	this.diameter = diameter;
	this.rotation = rotation;
};

ParticleBase.prototype = {
	
	getPosition: function() {
		return this.position;
	},	
	updatePosition: function() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	},
	getVelocity: function() {
		return this.velocity;
	},
	setVelocity: function(newVelocity) {
		this.velocity = newVelocity;
	},
	setVelocityX: function(newX) {
		this.velocity.x = newX;
	},
	setVelocityY: function(newY) {
		this.velocity.y = newY;
	},
	getDiameter: function() {
		return this.diameter;
	},
	setDiameter: function(newDiameter) {
		this.diameter = newDiameter;
	},
	getRotation: function() {
		return this.rotation;
	},
	setRotation: function(newRotation) {
		this.rotation = newRotation;
	}
};

//-------------------------SMOKE------------------------//

ParticleSmoke = function(position, velocity, diameter, rotation, timeToLive) {
	
	ParticleSmoke.baseConstructor.call(this, position, velocity, diameter, rotation);
	
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

//-------------------------FIRE------------------------//

ParticleFire = function(position, velocity, diameter, rotation, timeToLive) {
	
	ParticleFire.baseConstructor.call(this, position, velocity, diameter, rotation);
	
	this.timeToLive = timeToLive;
	this.maxTimeToLive = timeToLive + 0; //+0 to create a separate var
};

InheritenceManager.extend(ParticleFire, ParticleBase);

ParticleFire.prototype.getLifetime = function() {
	return this.timeToLive;
};
ParticleFire.prototype.decreaseLifetime = function(decrement) {
	this.timeToLive -= decrement;
};
ParticleFire.prototype.getFade = function() {
	return (this.timeToLive/this.maxTimeToLive);
};

//-------------------------FLUID------------------------//

ParticleFluid = function(position, velocity, diameter, rotation, density){
	ParticleFluid.baseConstructor.call(this, position, velocity, diameter, rotation);
	
	this.density = density;
};
	
InheritenceManager.extend(ParticleFluid, ParticleBase);





