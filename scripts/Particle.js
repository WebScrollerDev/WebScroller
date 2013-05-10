
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

//-------------------------RAINDROP------------------------// USING QUADTREE

ParticleRainDrop = function(position, velocity, timeToLive) {
	this.position = new QuadPoint([position.x, position.y]);	// position as a QuadPoint
	this.velocity = new QuadPoint([velocity.x, velocity.y]);	// position as a QuadPoint
	this.deathMark = false;
	this.timeToLive = timeToLive;
	this.maxTimeToLive = timeToLive + 0; //+0 to create a separate var
};

ParticleRainDrop.prototype.getPosition = function() {
	return this.position.getPos();
};
ParticleRainDrop.prototype.updatePosition = function() {
	
	var prevPos = this.position.clone();
	this.position.add(this.velocity);
	this.velocity.addY(-0.01);
	
	var intersect = world.rootQuadTree.getIntersection(new QuadLine(prevPos, this.position));
	if (intersect != null) {
		this.position = prevPos;
		this.deathMark = true;
		this.velocity = intersect.reflect(this.velocity).times(0.2);
	}
};
ParticleRainDrop.prototype.getDeathMark = function() {
	return this.deathMark;
};
ParticleRainDrop.prototype.getLifetime = function() {
	return this.timeToLive;
};
ParticleRainDrop.prototype.decreaseLifetime = function(decrement) {
	this.timeToLive -= decrement;
};

//-------------------------FLUID------------------------//
GpuParticle = function(position, particleSpawnOffset, particleSpawnSpacing, particleAmount, borderDataImage, warpTo, warpFrom) {
	
	this.startPos = {
		x: position[0], 
		y: position[1]
	};
	this.pos = [];
	this.particleSpawnOffset = particleSpawnOffset;
	this.particleSpawnSpacing = particleSpawnSpacing;
	this.velocityDensity = [];
	this.border = [];
	this.vertices = [];
	this.amount = particleAmount;
	this.warpTo = warpTo;
	this.warpFrom = warpFrom;
	this.borderLoadStatus = false;
	this.borderDataHandler = new TextureData();
	this.borderDataHandler.loadImage(borderDataImage);
	this.init();
	//console.log([this.startPos.x + warpTo[0], this.startPos.y + warpTo[1]]);
	world.addPoint([this.startPos.x + warpTo[0], this.startPos.y + warpTo[1]]);
	world.addPoint([this.startPos.x + warpFrom[0], this.startPos.y + warpFrom[1]]);
}

GpuParticle.prototype = {
	init: function() {
		for(var x = 0.0; x < this.amount; x++) {
			for(var y = 0.0; y < this.amount; y++) {
				this.pos.push(this.particleSpawnOffset[0] + this.startPos.x + x * this.particleSpawnSpacing, this.particleSpawnOffset[1] + this.startPos.y + y * this.particleSpawnSpacing, 0);
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
	
	getWarpTo: function() {
		return [this.startPos.x + this.warpTo[0], this.startPos.y + this.warpTo[1]];
	},
	
	getWarpFrom: function() {
		return [this.startPos.x + this.warpFrom[0], this.startPos.y + this.warpFrom[1]];
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



