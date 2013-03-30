
//-------------------------BASE------------------------//
			         //  x,y           int            int             ms            float            +- float		       radians             +- raidans
EmitterBase = function(position, particleDiameter, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan) {
	this.position = {
		x: position[0], 
		y: position[1]
	}
	this.particleDiameter = particleDiameter;
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
	
	stopSpawning: function() {
		clearInterval(this.setSpawnInterval);
	},
	
//------------------Set Functions------------------//	
	setPosition: function(newPos) {
		this.position = {
			x: newPos.x, 
			y: newPos.y
		}
	},
	
	setPositionX: function(newX) {
		this.position.x = newX;
	},
	
	setPositionY: function(newY) {
		this.position.y = newY;
	},
	
//------------------Get Functions------------------//	
	getPosition: function() {
		return this.position;
	},
	
	getPositionX: function() {
		return this.position.x;
	},
	
	getPositionY: function() {
		return this.position.y;
	},
	
	getParticleDiameter: function() {
		return this.particleDiameter;
	}
};

//-------------------------SMOKE------------------------//
					  //  x,y            int            int            ms              ms                 +- ms              float              +- float		       radians             +- raidans
EmitterSmoke = function(position, particleDiameter, maxParticles, spawnInterval, particleLifetime, particleLifetimeSpan, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan) {

	EmitterSmoke.baseConstructor.call(this, position, particleDiameter, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan);

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
		var tmpDiameter = this.particleDiameter;
		this.particles.push(new ParticleSmoke(tmpPos, tmpVelocity, tmpDirection, tmpLifetime, tmpDiameter));
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
			          //  x,y           int             int             ms            float            +- float		       radians             +- raidans			  float
EmitterFluid = function(position, particleDiameter, maxParticles, spawnInterval,  particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan, particleDensity) {

	EmitterSmoke.baseConstructor.call(this, position, particleDiameter, maxParticles, spawnInterval, particleVelocity, particleVelocitySpan, particleDirection, particleDirectionSpan);

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
		var tmpDiameter = this.particleDiameter;
		this.particles.push(new ParticleFluid(tmpPos, tmpVelocity, tmpDirection, tmpDiameter, tmpDensity));
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
					console.log("COLLISION");
					var currDirection = currParticle.getDirection();
					currParticle.setDirection(otherParticle.getDirection());
					otherParticle.setDirection(currDirection);
				}
		}
		
	
	}
};

