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

Tile = function(gl, path) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, path, this.tex);
};

Tile.prototype = { 
	
	getTex: function() {
		return this.tex;
	}, 
	
	setSize: function(size) {
		this.size = size;
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
		y: pos[1]
	};//vec2.fromValues(pos[0], pos[1]);
	
	this.bbs = new Array();
};

TilePlaceable.prototype = {
	
	addBoundingBox: function(bounding) {
		console.log("Adding a boundingBox");
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
	}
};

//-------------------------------------TILE ANIMATED-------------------------------//
TileAnimated = function(tile, pos, totalNrAnimations, totalNrFramesPerAnimation, animationSpeed, updateStatusSpeed) {
	TileAnimated.baseConstructor.call(this, tile, pos);
	
	this.tileStatus = {
		ANIMATION_IDLE: 0,
		ANIMATION_ONE: 1
	}
	this.status = this.tileStatus.ANIMATION_IDLE;
	this.totalNrAnimations = totalNrAnimations;
	this.totalNrFramesPerAnimation = totalNrFramesPerAnimation;
	this.currFrame = 0;
	this.animationSpeed = animationSpeed;
	this.updateStatusSpeed = updateStatusSpeed;
	//dthis.frameWidth =
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.animationInterval = setInterval(function(){_this.animate()}, _this.animationSpeed);
	this.updateStatusInterval = setInterval(function(){_this.updateStatus()}, _this.updateStatusSpeed)
};

InheritenceManager.extend(TileAnimated, TilePlaceable); //TileAnimated inherites from TilePlaceable

TileAnimated.prototype.animate = function() {
	if( (this.currFrame + 1) >= (this.totalNrFramesPerAnimation - 1) )
		this.currFrame = 0;
	else
		this.currFrame++;
};

tileAnimated.prototype.updateStatus = function() {
	// logic for changing status, ex: if the player jumps on the tile then this.status = this.tilestatus.ANIMATION_ONE
};

TileAnimated.prototype.changeStatus = function(newState) {
	this.status = newState;
	if(newState != this.status)
		this.currFrame = 0;
};

TileAnimated.prototype.getStatus = function() {
	return this.status;
};

