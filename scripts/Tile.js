BoundingBox = function(min, max) {
	this.min = {
		x: min[0], 
		y: min[1]
	};
	this.max = {
		x: max[0], 
		y: max[1]
	};
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

BoundingCircle.prototype = {
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
	//this.bounding = [];
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
	}, 
	
	getBB: function() {
		return this.bounding;
	}
}

TilePlaceable = function(tile, pos) {
	this.tile = tile;
	
	this.pos = {
		x: pos[0], 
		y: pos[1]
	};//vec2.fromValues(pos[0], pos[1]);
}

TilePlaceable.prototype = {
	getTile: function() {
		return this.tile;
	},
	
	getPosition: function() {
		return this.pos;
	}
}
