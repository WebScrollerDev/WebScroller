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
	this.smokeEmitters = new Array();
	this.fluidEmitters = new Array();
}

World.prototype = {	
	
	init: function(gl) {
		this.collisionsTex.loadImage("resources/collisions.png");
		this.player = new EntityPlayer([((gl.viewportWidth)/2), 100, 0], [0, 0], [64, 64]);
		this.hasGeneratedCollisions = false;
		
		this.smokeEmitters.push(new EmitterSmoke([600,200], 32, 50000, 1.0, 4000, 2000, 0.1, 0.2, 1.5, 0.5));
		this.fluidEmitters.push(new EmitterFluid([600,200], 32, 50, 500, 0.5, 0.2, 1.0, 6.0, 1.0));
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
		this.player.temp();
		this.smokeEmitters[0].setPosition(this.player.getPosition());
		
		var worldPos = {
			x: 0, 
			y: 0
		}
		if(this.player.intersects(new BoundingBox([0, 0], [2048, 10]), worldPos)) {
			this.player.collidedWith(new BoundingBox([0, 0], [2048, 10]), worldPos);
		} else
			this.player.setColliding(false);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(this.player.intersects(tiles[i].getTile().getBB(), tiles[i].getPosition())) {
				this.player.collidedWith(tiles[i].getTile().getBB(), tiles[i].getPosition());
				//console.log("Player is colliding");
			}
		}
		
		this.player.update();
		
	}, 
	
	getSmokeEmitters: function() {
		return this.smokeEmitters;
	},
	
	getFluidEmitters: function() {
		return this.fluidEmitters;
	}
}
