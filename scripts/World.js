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
 		this.emitter = new Emitter([600,200], 1200, 1000, 10000, 0.5, 45);
	},
	
	setTiles: function(tiles) {
		this.tiles = tiles;
	},
	
	getTiles: function() {
		return this.tiles;
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
	}, 
	
	getEmitter: function() {
		return this.emitter;
	}
}
