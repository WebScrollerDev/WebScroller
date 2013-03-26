Emitter = function(position, maxParticles, spawnInterval, particleLifetime, particleVelocity, particleDirection) {
	this.position = {
		x: position[0], 
		y: position[1]
	}
	this.maxParticles = maxParticles;
	//this.spawnDirection = spawnDirection;
	//this.spawnAngleSpan = spawnAngleSpan;
	this.particles = new Array();
	this.particleLifetime = particleLifetime; //+-100
	this.particleVelocity = particleVelocity; //+-100
	this.particleDirection = particleDirection; //+-100
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
			this.particles.push(new Particle(tmpPos, this.particleVelocity, this.particleDirection));
		}
			
	},
	
	updateParticles: function() {	//clearInterval(int) when done
		for(var i = 0; i < this.particles.length; i++) {
			if(this.particles[i].getLifetime() > this.particleLifetime) { //time for the particle to die?
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
	}

};