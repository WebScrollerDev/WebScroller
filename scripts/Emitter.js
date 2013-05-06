
//-------------------------BASE------------------------//
			         //  x,y         int           ms             float              x,y              +- x,y
EmitterBase = function(position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan) {
	
	this.position = {
		x: position[0], 
		y: position[1]
	}
	
	this.particles = new Array(); //the particles for this emitter
	this.particleVelocity = { //+-particleVelocitySpan
		x: particleVelocity[0],
		y: particleVelocity[1]
	}
	this.particleVelocitySpan = {
		x: particleVelocitySpan[0],
		y: particleVelocitySpan[1]
	}
	this.particleDiameter = particleDiameter;
	this.maxParticles = maxParticles;
	this.spawnInterval = spawnInterval;
	this.updateTime = 10;
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.setSpawnInterval = setInterval(function(){_this.spawnParticle()}, _this.spawnInterval);
	this.setUpdateInterval = setInterval(function(){_this.updateParticles()}, _this.updateTime);
};

EmitterBase.prototype = { 
	
	stopSpawning: function() {
		clearInterval(this.setSpawnInterval);
	},
	
//------------------Set Functions------------------//	
	setPosition: function(newPos) { //emitter position
		this.position = {
			x: newPos.x, 
			y: newPos.y
		}
	},
	
	setPositionX: function(newX) { //emitter position X
		this.position.x = newX;
	},
	
	setPositionY: function(newY) { //emitter position Y
		this.position.y = newY;
	},
	
	setParticleDiameter: function(newDiam) {
		this.particleDiameter = newDiam;
	},
	
	setParticleVelocity: function(newVel) { //particle spawn-velocity
		this.particleVelocity = {
			x: newVel.x, 
			y: newVel.y
		}
	},
	
	setParticleVelocityX: function(newX) { //particle spawn-velocity X
		this.particleVelocity.x = newX;
	},
	
	setParticleVelocityY: function(newY) { //particle spawn-velocity Y
		this.particleVelocity.y = newY;
	},
	
	setParticleVelocitySpan: function(newSpan) { //particle spawn-velocitySpan
		this.particleVelocitySpan = {
			x: newSpan.x, 
			y: newSpan.y
		}
	},
	
	setParticleVelocitySpanX: function(newX) { //particle spawn-velocitySpan X
		this.particleVelocitySpan.x = newX;
	},
	
	setParticleVelocitySpanY: function(newY) { //particle spawn-velocitySpan Y
		this.particleVelocitySpan.y = newY;
	},
	
//------------------Get Functions------------------//
	getParticles: function() { //returns the particle array
		return this.particles;
	},
	
	getPosition: function() { //emitter position
		return this.position;
	},
	
	getPositionX: function() { //emitter position X
		return this.position.x;
	},
	
	getPositionY: function() { //emitter position Y
		return this.position.y;
	},
	
	getParticleDiameter: function() {
		return this.particleDiameter;
	},
	
	getParticleVelocity: function() { //particle spawn-velocity
		return this.particleVelocity;
	},
	
	getParticleVelocityX: function() { //particle spawn-velocity X
		return this.particleVelocity.x;
	},
	
	getParticleVelocityY: function() { //particle spawn-velocity Y
		return this.particleVelocity.y;
	},
	
	getParticleVelocitySpan: function() { //particle spawn-velocitySpan
		return this.particleVelocitySpan;
	},
	
	getParticleVelocitySpanX: function() { //particle spawn-velocitySpan X
		return this.particleVelocitySpan.x;
	},
	
	getParticleVelocitySpanY: function() { //particle spawn-velocitySpan Y
		return this.particleVelocitySpan.y;
	}
};

//-------------------------SMOKE------------------------//
			          //  x,y         int             ms            float              x,y               +- x,y			      ms					ms
EmitterSmoke = function(position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan, particleLifetime, particleLifetimeSpan) {

	EmitterSmoke.baseConstructor.call(this, position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan);

	this.particleLifetime = particleLifetime; // +- particleLifetimeSpan
	this.particleLifetimeSpan = particleLifetimeSpan;

};

InheritenceManager.extend(EmitterSmoke, EmitterBase);

EmitterSmoke.prototype.spawnParticle = function() { //clearInterval(int) when done	
	if(this.particles.length < this.maxParticles) {
		var tmpPos = {
			x: this.position.x, 
			y: this.position.y
		}
		var tmpVelocity = {
			x: this.particleVelocity.x + (Math.random() * this.particleVelocitySpan.x*2) - this.particleVelocitySpan.x, 
			y: this.particleVelocity.y + (Math.random() * this.particleVelocitySpan.y*2) - this.particleVelocitySpan.y
		}
		var tmpDiameter = this.particleDiameter;
		var tmpRotation = Math.random()*2*Math.PI;
		var tmpLifetime = this.particleLifetime + (Math.random() * this.particleLifetimeSpan*2) - this.particleLifetimeSpan;
		this.particles.push(new ParticleSmoke(tmpPos, tmpVelocity, tmpDiameter, tmpRotation, tmpLifetime));
	}			
};
	
EmitterSmoke.prototype.updateParticles = function() { //clearInterval(int) when done
	for(var i = 0; i < this.particles.length; i++) {
		if(this.particles[i].getLifetime() < 0) { //time for the particle to die?
			this.particles.splice(i,1);
			i--;
		}
		else {
			this.particles[i].decreaseLifetime(this.updateTime);
			this.particles[i].updatePosition();
			this.particles[i].increaseVelocityWithValue(world.windVelocity);
		}				
	}
};

//-------------------------FIRE------------------------//
			          //  x,y         int             ms            float              x,y               +- x,y			      ms					ms
EmitterFire = function(position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan, particleLifetime, particleLifetimeSpan) {

	EmitterFire.baseConstructor.call(this, position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan);

	this.particleLifetime = particleLifetime; // +- particleLifetimeSpan
	this.particleLifetimeSpan = particleLifetimeSpan;
};

InheritenceManager.extend(EmitterFire, EmitterBase);

EmitterFire.prototype.spawnParticle = function() { //clearInterval(int) when done	
	if(this.particles.length < this.maxParticles) {
		var tmpPos = {
			x: this.position.x, 
			y: this.position.y
		}
		var tmpVelocity = {
			x: this.particleVelocity.x + (Math.random() * this.particleVelocitySpan.x*2) - this.particleVelocitySpan.x, 
			y: this.particleVelocity.y + (Math.random() * this.particleVelocitySpan.y*2) - this.particleVelocitySpan.y
		}
		var tmpDiameter = this.particleDiameter;
		var tmpRotation = Math.random()*2*Math.PI;
		var tmpLifetime = this.particleLifetime + (Math.random() * this.particleLifetimeSpan*2) - this.particleLifetimeSpan;
		this.particles.push(new ParticleFire(tmpPos, tmpVelocity, tmpDiameter, tmpRotation, tmpLifetime));
	}			
};
	
EmitterFire.prototype.updateParticles = function() { //clearInterval(int) when done
	
	for(var i = 0; i < this.particles.length; i++) {
		if(this.particles[i].getLifetime() < 0) { //time for the particle to die?
			this.particles.splice(i,1);
			i--;
		}
		else {
		this.particles[i].decreaseLifetime(this.updateTime);
		this.particles[i].updatePosition();
		this.particles[i].increaseVelocityWithValue(world.windVelocity);
		}	
	}
};

//-------------------------RAIN------------------------// USING QUADTREE
			          //   int             ms              x,y               +- x,y	
EmitterRain = function(maxParticles, spawnInterval, particleVelocity, particleVelocitySpan) {
	this.maxParticles = maxParticles;
	this.spawnInterval = spawnInterval;
	this.particleVelocity = particleVelocity;
	this.particleVelocitySpan = particleVelocitySpan;
	this.updateTime = 10;
	
	this.particles = new Array(); //the particles for this emitter
	
	this.spawnSpanWidth = gl.viewportWidth/2 + 500;
	this.spawnSpanHeight = gl.viewportHeight + 100;
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.setSpawnInterval = setInterval(function(){_this.spawnParticle()}, _this.spawnInterval);
	this.setUpdateInterval = setInterval(function(){_this.updateParticles()}, _this.updateTime);
};

EmitterRain.prototype.spawnParticle = function() { //clearInterval(int) when done	
	if(this.particles.length < this.maxParticles) {
		
		var spawnCenter = world.player.getPosition();
		//console.log(spawnCenter);
		var tmpPos = {
			x: spawnCenter.x + (Math.random()*2*this.spawnSpanWidth - this.spawnSpanWidth), 
			y: spawnCenter.y + this.spawnSpanHeight
		}
		var tmpVelocity = {
			x: this.particleVelocity[0] + (Math.random() * this.particleVelocitySpan[0]*2) - this.particleVelocitySpan[0] + world.windVelocity.x, 
			y: this.particleVelocity[1] + (Math.random() * this.particleVelocitySpan[1]*2) - this.particleVelocitySpan[1] + world.windVelocity.y
		}
		var tmpTTL = 2000;
		
		this.particles.push(new ParticleRainDrop(tmpPos, tmpVelocity, tmpTTL));
	}			
};
	
EmitterRain.prototype.updateParticles = function() { //clearInterval(int) when done
	for(var i = 0; i < this.particles.length; i++) {
		
		this.particles[i].updatePosition();
		
		if(this.particles[i].getLifetime() < 0 || this.particles[i].getPosition().x < 0 || this.particles[i].getPosition().x > world.worldSize.x
											   || this.particles[i].getPosition().y < 0 || this.particles[i].getPosition().y > world.worldSize.y ) { //time for the particle to die?
			this.particles.splice(i,1);
			i--;
		}
		else {
		this.particles[i].decreaseLifetime(this.updateTime);
		this.particles[i].updatePosition();
		}		
	}
};

EmitterRain.prototype.getParticles = function() {
	return this.particles;
};

EmitterRain.prototype.getParticlesAsArray = function() {	
	var posArray = [];
	for(var i = 0; i < this.particles.length; i++) {
		var tmpPos = this.particles[i].getPosition();
		//console.log(tmpPos);
		posArray.push(tmpPos.x, tmpPos.y);
	}

	return posArray;
};

