
				//  x,y         int             ms               ms                   +- ms              float             radians             +- raidans
Emitter = function(position, maxParticles, spawnInterval, particleLifetime, particleLifeTimeSpan, particleVelocity, particleDirection, particleDirectionSpan) {
	this.position = {
		x: position[0], 
		y: position[1]
	}
	this.maxParticles = maxParticles;
	this.particles = new Array();
	this.particleLifetime = particleLifetime; // +- particleDirectionSpan
	this.particleDirectionSpan = particleDirectionSpan;
	this.particleVelocity = particleVelocity; //+-100
	this.particleDirection = particleDirection; // +- particleDirectionSpan
	this.particleDirectionSpan = particleDirectionSpan;
	this.updateTime = 10;
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	setInterval(function(){_this.spawnParticle()}, spawnInterval);
	setInterval(function(){_this.updateParticles()}, _this.updateTime);

};

Emitter.prototype = {

	spawnParticle: function() {	//clearInterval(int) when done	
		if(this.particles.length < this.maxParticles) {
			var tmpPos = {
				x: this.position.x, 
				y: this.position.y
			}
			var tmpVelocity = this.particleVelocity + Math.random() * 0.6 - 0.3;
			var tmpDirection = this.particleDirection + (Math.random() * this.particleDirectionSpan*2) - this.particleDirectionSpan;
			var tmpLifetime = this.particleLifetime + (Math.random() * this.particleLifetime*2) - this.particleLifetime;
			this.particles.push(new Particle(tmpPos, tmpVelocity, tmpDirection, tmpLifetime));
		}
			
	},
	
	updateParticles: function() {	//clearInterval(int) when done
		for(var i = 0; i < this.particles.length; i++) {
			if(this.particles[i].getLifetime() < 0) { //time for the particle to die?
				this.particles.splice(i,1);
				i--;
			}
			else {
				this.particles[i].increaseLifetime(this.updateTime);
				this.particles[i].updatePosition();
			}
				
		}
	}, 
	
	getParticles: function() {
		return this.particles;
	},	
		
	setPosition: function(newPos) {
		this.position = {
			x: newPos[0], 
			y: newPos[1]
		}
	}

};