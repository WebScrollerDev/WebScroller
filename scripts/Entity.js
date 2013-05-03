Entity = function(pos, bbMin, bbMax) {
	this.position = {
		x: pos[0], 
		y: pos[1]
	};
	this.prevPosition = {
		x: pos[0], 
		y: pos[1]
	};
	this.velocity = vec2.create();
	this.rotation = 0.0;
	this.boundingBox = new BoundingBox(bbMin, bbMax);
	this.collides = false;
}

Entity.prototype = {
	
	setPosition: function(newPos) {
		this.position = newPos;
	},
	
	getPosition: function() {
		return jQuery.extend(true, {}, this.position);
	},
	
	setPrevPosition: function(newPos) {
		this.prevPosition = newPos;
	},
	
	getPrevPosition: function() {
		return this.prevPosition;
	},
	
	setVelocity: function(newVelocity) {
		this.velocity = newVelocity;
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
	
	intersects2: function(bb) {
		
		var tmpBB = new OBB([this.position.x + this.velocity[0], this.position.y + this.velocity[1]], [this.obb.centerLocal.x, this.obb.centerLocal.y], [this.obb.size.x, this.obb.size.y], this.obb.angle);
		return tmpBB.overlaps(bb);
	}, 
	
	intersects: function(otherBB, otherPos) {
		
		var thisMin = {
			x: (this.position.x + this.velocity[0]) - this.size.x/2 + this.boundingBox.min.x, 
			y: (this.position.y + this.velocity[1] + 0.5) + this.boundingBox.min.y
		}
		
		var thisMax = {
			x: (this.position.x + this.velocity[0]) - this.size.x/2 + this.boundingBox.max.x, 
			y: (this.position.y + this.velocity[1] + 0.5) + this.boundingBox.max.y
		}
		
		var otherMin = {
			x: otherPos.x + otherBB.min.x, 
			y: otherPos.y + otherBB.min.y
		}
		
		var otherMax = {
			x: otherPos.x + otherBB.max.x, 
			y: otherPos.y + otherBB.max.y
		}
		
		if(thisMin.x > otherMax.x) return false;
		if(thisMin.y > otherMax.y) return false;
		
		if(thisMax.x < otherMin.x) return false;
		if(thisMax.y < otherMin.y) return false;
		
		
		return true;
	}, 
	
	collidedWith: function(otherBB) {
		var thisMinX = {
			x: (this.position.x + this.velocity[0]) + this.boundingBox.min.x, 
			y: this.position.y + this.boundingBox.min.y
		}
		
		var thisMaxX = {
			x: (this.position.x + this.velocity[0]) + this.boundingBox.max.x, 
			y: this.position.y + this.boundingBox.max.y
		}
		
		var thisMinY = {
			x: this.position.x + this.boundingBox.min.x, 
			y: (this.position.y + this.velocity[1]) + this.boundingBox.min.y
		}
		
		var thisMaxY = {
			x: this.position.x + this.boundingBox.max.x, 
			y: (this.position.y + this.velocity[1]) + this.boundingBox.max.y
		}
		
		var otherMin = {
			x: otherBB.min.x, 
			y: otherBB.min.y
		}
		
		var otherMax = {
			x: otherBB.max.x, 
			y: otherBB.max.y
		}
		
		var below = thisMinY.y < otherMax.y;
		var belowNoVel = thisMinX.y < otherMax.y;
		var right = thisMaxX.x > otherMin.x;
		var rightNoVel = thisMaxY.x > otherMin.x;
		var left = thisMinX.x < otherMax.x;
		var leftNoVel = thisMinY.x < otherMax.x;
		var above = thisMaxY.y > otherMin.y;
		var aboveNoVel = thisMaxX.y > otherMin.y;
		
		
		
		
		if((rightNoVel || leftNoVel)  && belowNoVel) {
			if(!below)
				this.collides = false;
			if(aboveNoVel)
				this.velocity[0] = 0.0;
		}
		
		
		if(below && rightNoVel && leftNoVel) {
			if(aboveNoVel)
				this.collides = true;
			this.velocity[1] = 0.0;
		}
	}, 
	
	collidedWith2: function(obb) {
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
		var velocity_p = vec2.dot(this.velocity, normal_firstBB[0]);
		var velocity_q = vec2.dot(this.velocity, normal_firstBB[1]);
		var velocity_r = vec2.dot(this.velocity, normal_secondBB[0]);
		var velocity_s = vec2.dot(this.velocity, normal_secondBB[1]);
		
		/*var p = result_P1.min_proj + velocity_p < result_P2.max_proj && result_P1.max_proj + velocity_p > result_P2.min_proj;
		var q = result_Q1.min_proj + velocity_q < result_Q2.max_proj && result_Q1.max_proj + velocity_q > result_Q2.min_proj;
		var r = result_R1.min_proj + velocity_r < result_R2.max_proj && result_R1.max_proj + velocity_r > result_R2.min_proj;
		var s = result_S1.min_proj + velocity_s < result_S2.max_proj && result_S1.max_proj + velocity_s > result_S2.min_proj;
		if(r) {
			this.collides = true;

			if(vec2.dot(normal_secondBB[3], [0, 1]) != 0)
				this.velocity = normal_secondBB[3];
			else
				this.velocity[1] = 0;
		}*/
		
		
		//var p = result_P1.min_proj + velocity_p < result_P2.max_proj && result_P1.max_proj + velocity_p > result_P2.min_proj;
		//var q = result_Q1.min_proj + velocity_q < result_Q2.max_proj && result_Q1.max_proj + velocity_q > result_Q2.min_proj;
		var below = result_R1.min_proj + velocity_r < result_R2.max_proj;
		var belowNoVel = result_R1.min_proj < result_R2.max_proj;
		var above = result_R1.max_proj + velocity_r > result_R2.min_proj;
		var aboveNoVel = result_R1.max_proj > result_R2.min_proj;
		
		var right = result_S1.max_proj + velocity_s > result_S2.min_proj;
		var rightNoVel = result_S1.max_proj > result_S2.min_proj;
		var left = result_S1.min_proj + velocity_s < result_S2.max_proj;
		var leftNoVel = result_S1.min_proj < result_S2.max_proj;
		
		if(below) {
			this.collides = true;

			if(vec2.dot(normal_secondBB[3], [0, 1]) != 0)
				this.velocity = normal_secondBB[3];
			else {
				this.velocity[1] = 0;
			}
		}
		
		//console.log("below: " + below + " above: " + above + " left: " + left + " right: " + right);
			
	}, 
	
	setColliding: function(collides) {
		this.collides = collides;
	}
};

//-------------------player--------------------//

EntityPlayer = function(pos, bbMin, bbMax) {
	EntityPlayer.baseConstructor.call(this, pos, bbMin, bbMax);
	
	this.size = {
		x: 45, 
		y: 64
	}
	
	this.obb = new OBB(pos, [this.size.x/2, this.size.y/2], [this.size.x, this.size.y], 0);
	
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
};

InheritenceManager.extend(EntityPlayer, Entity); //entityplayer inherites from entity

EntityPlayer.prototype.preCollision = function() {
	if(!this.collides)
		this.velocity[1] -= 0.5; // gravity

	this.keyPress();
}

EntityPlayer.prototype.getSize = function() {
	return jQuery.extend(true, {}, this.size);
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
	
	//console.log(this.status);
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
	
	var maxVel = 5.0;
	
	var velRange = 0.051;
	
	var friction = 0.05;
	
	var speed = 0.5;
	
	if(isKeyDown('W') && this.collides) {
		this.velocity[1] += 13.0;
		this.isJumping = true;
	}
		
	if(isKeyDown('S')) {
		this.velocity[1] -= speed;
	}
	if(isKeyDown('A') && isKeyDown('D'))
		return;
	
	if(isKeyDown('A')) {
		if(this.velocity[0] > -maxVel)
			this.velocity[0] -= speed;
	}
	else if(isKeyDown('D')) {
		if(this.velocity[0] < maxVel)
			this.velocity[0] += speed;
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
	return jQuery.extend(true, {}, this.obb);
}
//-------------------enemy--------------------//

EntityEnemy = function(pos) {
	EntityEnemy.baseConstructor.call(this, pos);
};

InheritenceManager.extend(EntityEnemy, Entity); //entityenemy inherites from entity

EntityEnemy.prototype.update = function() {
	//this.position += this.velocity;
};
