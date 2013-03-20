Entity = function() {
	this.position = vec3.create();
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

EntityPlayer = function() {
	EntityPlayer.baseConstructor.call(this);
};

InheritenceManager.extend(EntityPlayer, Entity); //entityplayer inherites from entity

EntityPlayer.prototype.update = function() {
	this.position += velocity;
};

//-------------------enemy--------------------//

EntityEnemy = function() {
	EntityEnemy.baseConstructor.call(this);
};

InheritenceManager.extend(EntityEnemy, Entity); //entityenemy inherites from entity

EntityEnemy.prototype.update = function() {
	this.position += velocity;
};
