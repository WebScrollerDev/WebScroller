World = function() {
	this.collisionsTex = new TextureData();
	this.worldSize = {
		x: 2048,
		y: 1024
	}
	
	this.bgSize = {
		x: 1024, 
		y: 512
	}
	
	this.fgSize = {
		x: 4096, 
		y: 2048
	}
	this.tilesBg = new Array();
	this.tilesMg = new Array();
	this.tilesFg = new Array();
	this.smokeEmitters = new Array();
	this.fluidEmitters = new Array();
	this.fireEmitters = new Array();
	
	this.staticLights = new Array();
	this.flickeringLights = new Array();
	this.morphingLights = new Array();
	
	this.gpuParticles = new Array();
}

World.prototype = {	
	
	init: function() {
		this.player = new EntityPlayer([((gl.viewportWidth)/2), 100, 0], [0, 0], [45, 64]);
		
		this.smokeEmitters.push(new EmitterSmoke([532,330], 10000, 10, 8, [0.0,0.2], [0.1,0.0], 4000, 500));
		//this.fireEmitters.push(new EmitterFire([800,200], 10000, 10, 32, [0.0,0.8], [0.1,0.0], 2000, 500));
		//this.fluidEmitters.push(new EmitterFluid([600,200], 10, 500, 32, [0.0,0.2], [0.1,0.0], 10));
		

		//this.staticLights.push(new LightBase([520.0, 80.0, 1.0], [1.0, 1.0, 0.0]));
		//this.staticLights.push(new LightBase([495.0, 150.0, 1.0], [1.0, 1.0, 0.0]));
		this.staticLights.push(new LightBase([495.0, 250.0, 1.0], [1.0, 1.0, 0.0]));
		
		this.staticLights.push(new LightBase([135.0, 60.0, 1.0], [1.0, 1.0, 0.0]));
		this.staticLights.push(new LightBase([230.0, 60.0, 1.0], [1.0, 1.0, 0.0]));
		
		this.flickeringLights.push(new LightFlickering([520.0, 80.0, 1.0], [1.0, 0.0, 0.0], 10, 5, 1, 0));
		
		this.morphingLights.push(new LightMorphing([495.0, 150.0, 1.0], [ [1.0, 1.0, 0.0], [1.0, 0.0, 0.0] ], 30, 0, 1, 0.3, 100, 0));
		
		this.cloth = new Cloth(700, 230, 10, 10);
		
		this.gpuParticles.push(new GpuParticle([500,100], 128));
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
	
	update: function() {
		this.player.temp();
		
		//this.fireEmitters[0].setPosition(this.player.getPosition());
		//this.fireEmitters[0].setPositionY(this.fireEmitters[0].getPositionY()+this.player.size.y/2);		
		
		var worldPos = {
			x: 0, 
			y: 0
		}
		if(this.player.intersects(new BoundingBox([0, 0], [this.worldSize.x, 10]), worldPos)) {
			this.player.collidedWith(new BoundingBox([0, 0], [this.worldSize.x, 10]), worldPos);
		} else
			this.player.setColliding(false);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].getTile().getBB() == null)
				continue;
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
	},

	getFireEmitters: function() {
		return this.fireEmitters;
	}
}
