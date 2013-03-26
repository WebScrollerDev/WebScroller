World = function() {
	this.collisionsTex = new TextureData();
	this.worldSize = {
		x: 2048, 
		y: 512
	}
	this.tiles = new Array();
}

World.prototype = {	
	
	init: function(gl) {
		this.collisionsTex.loadImage("resources/collisions.png");
		this.player = new EntityPlayer([((gl.viewportWidth)/2), 0, 0]);
		this.hasGeneratedCollisions = false;
	},
	
	setTiles: function(tiles) {
		this.tiles = tiles;
	},
	
	generateCollisions: function() {
		var collisions = this.collisionsTex.getData();
		for(var x = 0; x < collisions.width; x++) {
			for(var y = 0; y < collisions.height; y++) {
				//TODO add collision objects
			}
		}
		this.hasGeneratedCollisions = true;
	},
	
	update: function() {
		if(this.collisionsTex.isLoaded() && !this.hasGeneratedCollisions)
			this.generateCollisions();
		this.player.update();
	}
}
