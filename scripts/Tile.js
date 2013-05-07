BoundingBox = function(min, max) {
	this.min = {
		x: min[0], 
		y: min[1]
	};
	this.max = {
		x: max[0], 
		y: max[1]
	};
};

BoundingBox.prototype = {
	getMin: function() {
		return this.min;
	}, 
	
	getMax: function() {
		return this.max;
	}
};

Tile = function(path) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, path, this.tex);
};

Tile.prototype = { 
	
	getTex: function() {
		return this.tex;
	},
	
	setSize: function(size) {
		this.size = {
			x: size[0], 
			y: size[1]
		}
	},
	
	getSize: function() {
		return this.size;
	}
};

//-------------------------------------TILE PLACEABLE-------------------------------//
TilePlaceable = function(tile, pos) {
	this.tile = tile;
	
	this.pos = {
		x: pos[0], 
		y: pos[1], 
		z: pos[2]
	};
	
	this.bbs = new Array();
	this.staticLights = new Array();
	this.flickeringLights = new Array();
	this.morphingLights = new Array();
	this.angle = 0;
	this.moving = false;
};

TilePlaceable.prototype = {
	
	addBoundingBox: function(bounding) {
		this.bbs.push(bounding);
	},
	
	getTile: function() {
		return this.tile;
	},
	
	getPosition: function() {
		return this.pos;
	}, 
	
	getBBs: function() {
		return this.bbs;
	}, 
	
	setMoving: function() {
		this.moving = true;
	}, 
	
	isMoving: function() {
		return this.moving;
	}, 
	
	addStaticLight: function(light) {
		this.staticLights.push(light);
	}, 
	
	addFlickeringLight: function(light) {
		this.flickeringLights.push(light);
	},
	
	addMorphingLight: function(light) {
		this.morphingLights.push(light);
	},
	
	getStaticLights: function() {
		return this.staticLights;
	}, 
	
	getFlickeringLights: function() {
		return this.flickeringLights;
	}, 
	
	getMorphingLights: function() {
		return this.morphingLights;
	}, 
	
	setAngle: function(angle) {
		this.angle = angle;
	}, 
	
	getAngle: function() {
		return this.angle;
	}
};

//-------------------------------------TILE ANIMATED-------------------------------//
					//	tile  x,y,z		
TileAnimated = function(tile, pos, totalNrAnimations, maxNrFramesPerAnimation, nrFramesPerAnimation, animationSpeed) {
	TileAnimated.baseConstructor.call(this, tile, pos);
	
	this.tileStatus = {
		ANIMATION_IDLE: 0,
		ANIMATION_ONE: 1
	}
	
	this.maxAnim = [maxNrFramesPerAnimation, totalNrAnimations];
	this.currAnim = [0, this.tileStatus.ANIMATION_IDLE];
	this.nrFramesPerAnimation = nrFramesPerAnimation;
	this.animationSpeed = animationSpeed;
	this.tbs = new Array();
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.animationInterval = setInterval(function(){_this.animate()}, _this.animationSpeed);
};

InheritenceManager.extend(TileAnimated, TilePlaceable); //TileAnimated inherites from TilePlaceable

TileAnimated.prototype.animate = function() {
	
	if(this.currAnim[1] != 0) {	// if not idle
		if( (this.currAnim[0] + 1) >= this.nrFramesPerAnimation[this.currAnim[1]]) {
			this.changeStatus(0);	// set the animation to idle
		}
		else
			this.currAnim[0]++;
	}
	else {	// if idle
		if( (this.currAnim[0] + 1) >= this.nrFramesPerAnimation[this.currAnim[1]])
			this.currAnim[0] = 0;	// loop the animation
		else
			this.currAnim[0]++;
	}
};

TileAnimated.prototype.addTriggerBox = function(trigger) {
	this.tbs.push(trigger);
};

TileAnimated.prototype.getTriggerBox = function() {
	return this.tbs;
};

TileAnimated.prototype.changeStatus = function(newState) {
	if(newState != this.currAnim[1]) {
		this.currAnim[0] = 0;
		this.currAnim[1] = newState;
	}
};

TileAnimated.prototype.getCurrAnim = function() {
	return this.currAnim;
};

TileAnimated.prototype.getMaxAnim = function() {
	return this.maxAnim;
};

