World = function() {
	
	this.tilesBg = [];
	this.tilesMg = [];
	this.tilesFg = [];
	
	this.tilesAnimatedBg = [];
	this.tilesAnimatedMg = [];
	this.tilesAnimatedFg = [];
	
	this.smokeEmitters = [];
	this.fluidEmitters = [];
	this.fireEmitters = [];
	
	this.rainEmitters = [];
	
	this.gpuParticles = [];
	this.player = new EntityPlayer([0, 0], [45, 64]);
	//this.player.setPosition([500, 500]);
	this.rootQuadTree = {};
	this.cloths = [];
	this.ropes = [];
	this.gpuParticles.push(new GpuParticle([2700, 40], 32, "resources/waterborder.png"));
	this.shadowHandler = new ShadowHandler(gl.viewportWidth, 10);
	this.windVelocity = {
		x: 0.001,
		y: 0.0
	}
}

World.prototype = {	
	
	initArrays: function() {
		
		this.bgSize = {
			x: this.worldSize.x/2, 
			y: this.worldSize.y/2
		}
		
		this.fgSize = {
			x: this.worldSize.x*2, 
			y: this.worldSize.y*2
		}
		
		
		this.rainEmitters.push(new EmitterRain(100, 50, [0.,-0.9],[0.,0.]));
		this.rootQuadTree = new QuadTree(-1,-1, this.worldSize.x+1, this.worldSize.y+1);
		//this.tilesMg[0].setMoving();
		var i = 0;
		for(var i = 1; i < this.tilesMg.length; i++) {
			var tmpBBArray = this.tilesMg[i].getBBs();
			for(var j = 0; j < tmpBBArray.length; j++) {
				var tmpBB = tmpBBArray[j];
				//for(var k = 0; k < tmpBB.corner.length) {
				var tmpQLines = [];
				tmpQLines.push(new QuadLine(new QuadPoint(tmpBB.corner[3]), new QuadPoint(tmpBB.corner[2])));
				tmpQLines.push(new QuadLine(new QuadPoint(tmpBB.corner[2]), new QuadPoint(tmpBB.corner[1])));
				tmpQLines.push(new QuadLine(new QuadPoint(tmpBB.corner[1]), new QuadPoint(tmpBB.corner[0])));
				tmpQLines.push(new QuadLine(new QuadPoint(tmpBB.corner[0]), new QuadPoint(tmpBB.corner[3])));
				
				this.rootQuadTree.addSegments(tmpQLines);
			}
		}
	},
	
	setWorldSize: function(size) {
		this.worldSize = {
			x: size[0],
			y: size[1]
		}
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
		
		this.player.preCollision();
		
		this.player.setColliding(false);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].getBBs() != null) {
				for(var j = 0; j < tiles[i].getBBs().length; j++) {
					if(this.intersects(this.player.getObb(), tiles[i].getBBs()[j])) {
						world.player.obb.updateAngle(tiles[i].getBBs()[j].angle);
						this.player.collidedWith(tiles[i].getBBs()[j]);
					}
				}
			}
		}
		
		var animTiles = this.tilesAnimatedMg;
		for(var i = 0; i < animTiles.length; i++) {
			if(animTiles[i].getTriggerBox() != null) {
				
				for(var j = 0; j < animTiles[i].getTriggerBox().length; j++) {
					if(this.intersects(this.player.getObb(), animTiles[i].getTriggerBox()[j])) {
						animTiles[i].getTriggerBox()[j].callFunction();
					}
				}
				
				for(var k = 0; k < animTiles[i].getBBs().length; k++) {
					if(this.intersects(this.player.getObb(), animTiles[i].getBBs()[k])) {
						world.player.obb.updateAngle(animTiles[i].getBBs()[k].angle);
						this.player.collidedWith(animTiles[i].getBBs()[k]);
					}
				}
			}
		}
		this.player.update();
		
	},
	
	intersects: function(firstBB, secondBB) {
		var normal_firstBB = firstBB.getNormals();
		var normal_secondBB = secondBB.getNormals();
		
		//Result of P, Q
		var result_P1 = this.getMinMax(firstBB, normal_firstBB[0]);
		var result_P2 = this.getMinMax(secondBB, normal_firstBB[0]);
		
		var result_Q1 = this.getMinMax(firstBB, normal_firstBB[1]);
		var result_Q2 = this.getMinMax(secondBB, normal_firstBB[1]);
		
		//results of R, S
		var result_R1 = this.getMinMax(firstBB, normal_secondBB[0]);
		var result_R2 = this.getMinMax(secondBB, normal_secondBB[0]);
		
		var result_S1 = this.getMinMax(firstBB, normal_secondBB[1]);
		var result_S2 = this.getMinMax(secondBB, normal_secondBB[1]);
		
		var velocity_p = vec2.dot(this.player.velocity, normal_firstBB[0]);
		var velocity_q = vec2.dot(this.player.velocity, normal_firstBB[1]);
		var velocity_r = vec2.dot(this.player.velocity, normal_secondBB[0]);
		var velocity_s = vec2.dot(this.player.velocity, normal_secondBB[1]);
		
		var collidingP = result_P1.min_proj + velocity_p < result_P2.max_proj && result_P1.max_proj + velocity_p > result_P2.min_proj;
		var collidingQ = result_Q1.min_proj + velocity_q < result_Q2.max_proj && result_Q1.max_proj + velocity_q > result_Q2.min_proj;
		var collidingR = result_R1.min_proj + velocity_r < result_R2.max_proj && result_R1.max_proj + velocity_r > result_R2.min_proj;
		var collidingS = result_S1.min_proj + velocity_s < result_S2.max_proj && result_S1.max_proj + velocity_s > result_S2.min_proj;
		
		var isColliding = collidingP && collidingQ && collidingR && collidingS;
		return isColliding;
	}, 
	
	getMinMax: function(bb, axis) {
		var min_proj_box = vec2.dot(bb.corner[0], axis);
		var min_dot_box = 0;
		var max_proj_box = vec2.dot(bb.corner[0], axis);
		var max_dot_box = 0;
		
		for (var i = 1; i < bb.corner.length; i++) 
		{
			var curr_proj = vec2.dot(bb.corner[i], axis);
			//select the maximum projection on axis to corresponding box corners
			if (min_proj_box > curr_proj) {
				min_proj_box = curr_proj;
				min_dot_box = i;
			}
			//select the minimum projection on axis to corresponding box corners
			if (curr_proj > max_proj_box) {
				max_proj_box = curr_proj;
				max_dot_box = i;
			}
		}
		
		return { 
			min_proj: min_proj_box,
			max_proj: max_proj_box,
			min_index: min_dot_box,
			max_index: max_dot_box
		}
	},
	
	getSmokeEmitters: function() {
		return this.smokeEmitters;
	},
	
	getFluidEmitters: function() {
		return this.fluidEmitters;
	},

	getFireEmitters: function() {
		return this.fireEmitters;
	},
	
	getRainEmitters: function() {
		return this.rainEmitters;
	},
	
	getShadowHandler: function() {
		return this.shadowHandler;
	}, 
	
	setRopes: function(ropes) {
		this.ropes = ropes;
	}, 
	
	setCloths: function(cloths) {
		this.cloths = cloths;
	}, 
	
	setSmokeEmitters: function(smokeEmitters) {
		this.smokeEmitters = smokeEmitters;
	}, 
	
	setBgPath: function(bgPath) {
		this.bgPath = bgPath;
	}, 
	
	getBgPath: function(bgPath) {
		return this.bgPath;
	}
}
