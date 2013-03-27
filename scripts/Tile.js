BoundingBox = function(min, max) {
	this.min = min;
	this.max = max;
}

BoundingBox.prototype = {
	getMin: function() {
		return this.min;
	}, 
	
	getMax: function() {
		return this.max;
	}
};

BoundingCircle = function(radius, pos) {
	this.radius = radius;
	this.pos = pos;
}

BoundingBox.prototype = {
	getRadius: function() {
		return this.radius;
	}, 
	
	getPos: function() {
		return this.pos;
	}
};



Tile = function(gl, path) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, path, this.tex);
	//this.bounding = {};
}

Tile.prototype = {
	addBoundingBox: function(min, max) {
		console.log("Adding a boundingBox");
		this.bounding = new BoundingBox(min, max);
	}, 
	
	addBoundingCircle: function(radius, pos) {
		console.log("Adding a boundingCircle");
		this.bounding = new BoundingCircle(radius, pos);
	}, 
	
	getTex: function() {
		return this.tex;
	}, 
	
	setSize: function(size) {
		this.size = size;
	}, 
	
	getSize: function() {
		return this.size;
	}
}

TilePlaceable = function(tile, pos) {
	this.tile = tile;
	this.pos = {
		x: pos[0], 
		y: pos[1]
	}
}

TilePlaceable.prototype = {
	getTile: function() {
		return this.tile;
	},
	
	getPosition: function() {
		return this.pos;
	}
}
