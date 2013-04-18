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

Tile = function(gl, path) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, path, this.tex);
}

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
}

TilePlaceable = function(tile, pos) {
	this.tile = tile;
	
	this.pos = {
		x: pos[0], 
		y: pos[1]
	};//vec2.fromValues(pos[0], pos[1]);
}

TilePlaceable.prototype = {
	
	addBoundingBox: function(bounding) {
		console.log("Adding a boundingBox");
		this.bounding = bounding;
	},
	
	getTile: function() {
		return this.tile;
	},
	
	getPosition: function() {
		return this.pos;
	}, 
	
	getBB: function() {
		return this.bounding;
	}
}
