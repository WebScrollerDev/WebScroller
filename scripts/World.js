World = function() {
	this.worldSize = {
		x: 8192,
		y: 4096
	}
	
	this.bgSize = {
		x: this.worldSize.x/2, 
		y: this.worldSize.y/2
	}
	
	this.fgSize = {
		x: this.worldSize.x*2, 
		y: this.worldSize.y*2
	}
	this.tilesBg = new Array();
	this.tilesMg = new Array();
	this.tilesFg = new Array();
	
	this.tilesAnimatedBg = new Array();
	this.tilesAnimatedMg = new Array();
	this.tilesAnimatedFg = new Array();
	
	this.smokeEmitters = new Array();
	this.fluidEmitters = new Array();
	this.fireEmitters = new Array();
	
	this.gpuParticles = new Array();
	
	this.windVelocity = {
		x: 0.001,
		y: 0.0
	}
}

World.prototype = {	
	
	init: function() {
		this.player = new EntityPlayer([1000, 100, 0], [0, 0], [45, 64]);
		
		this.smokeEmitters.push(new EmitterSmoke([532,330], 1000, 100, 8, [0.0,0.1], [0.1,0.0], 4000, 500));
		
		//this.fireEmitters.push(new EmitterFire([950,70], 10000, 10, 32, [0.0,0.4], [0.0,0.0], 2000, 500));
		//this.fluidEmitters.push(new EmitterFluid([600,200], 10, 500, 32, [0.0,0.2], [0.1,0.0], 10));
		
		/*this.staticLightsBg.push(new LightBase([575.0, 315.0, 40.0], [0.0, 0.0, 1.0], 5.0));
		
		
		this.staticLightsMg.push(new LightBase([0.0, 0.0, 40.0], [1.0, 0.0, 0.0], 3.0));
		
		this.flickeringLightsMg.push(new LightFlickering([233.0, 60.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.1, 1.2]));
		this.flickeringLightsMg.push(new LightFlickering([135.0, 60.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.1, 1.2]));
		
		this.flickeringLightsMg.push(new LightFlickering([491.0, 250.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.1, 1.2]));
		this.flickeringLightsMg.push(new LightFlickering([495.0, 150.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.1, 1.2]));
		this.flickeringLightsMg.push(new LightFlickering([522.0, 80.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.1, 1.2]));
		
		this.flickeringLightsMg.push(new LightFlickering([1025.0, 130.0, 1.0], [1.0, 0.7, 0.0], 0.01, 0.01, [1.2, 1.3]));
		this.flickeringLightsMg.push(new LightFlickering([950.0, 75.0, 1.0], [1.0, 0.0, 0.0], 0.01, 0.1, [0.1, 3.2]));*/
		//this.morphingLights.push(new LightMorphing([495.0, 150.0, 1.0], [ [1.0, 0.0, 0.0], [0.0, 0.0, 1.0], [0.0, 1.0, 0.0]], 100, 0, 1, 1, 0.01, 0.01));
		
		this.cloth = new Cloth([700, 230], [10, 10], 14, [0.0, 0.7, 0.0]);
		this.rope = new Rope([1150, 300], [1100, 100], 10, false, [0.7, 0.7, 0.7]);
		
		this.gpuParticles.push(new GpuParticle([2700, 40], 32, "resources/waterborder.png"));
		
		var tmpTile = new Tile("resources/tiles/mg/fungi_ss.png");
		tmpTile.setSize([100, 100]);
		this.tilesAnimatedMg.push(new TileAnimated(tmpTile, [1610, 8,1], 2, 8, [1, 6], 50, 10));
		
		this.shadowHandler = new ShadowHandler(100, 10);
		this.shadowHandler.addShadow([3700, 100], [3900, 100]);
		this.shadowHandler.addShadow([3700, 100], [3900, 100]);
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
	
	
	
	setTilesAnimatedBg: function(tiles) {
		this.tilesAnimatedBg = tiles;
	},
	
	getTilesAnimatedBg: function(tiles) {
		return this.tilesAnimatedBg;
	},
	
	setTilesAnimatedMg: function(tiles) {
		this.tilesAnimatedMg = tiles;
	},
	
	getTilesAnimatedMg: function(tiles) {
		return this.tilesAnimatedMg;
	},
	
	setTilesAnimatedFg: function(tiles) {
		this.tilesAnimatedFg = tiles;
	},
	
	getTilesAnimatedFg: function(tiles) {
		return this.tilesAnimatedFg;
	},
	
	getShadowHandler: function() {
		return this.shadowHandler;
	},
	
	
	update: function() {
		
		var newPos = {
			x: (this.rope.getPosition(10).x - this.tilesMg[0].getTile().size.x/2),
			y: (this.rope.getPosition(10).y - this.tilesMg[0].getTile().size.y/2)
		}
		
		this.tilesMg[0].pos.x = newPos.x;
		this.tilesMg[0].pos.y = newPos.y;
		this.tilesMg[0].getBBs()[0].angle = this.rope.getAngle(10);
		this.tilesMg[0].getBBs()[0].updatePosition(newPos);
		this.shadowHandler.shadows[0].setAnchorPointOneX(this.tilesMg[0].getBBs()[0].corner[3][0]);
		this.shadowHandler.shadows[0].setAnchorPointOneY(this.tilesMg[0].getBBs()[0].corner[3][1]);
		this.shadowHandler.shadows[0].setAnchorPointTwoX(this.tilesMg[0].getBBs()[0].corner[2][0]);
		this.shadowHandler.shadows[0].setAnchorPointTwoY(this.tilesMg[0].getBBs()[0].corner[2][1]);
		
		this.shadowHandler.shadows[1].setAnchorPointOneX(this.tilesMg[0].getBBs()[0].corner[2][0]);
		this.shadowHandler.shadows[1].setAnchorPointOneY(this.tilesMg[0].getBBs()[0].corner[2][1]);
		this.shadowHandler.shadows[1].setAnchorPointTwoX(this.tilesMg[0].getBBs()[0].corner[1][0]);
		this.shadowHandler.shadows[1].setAnchorPointTwoY(this.tilesMg[0].getBBs()[0].corner[1][1]);
		this.player.temp();
		
		this.player.setColliding(false);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].getBBs() != null) {
				for(var j = 0; j < tiles[i].getBBs().length; j++) {
					if(this.player.intersects2(tiles[i].getBBs()[j])) {
						var tmpBB = new BoundingBox([tiles[i].getBBs()[j].corner[0][0], tiles[i].getBBs()[j].corner[0][1]], [tiles[i].getBBs()[j].corner[2][0], tiles[i].getBBs()[j].corner[2][1]]);
						this.player.collidedWith(tmpBB);
					}
				}
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
