
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
	increasePositionWithValue: function(value) {
		this.position.x += value.x;
		this.position.y += value.y;
	},
	getVelocity: function() {
		return this.velocity;
	},
	increaseVelocityWithValue: function(value) {
		this.velocity.x += value.x;
		this.velocity.y += value.y;
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
GpuParticle = function(position, particleAmount, borderDataImage) {
	
	this.startPos = {
		x: position[0], 
		y: position[1]
	};
	this.pos = [];
	this.velocityDensity = [];
	this.border = [];
	this.vertices = [];
	this.amount = particleAmount;
	this.borderLoadStatus = false;
	this.borderDataHandler = new TextureData();
	this.borderDataHandler.loadImage(borderDataImage);
	this.init();
}

GpuParticle.prototype = {
	init: function() {
		var space = 3.0;
		for(var x = 0.0; x < this.amount; x++) {
			for(var y = 0.0; y < this.amount; y++) {
				this.pos.push(75 + this.startPos.x + x * space, 130 + this.startPos.y + y * space, 0);
				this.velocityDensity.push(0, 0, 1);
			}
		}
		
		var d = 1/this.amount;
		for (var x = 0.0; x < 1.0; x += d) {
			for (var y = 0.0; y < 1.0; y += d) {
				this.vertices.push(x, y);
			}
		}
		var _this = this; //Needed in setInterval, for specifying the correct this
		this.checkIfDoneInterval = setInterval(function(){_this.doneLoading()}, 50);
	},
	
	doneLoading: function() {
		if(this.borderDataHandler.isLoaded()) {
			clearInterval(this.checkIfDoneInterval);
			this.border = this.borderDataHandler.getData();
			this.borderLoadStatus = true;
		}
	},
	
	getBorderLoadStatus: function() {
		return this.borderLoadStatus;
	},
	
	getPos: function() {
		return this.pos;
	},
	
	getVelDen: function() {
		return this.velocityDensity;
	},
	
	getVertices: function() {
		return this.vertices;
	}, 
	
	getAmount: function() {
		return this.amount;
	}, 
	
	getBorderPos: function() {
		return [this.startPos.x, this.startPos.y];
	}, 
	
	getBorder: function() {
		return this.border;
	}, 
	
	getBorderSize: function() {
		var size = {
			x: this.border.width, 
			y: this.border.height
		}
		return size;
	}
}



