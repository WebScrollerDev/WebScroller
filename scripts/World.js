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
	
	this.staticLightsMg = new Array();
	this.flickeringLightsMg = new Array();
	this.morphingLightsMg = new Array();
	
	this.staticLightsBg = new Array();
	this.flickeringLightsBg = new Array();
	this.morphingLightsBg = new Array();
	
	this.staticLightsFg = new Array();
	this.flickeringLightsFg = new Array();
	this.morphingLightsFg = new Array();
	
	this.gpuParticles = new Array();
}

World.prototype = {	
	
	init: function() {
		this.player = new EntityPlayer([((gl.viewportWidth)/2), 100, 0], [0, 0], [45, 64]);
		
		this.smokeEmitters.push(new EmitterSmoke([532,330], 10000, 10, 8, [0.0,0.2], [0.1,0.0], 4000, 500));
		//this.fireEmitters.push(new EmitterFire([800,200], 10000, 10, 32, [0.0,0.8], [0.1,0.0], 2000, 500));
		//this.fluidEmitters.push(new EmitterFluid([600,200], 10, 500, 32, [0.0,0.2], [0.1,0.0], 10));
		
		this.staticLightsBg.push(new LightBase([575.0, 315.0, 40.0], [0.0, 0.0, 1.0], 5.0));
		
		
		this.staticLightsMg.push(new LightBase([0.0, 0.0, 40.0], [1.0, 0.0, 0.0], 3.0));
		
		this.flickeringLightsMg.push(new LightFlickering([233.0, 60.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.1, 1.2));
		this.flickeringLightsMg.push(new LightFlickering([135.0, 60.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.1, 1.2));
		
		this.flickeringLightsMg.push(new LightFlickering([491.0, 250.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.1, 1.2));
		this.flickeringLightsMg.push(new LightFlickering([495.0, 150.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.1, 1.2));
		this.flickeringLightsMg.push(new LightFlickering([522.0, 80.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.1, 1.2));
		
		this.flickeringLightsMg.push(new LightFlickering([1025.0, 130.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, 1.2, 1.3));
		
		//this.morphingLights.push(new LightMorphing([495.0, 150.0, 1.0], [ [1.0, 0.0, 0.0], [0.0, 0.0, 1.0], [0.0, 1.0, 0.0]], 100, 0, 1, 1, 0.01, 0.01));
		
		this.cloth = new Cloth([700, 230], [10, 10], 14, [0.0, 0.7, 0.0]);
		this.rope = new Rope([1150, 300], [1100, 100], 10, false, [0.2, 0.2, 0.2]);
		
		this.gpuParticles.push(new GpuParticle([500,100], 16));
		//this.bbs.push(new OBB([100, 20], [10, 20], [20, 40], 3.14/4));
		
		this.obb = new OBB([0, 0], [1024, 5], [2048, 10], 0);
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
		
		this.player.setColliding(false);
		
		if(this.player.intersects2(this.obb)) {
			this.player.collidedWith(new BoundingBox([0, 0], [2048, 10]));
		}
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].getBB() == null)
				continue;
			if(this.player.intersects2(tiles[i].getBB())) {
				var tmpBB = new BoundingBox([tiles[i].getBB().corner[0][0], tiles[i].getBB().corner[0][1]], [tiles[i].getBB().corner[2][0], tiles[i].getBB().corner[2][1]]);
				this.player.collidedWith(tmpBB);
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
