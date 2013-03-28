Entity = function(pos, bbMin, bbMax) {
	this.position = {
		x: pos[0], 
		y: pos[1]
	};
	this.velocity = vec2.create();
	this.rotation = 0.0;
	this.canJump = false;
	this.isJumping = false;
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
	
	intersects: function(otherBB, otherPos) {
		
		var thisMin = {
			x: this.position.x - this.size.x/2 + this.boundingBox.min.x, 
			y: this.position.y + this.boundingBox.min.y
		}
		
		var thisMax = {
			x: this.position.x - this.size.x/2 + this.boundingBox.max.x, 
			y: this.position.y + this.boundingBox.max.y
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
	
	collidedWith: function(otherBB, otherPos) {
		var thisMin = {
			x: this.position.x - this.size.x/2 + this.boundingBox.min.x, 
			y: this.position.y + this.boundingBox.min.y
		}
		
		var thisMax = {
			x: this.position.x - this.size.x/2 + this.boundingBox.max.x, 
			y: this.position.y + this.boundingBox.max.y
		}
		
		var otherMin = {
			x: otherPos.x + otherBB.min.x, 
			y: otherPos.y + otherBB.min.y
		}
		
		var otherMax = {
			x: otherPos.x + otherBB.max.x, 
			y: otherPos.y + otherBB.max.y
		}
		
		var below = thisMin.y < otherMax.y;
		
		if(below) {
			this.collides = true;
			this.canJump = true;
			this.isJumping = false;
			//this.velocity[1] -= 2.0;
			this.position.y = otherMax.y; //Should use velocity
		} else {
			this.collides = false;
			this.canJump = false;
		}
		
		if(below) console.log("below");
		
	}
	
};

//-------------------player--------------------//

EntityPlayer = function(pos, bbMin, bbMax) {
	EntityPlayer.baseConstructor.call(this, pos, bbMin, bbMax);
	this.size = {
		x: 64, 
		y: 64
	}
};

InheritenceManager.extend(EntityPlayer, Entity); //entityplayer inherites from entity

EntityPlayer.prototype.update = function() {
	
	if(!this.collides)
		this.velocity[1] += 2.0;
	else
		this.velocity[1] = 0.0;
	this.keyPress();
		
	this.position.x += this.velocity[0];
	this.position.y -= this.velocity[1];
};

EntityPlayer.prototype.keyPress = function() {
	
	var maxVel = 5.0;
	
	var velRange = 0.051;
	
	var friction = 0.05;
	
	var speed = 0.5;
	
	if(isKeyDown('W') && this.canJump == true)
		this.velocity[1] -= 20.0;//this.isJumping = true;
	
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
