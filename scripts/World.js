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
	
	this.rainEmitters = new Array();
	
	this.gpuParticles = new Array();
	this.player = new EntityPlayer([1337, 300, 0], [0, 0], [45, 64]);
	this.rootQuadTree = new QuadTree(-1,-1, this.worldSize.x+1, this.worldSize.y+1);
	this.cloth = new Cloth([700, 230], [10, 10], 14, [0.0, 0.7, 0.0]);
	this.rope = new Rope([1150, 300], [1100, 100], 10, false, [0.7, 0.7, 0.7]);
	this.gpuParticles.push(new GpuParticle([2700, 40], 32, "resources/waterborder.png"));
	this.shadowHandler = new ShadowHandler(gl.viewportWidth, 10);
	this.windVelocity = {
		x: 0.001,
		y: 0.0
	}
}

World.prototype = {	
	
	initArrays: function() {
		
		this.smokeEmitters.push(new EmitterSmoke([532,330], 1000, 100, 8, [0.0,0.1], [0.1,0.0], 4000, 500));
		this.rainEmitters.push(new EmitterRain(1000, 50, [0.,-0.9],[0.,0.]));
		
		var tmpTile = new Tile("resources/tiles/mg/fungi_ss.png");
		tmpTile.setSize([100, 100]);
		this.tilesAnimatedMg.push(new TileAnimated(tmpTile, [1610, 8,1], 2, 8, [1, 6], 50, 10));
		
		
		this.shadowHandler.addShadowPair([3700, 100], [3900, 100], [3900, 80], [3700, 80]);
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
		
		this.shadowHandler.shadows[0].setAnchorPoints([this.tilesMg[0].getBBs()[0].corner[3][0], this.tilesMg[0].getBBs()[0].corner[3][1]], [this.tilesMg[0].getBBs()[0].corner[2][0], this.tilesMg[0].getBBs()[0].corner[2][1]]);
		this.shadowHandler.shadows[1].setAnchorPoints([this.tilesMg[0].getBBs()[0].corner[2][0], this.tilesMg[0].getBBs()[0].corner[2][1]], [this.tilesMg[0].getBBs()[0].corner[1][0], this.tilesMg[0].getBBs()[0].corner[1][1]]);
		this.shadowHandler.shadows[2].setAnchorPoints([this.tilesMg[0].getBBs()[0].corner[1][0], this.tilesMg[0].getBBs()[0].corner[1][1]], [this.tilesMg[0].getBBs()[0].corner[0][0], this.tilesMg[0].getBBs()[0].corner[0][1]]);
		this.shadowHandler.shadows[3].setAnchorPoints([this.tilesMg[0].getBBs()[0].corner[0][0], this.tilesMg[0].getBBs()[0].corner[0][1]], [this.tilesMg[0].getBBs()[0].corner[3][0], this.tilesMg[0].getBBs()[0].corner[3][1]]);
		
		this.player.preCollision();
		
		this.player.setColliding(false);
		
		var tiles = this.tilesMg;
		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].getBBs() != null) {
				for(var j = 0; j < tiles[i].getBBs().length; j++) {
						if(this.intersects(this.player.getObb(), this.tilesMg[i].getBBs()[j])) {
							//console.log("colliding");
							this.player.setColliding(true);
							//var tmpBB = new BoundingBox([tiles[i].getBBs()[j].corner[0][0], tiles[i].getBBs()[j].corner[0][1]], [tiles[i].getBBs()[j].corner[2][0], tiles[i].getBBs()[j].corner[2][1]]);
							world.player.obb.updateAngle(this.tilesMg[i].getBBs()[j].angle);
				
							this.player.collidedWith2(this.tilesMg[i].getBBs()[j]);
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
		
		/*var separate_P = result_P1.max_proj < result_P2.min_proj || result_P2.max_proj < result_P1.min_proj;
		var separate_Q = result_Q1.max_proj < result_Q2.min_proj || result_Q2.max_proj < result_Q1.min_proj;
		var separate_R = result_R1.max_proj < result_R2.min_proj || result_R2.max_proj < result_R1.min_proj;
		var separate_S = result_S1.max_proj < result_S2.min_proj || result_S2.max_proj < result_S1.min_proj;
		
		var isSeparated = separate_P || separate_Q || separate_R || separate_S;*/
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
	}
}
