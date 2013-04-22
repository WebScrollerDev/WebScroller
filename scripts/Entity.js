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
		return this.position;
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

EntityPlayer.prototype.temp = function() {
	this.velocity[1] -= 0.5; // gravity

	this.keyPress();
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
		this.velocity[1] += 12.0;//this.isJumping = true;
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
//-------------------enemy--------------------//

EntityEnemy = function(pos) {
	EntityEnemy.baseConstructor.call(this, pos);
};

InheritenceManager.extend(EntityEnemy, Entity); //entityenemy inherites from entity

EntityEnemy.prototype.update = function() {
	//this.position += this.velocity;
};
