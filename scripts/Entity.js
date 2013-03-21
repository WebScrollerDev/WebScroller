Entity = function(pos) {
	this.position = pos;
	this.velocity = vec2.create();
	this.rotation = 0.0;
	this.canJump = false;
	this.isJumping = false;
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
	}
	
};

//-------------------player--------------------//

EntityPlayer = function(pos) {
	EntityPlayer.baseConstructor.call(this, pos);
};

InheritenceManager.extend(EntityPlayer, Entity); //entityplayer inherites from entity

EntityPlayer.prototype.update = function() {
	this.velocity[1] = 0.05;
	this.keyPress();
	
	if(this.isJumping == true) {
		if(this.position[1] > 2)
			this.isJumping = false;
		else
			this.velocity[1] -= 0.2;
	}
	
	if(this.position[1] <= 0) {
		this.position[1] = 0;
		this.canJump = true;
		this.isJumping = false;
	} else {
		this.canJump = false;
	}
	

		
	this.position[0] += this.velocity[0];
	this.position[1] -= this.velocity[1];
};

EntityPlayer.prototype.keyPress = function() {
	
	var maxVel = 1.0;
	
	var velRange = 0.051;
	
	var friction = 0.05;
	
	var speed = 0.05;
	
	if(isKeyDown('W') && this.canJump == true)
		this.isJumping = true;
	
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
