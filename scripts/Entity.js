Entity = function(pos) {
	this.position = pos;
	this.velocity = vec2.create();
	this.rotation = 0.0;
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
	this.keyPress();
	
	/*if(this.velocity[0] > 0.009)
		this.velocity[0] -= 0.0005;
	else if(this.velocity[0] < -0.009)
		this.velocity[0] += 0.0005;
	else
		this.velocity[0] = 0.0;*/
	
	this.position[0] += this.velocity[0];
};

EntityPlayer.prototype.keyPress = function() {
	
	var maxVel = 0.001;
	
	var velRange = 0.009;
	
	var friction = 0.001;
	
	var speed = 0.0001;
	
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
	
	/*if(isKeyDown('D'))
		if(this.velocity[0] < maxVel)
			this.velocity[0] += 0.005;
	else {
		if(this.velocity[0] > velRange)
			this.velocity[0] += 0.0005;
	}*/
};
//-------------------enemy--------------------//

EntityEnemy = function(pos) {
	EntityEnemy.baseConstructor.call(this, pos);
};

InheritenceManager.extend(EntityEnemy, Entity); //entityenemy inherites from entity

EntityEnemy.prototype.update = function() {
	//this.position += this.velocity;
};
