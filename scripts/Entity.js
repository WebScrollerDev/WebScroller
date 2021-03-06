Entity = function(bbMin, bbMax) {
	this.position = {
		x: 0, 
		y: 0
	};
	this.prevPosition = {
		x: 0, 
		y: 0
	};
	this.velocity = vec2.create();
	this.rotation = 0.0;
	this.boundingBox = new BoundingBox(bbMin, bbMax);
	this.collides = false;
	this.maxVel = 5.0;
}

Entity.prototype = {
	
	setPosition: function(newPos) {
		this.position = {
			x: newPos[0], 
			y: newPos[1]
		};
	},
	
	getPosition: function() {
		return {
			x: this.position.x, 
			y: this.position.y
		}
		//return jQuery.extend(true, {}, this.position);
	},
	
	setPrevPosition: function(newPos) {
		this.prevPosition = newPos;
	},
	
	getPrevPosition: function() {
		return {
			x: this.prevPosition.x, 
			y: this.prevPosition.y
		}
		//return jQuery.extend(true, {}, this.prevPosition);
	},
	
	setVelocity: function(newVelocity) {
		this.velocity = newVelocity;
	},
	
	setVelocityX: function(newX) {
		this.velocity[0] = newX;
	},

	setVelocityY: function(newY) {
		this.velocity[1] = newY;
	},
	
	getVelocity: function() {
		return this.velocity;
	},
	
	setRotation: function(newRot) {
		this.rotation = newRot;
	},
	
	getRotation: function() {
		return this.rotation;
	}, 
	
	collidedWith: function(obb) {
		
		var normal_firstBB = this.obb.getNormals();
		var normal_secondBB = obb.getNormals();
		//Result of P, Q
		var result_P1 = world.getMinMax(this.obb, normal_firstBB[0]);
		var result_P2 = world.getMinMax(obb, normal_firstBB[0]);
		
		var result_Q1 = world.getMinMax(this.obb, normal_firstBB[1]);
		var result_Q2 = world.getMinMax(obb, normal_firstBB[1]);
		
		//results of R, S
		var result_R1 = world.getMinMax(this.obb, normal_secondBB[0]);
		var result_R2 = world.getMinMax(obb, normal_secondBB[0]);
		
		var result_S1 = world.getMinMax(this.obb, normal_secondBB[1]);
		var result_S2 = world.getMinMax(obb, normal_secondBB[1]);
		
		//Player velocity along P/Q/R/S axis
		var newVel = [this.velocity[0], this.velocity[1] - 0.5];
		
		var velocity_p = vec2.dot(newVel, normal_firstBB[0]);
		var velocity_r = vec2.dot(newVel, normal_secondBB[0]);
		var velocity_q = vec2.dot(newVel, normal_firstBB[1]);
		var velocity_s = vec2.dot(newVel, normal_secondBB[1]);
		
		//velocity_r = 0;
		//console.log(velocity_r);
		//var minLessMin = result_R1.min_proj + velocity_r < result_R2.min_proj;
		var minLessMax = result_R1.min_proj + velocity_r < result_R2.max_proj;
		/*var maxLessMin = result_R1.max_proj + velocity_r < result_R2.min_proj;
		var maxLessMax = result_R1.max_proj + velocity_r < result_R2.max_proj;
		
		var minMoreMin = result_R1.min_proj + velocity_r > result_R2.min_proj;
		var minMoreMax = result_R1.min_proj + velocity_r > result_R2.max_proj;
		var maxMoreMin = result_R1.max_proj + velocity_r > result_R2.min_proj;
		var maxMoreMax = result_R1.max_proj + velocity_r > result_R2.max_proj;*/
		
		var minLessMinNoVel = result_R1.min_proj < result_R2.min_proj;
		var minLessMaxNoVel = result_R1.min_proj < result_R2.max_proj;
		var maxLessMinNoVel = result_R1.max_proj < result_R2.min_proj;
		var maxLessMaxNoVel = result_R1.max_proj < result_R2.max_proj;
		
		var minMoreMinNoVel = result_R1.min_proj > result_R2.min_proj;
		var minMoreMaxNoVel = result_R1.min_proj > result_R2.max_proj;
		var maxMoreMinNoVel = result_R1.max_proj > result_R2.min_proj;
		var maxMoreMaxNoVel = result_R1.max_proj > result_R2.max_proj;
		
		var insideTop = (result_S1.max_proj + velocity_s > result_S2.min_proj) && (result_S1.min_proj + velocity_s < result_S2.max_proj);
		var insideTopNoVel = (result_S1.max_proj > result_S2.min_proj) && (result_S1.min_proj < result_S2.max_proj);
		
		var under = result_R1.max_proj < result_R2.min_proj;
		var above = result_R1.min_proj > result_R2.max_proj;
		
		var playerMinMoreMaxP = result_P1.min_proj > result_P2.max_proj;
		var playerMinMoreMaxQ = result_Q1.min_proj > result_Q2.max_proj || result_Q1.max_proj < result_Q2.min_proj;
		if(playerMinMoreMaxP) {
			this.collides = true;
			this.angle = 0;
			this.velocity[1] = 0;
		} else if(playerMinMoreMaxQ) {
			this.collides = false;
			this.velocity[0] = 0;
		} else {
			if(minLessMax) {
				if(above) {
					this.angle = obb.angle;
					this.collides = true;
					var dot = vec2.dot(normal_secondBB[0], [1, 0]);
					if(dot != 0) { //Leaning
						var speed = vec2.clone(normal_secondBB[1]);
						speed[0] *= dot*this.maxVel*1.3;
						speed[1] *= dot*this.maxVel*1.3;
						
						//this.keyPress2(speed);
						
						this.velocity = speed;
						//this.velocity = vec2.add(vec2.create(), this.velocity, speed);
					} else { //No leaning
						if(insideTopNoVel)
							this.velocity[1] = 0;
					}
				} else {
					this.collides = false;
					this.velocity[1] = 0;
					this.velocity[0] = 0;
				}
					
			}
			var bottom = (minLessMaxNoVel && minMoreMinNoVel);
			var top = (maxLessMaxNoVel && maxMoreMinNoVel);
			var none = (maxMoreMaxNoVel && minLessMinNoVel);
			
			var rightOfObject = result_S1.min_proj > result_S2.max_proj;
			var leftOfObject = result_S1.max_proj < result_S2.min_proj;
			
			if(none || bottom || top) {
				var rightSlide = Math.acos(vec2.dot(normal_secondBB[1], [0, 1])) < Math.PI/2;
				var leftSlide = Math.acos(vec2.dot(normal_secondBB[3], [0, 1])) < Math.PI/2;
				
				//console.log("rightOfObject: " + rightOfObject + " leftOfObject: " + leftOfObject + " rightSlide: " + rightSlide + " leftSlide: " + leftSlide);
				if(rightSlide) {
					if(rightOfObject) {
						this.angle = obb.angle - Math.PI/2;
						this.collides = true;
						var dot = vec2.dot(normal_secondBB[1], [1, 0]);
						var speed = vec2.clone(normal_secondBB[2]);
						speed[0] *= dot*this.maxVel*1.3;
						speed[1] *= dot*this.maxVel*1.3;
						//this.keyPress2(speed);
						
						this.velocity = speed;
						//this.velocity = vec2.mul(vec2.create(), this.velocity, normal_secondBB[2]);
					}
					else if(leftOfObject) {
						this.collides = false;
						this.velocity[0] = 0;
					}
				}
				else if(leftSlide) {
					if(leftOfObject) {
						this.angle = obb.angle + Math.PI/2;
						this.collides = true;
						var dot = vec2.dot(normal_secondBB[1], [1, 0]);
						var speed = vec2.clone(normal_secondBB[2]);
						speed[0] *= dot*this.maxVel*1.3;
						speed[1] *= dot*this.maxVel*1.3;
						//this.keyPress2(speed);
						
						this.velocity = speed;
						//this.velocity = vec2.mul(vec2.create(), this.velocity, normal_secondBB[3]);
					}
					else if(rightOfObject) {
						this.collides = false;
						this.velocity[0] = 0;
					}
				} else {
					this.collides = false;
					this.velocity[0] = 0;
				}
			}
		}
		
	}, 
	
	setColliding: function(collides) {
		this.collides = collides;
	}
};

//-------------------player--------------------//

EntityPlayer = function(bbMin, bbMax) {
	EntityPlayer.baseConstructor.call(this, bbMin, bbMax);
	
	this.size = {
		x: 45, 
		y: 64
	}
	
	this.obb = new OBB([0, 0, 0], [this.size.x/2, this.size.y/2], [this.size.x, this.size.y], 0);
	
	this.playerStatus = {
		IDLE: 0,
		RUNNING: 1,
		JUMPING: 2,
		FALLING: 3	
	}

	this.status = this.playerStatus.IDLE;
	
	this.totalNrAnimations = 11;
	this.totalNrFramesPerAnimation = 11;
	
	this.maxFramePerAnimation = [11, 3, 11, 11];
	
	this.currFrame = 0;
	this.counter = 0;
	this.flipped = false;
	
	this.angle = 0;
};

InheritenceManager.extend(EntityPlayer, Entity); //entityplayer inherites from entity

EntityPlayer.prototype.preCollision = function() {
	if(!this.collides)
		this.velocity[1] -= 0.5; // gravity
	this.keyPress();
}

EntityPlayer.prototype.keyPress2 = function(vel) {
	if(isKeyDown('D')) {
		vel[0] += Math.cos(this.angle)*this.maxVel;
		vel[1] += Math.sin(this.angle)*this.maxVel;
	}
	else if(isKeyDown('A')) {
		vel[0] -= Math.cos(this.angle)*this.maxVel;
		vel[1] += Math.sin(this.angle)*this.maxVel;
	}
}

EntityPlayer.prototype.getSize = function() {
	return {
			x: this.size.x, 
			y: this.size.y
		}
	//return jQuery.extend(true, {}, this.size);
}

EntityPlayer.prototype.update = function() {
	
	this.counter++;
	if(this.currFrame >= this.maxFramePerAnimation[this.status])
		this.currFrame = 0;
		
	if(this.counter % 10 == 0)
		this.currFrame++;
	
	this.prevPosition.x = this.position.x;
	this.prevPosition.y = this.position.y;

	this.position.x += this.velocity[0];
	this.position.y += this.velocity[1];
	
//--------------------UPDATE PLAYER STATUS-----------------------//
	if(!this.collides && this.velocity[1] < 0.) { // falling
		this.changeStatus(this.playerStatus.FALLING);
	}
	else if(!this.collides && this.velocity[1] > 0.) { // jumping
		this.changeStatus(this.playerStatus.JUMPING);
	}
	else if(this.collides && this.velocity[0] != 0. ) { // running
		this.changeStatus(this.playerStatus.RUNNING);
	}
	else if(this.collides && this. velocity[0] == 0) { // idle
		this.changeStatus(this.playerStatus.IDLE);
	}
	
	if(this.velocity[0] > 0)
		this.flipped = false;
	else if(this.velocity[0] < 0)
		this.flipped = true;
	
	this.obb.updatePosition(this.position);
};

EntityPlayer.prototype.changeStatus = function(newState) {
	if(newState != this.status) {
		this.currFrame = 0;
		this.status = newState;
	}
} 

EntityPlayer.prototype.getStatus = function() {
	return this.status;
};

EntityPlayer.prototype.keyPress = function() {
	
	var velRange = 0.21;
	
	var friction = 0.2;
	
	var speed = 0.5;
	if(isKeyDown('W') && this.collides) {
		this.velocity[0] += -Math.sin(this.angle)*13.0;
		this.velocity[1] += Math.cos(this.angle)*13.0;
		this.isJumping = true;
	}
		
	if(isKeyDown('S')) {
		this.velocity[1] -= speed;
	}
	if(isKeyDown('A') && isKeyDown('D'))
		return;
	
	if(isKeyDown('A')) {
		if(vec2.dot(this.velocity, [1, 0]) > -this.maxVel) {
			if(this.collides) {
				this.velocity[0] -= Math.cos(this.angle)*speed;
				this.velocity[1] += Math.sin(this.angle)*speed;
			} else {
				this.velocity[0] -= speed;
			}
		}
	}
	else if(isKeyDown('D')) {
		if(vec2.dot(this.velocity, [1, 0]) < this.maxVel) {
			if(this.collides) {
				this.velocity[0] += Math.cos(this.angle)*speed;
				this.velocity[1] += Math.sin(this.angle)*speed;
			} else {
				this.velocity[0] += speed;
			}
			
		}
	}
	else {
		if(this.velocity[0] > velRange)
			this.velocity[0] -= friction;
		else if(this.velocity[0] < -velRange)
			this.velocity[0] += friction;
		else
			this.velocity[0] = 0.0;
	}
};

EntityPlayer.prototype.getObb = function() {
	return this.obb;
	//return jQuery.extend(true, {}, this.obb);
}
//-------------------enemy--------------------//

EntityEnemy = function(pos) {
	EntityEnemy.baseConstructor.call(this, pos);
};

InheritenceManager.extend(EntityEnemy, Entity); //entityenemy inherites from entity

EntityEnemy.prototype.update = function() {
	//this.position += this.velocity;
};
