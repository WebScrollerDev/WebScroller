
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
		}	
	}
};

//-------------------------FLUID------------------------//
			          //  x,y         int             ms             float            x,y               +- x,y			     float
EmitterFluid = function(position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan, particleDensity) {


	EmitterSmoke.baseConstructor.call(this, position, maxParticles, spawnInterval, particleDiameter, particleVelocity, particleVelocitySpan);

	this.particleDensity = particleDensity;
	this.particleGrid = new Array(100,100);
};

InheritenceManager.extend(EmitterFluid, EmitterBase);

EmitterFluid.prototype.spawnParticle = function() { //clearInterval(int) when done	
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
		var tmpRotation = 0;
		var tmpDensity = this.particleDensity;
		this.particles.push(new ParticleFluid(tmpPos, tmpVelocity, tmpDiameter, tmpRotation, tmpDensity));
	}			
};
	
EmitterFluid.prototype.updateParticles = function() { //clearInterval(int) when done
	for(var i = 0; i < this.particles.length; i++) {
		
		var currParticle = this.particles[i];
		currParticle.updatePosition();
		var currX = currParticle.getPosition().x + currParticle.getDiameter()/2; //the middle of the particle
		var currY = currParticle.getPosition().y + currParticle.getDiameter()/2;
		
		for(var j = i+1; j < this.particles.length; j++) {
				var otherParticle = this.particles[j];
				var otherX = otherParticle.getPosition().x + otherParticle.getDiameter()/2; //the middle of the particle
				var otherY = otherParticle.getPosition().y + otherParticle.getDiameter()/2;
				
				if( ((currParticle.getDiameter()/2) + (otherParticle.getDiameter()/2)) > Math.sqrt(Math.pow((currX-otherX),2)+Math.pow((currY-otherY),2))) {
					//console.log("COLLISION");
					var currVelocity = currParticle.getVelocity();
					currParticle.setVelocity(otherParticle.getVelocity());
					otherParticle.setVelocity(currVelocity);
				}
		}
		
	
	}
};

