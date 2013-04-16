
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



GpuParticle = function(position, particleAmount) {
	
	this.startPos = {
		x: position[0], 
		y: position[1]
	};
	this.pos = [];
	this.vel = [];
	this.vertices = [];
	this.amount = particleAmount;
	this.init();
}

GpuParticle.prototype = {
	init: function() {
		for(var x = 0; x < this.amount*2; x += 2) {
			for(var y = 0; y < this.amount*2; y += 2) {
				this.pos.push(this.startPos.x + x, this.startPos.y + y, 0);
				this.vel.push(Math.random()*2 - 1, Math.random()*2 - 1, 0);
			}
		}
		
		var d = 1/this.amount;
		for (var x = 0; x < 1; x += d) {
			for (var y = 0; y < 1; y += d) {
				this.vertices.push(x, y);
			}
		}
	},
	 
	getPos: function() {
		return this.pos;
	},
	
	getVel: function() {
		return this.vel;
	},
	
	getVertices: function() {
		return this.vertices;
	}, 
	
	getAmount: function() {
		return this.amount;
	}
}



