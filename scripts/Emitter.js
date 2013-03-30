
//-------------------------BASE------------------------//
			         //  x,y      int      int             ms            float            +- float		       radians             +- raidans
EmitterBase = function(position, scale, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan) {
	this.position = {
		x: position[0], 
		y: position[1]
	}
	this.scale = scale;
	this.particles = new Array();
	this.maxParticles = maxParticles;
	this.spawnInterval = spawnInterval;
	this.particleVelocity = particleVelocity; //+-particleVelocitySpan
	this.particleVelocitySpan = particleVelocitySpan;
	this.particleDirection = particleDirection; // +- particleDirectionSpan
	this.particleDirectionSpan = particleDirectionSpan;
	this.updateTime = 10;
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.setSpawnInterval = setInterval(function(){_this.spawnParticle()}, _this.spawnInterval);
	this.setUpdateInterval = setInterval(function(){_this.updateParticles()}, _this.updateTime);
};

EmitterBase.prototype = { 
	
	getParticles: function() {
		return this.particles;
	},	
		
	setPosition: function(newPos) {
		this.position = {
			x: newPos.x, 
			y: newPos.y
		}
	},
	
	getPosition: function() {
		return this.position;
	},
	
	getParticleScale: function() {
		return this.scale;
	},
	
	stopSpawning: function() {
		clearInterval(this.setSpawnInterval);
	}
};

//-------------------------SMOKE------------------------//
					  //  x,y      int       int            ms              ms                 +- ms              float              +- float		       radians             +- raidans
EmitterSmoke = function(position, scale, maxParticles, spawnInterval, particleLifetime, particleLifetimeSpan, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan) {

	EmitterSmoke.baseConstructor.call(this, position, scale, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan);

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
		var tmpVelocity = this.particleVelocity + (Math.random() * this.particleVelocitySpan*2) - this.particleVelocitySpan;
		var tmpDirection = this.particleDirection + (Math.random() * this.particleDirectionSpan*2) - this.particleDirectionSpan;
		var tmpLifetime = this.particleLifetime + (Math.random() * this.particleLifetimeSpan*2) - this.particleLifetimeSpan;
		this.particles.push(new ParticleSmoke(tmpPos, tmpVelocity, tmpDirection, tmpLifetime));
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

//-------------------------FLUID------------------------//
			          //  x,y      int      int             ms            float            +- float		       radians             +- raidans			  float
EmitterFluid = function(position, scale, maxParticles, spawnInterval,  particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan, particleDensity) {

	EmitterSmoke.baseConstructor.call(this, position, scale, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan);

	this.particleDensity = particleDensity;
};

InheritenceManager.extend(EmitterFluid, EmitterBase);

EmitterFluid.prototype.spawnParticle = function() { //clearInterval(int) when done	
	if(this.particles.length < this.maxParticles) {
		var tmpPos = {
			x: this.position.x, 
			y: this.position.y
		}
		var tmpVelocity = this.particleVelocity + (Math.random() * this.particleVelocitySpan*2) - this.particleVelocitySpan;
		var tmpDirection = this.particleDirection + (Math.random() * this.particleDirectionSpan*2) - this.particleDirectionSpan;
		var tmpDensity = this.particleDensity;
		this.particles.push(new ParticleFluid(tmpPos, tmpVelocity, tmpDirection, tmpDensity));
	}			
};
	
EmitterFluid.prototype.updateParticles = function() { //clearInterval(int) when done
	for(var i = 0; i < this.particles.length; i++) {
		
		var currParticle = this.particles[i];
		currParticle.updatePosition();
		var currX = currParticle.getPosition().x + this.scale/2; //the middle of the particle
		var currY = currParticle.getPosition().y + this.scale/2;
		
		for(var j = i+1; j < this.particles.length; j++) {
			//if(j!=i) { //if not current particle
				var otherParticle = this.particles[j];
				var otherX = otherParticle.getPosition().x + this.scale/2; //the middle of the particle
				var otherY = otherParticle.getPosition().y + this.scale/2;
				
				if( this.scale > Math.sqrt(Math.pow((currX-otherX),2)+Math.pow((currY-otherY),2))) {
					var currDirection = currParticle.getDirection();
					currParticle.setDirection(otherParticle.getDirection());
					otherParticle.setDirection(currDirection);
				}
			//}
		}
		
	
	}
};

