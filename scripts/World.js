World = function() {
	this.collisionsTex = new TextureData();
	this.worldSize = {
		x: 2048, 
		y: 512
	}
	
	this.bgSize = {
		x: 1024, 
		y: 512
	}
	
	this.fgSize = {
		x: 4096, 
		y: 512
	}
	this.tilesBg = new Array();
	this.tilesMg = new Array();
	this.tilesFg = new Array();
}

World.prototype = {	
	
	init: function(gl) {
		this.collisionsTex.loadImage("resources/collisions.png");
		this.player = new EntityPlayer([((gl.viewportWidth)/2), 0, 0], [0, 0], [64, 64]);
		this.hasGeneratedCollisions = false;
		this.emitter = new Emitter([600,200], 1200, 0.1, 1000, 2000, 0.5, 1.5, 0.5);
	},
	
	setTilesBg: function(tiles) {
		this.tilesBg = tiles;
	},
	
	getTilesBg: function() {
		return this.tilesBg;
	},
	
	setTilesMg: function(tiles) {
		this.tilesMg = tiles;
	},
	
	getTilesMg: function() {
		return this.tilesMg;
	},
	
	setTilesFg: function(tiles) {
		this.tilesFg = tiles;
	},
	
	getTilesFg: function() {
		return this.tilesFg;
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
		this.emitter.setPosition(this.player.getPosition());
		
		var worldPos = {
			x: 0, 
			y: 0
		}
		this.player.collidedWith(new BoundingBox([0, 0], [2048, 10]), worldPos);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(this.player.intersects(tiles[i].getTile().getBB(), tiles[i].getPosition())) {
				this.player.collidedWith(tiles[i].getTile().getBB(), tiles[i].getPosition());
				//console.log("Player is colliding");
			}
		}
		
	}, 
	
	getEmitter: function() {
		return this.emitter;
	}
}
