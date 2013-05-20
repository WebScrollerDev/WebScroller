
//-------------------------------------------------------WATERMASS---------------------------------------------------//

WaterMass = function(position, waterSize, waterColumnCount, updateInterval, springConstant, dampeningFactor, spreadFactor, bottomColor, topColor, bubbleCount, splashCount) {
	this.position = {	// down left of the watermass
		x: position[0],
		y: position[1]	
	}
	this.targetHeight = waterSize[1];
	this.waterColumnCount = waterColumnCount + 1;	// +1 since it takes 3 sides to create 2 columns
	this.waterColumnSpacing = waterSize[0] / waterColumnCount;
	this.waterColumns = [];
	this.updateInterval = updateInterval;
	this.bottomColor = bottomColor;
	this.topColor = topColor;
	this.bubbleCount = bubbleCount;
	this.bubbles = [];
	this.splashParticleCount = splashCount;
	this.splashColdown = 500.;
	this.splashParticles = [];
	
	this.springConstant = springConstant;
	this.dampeningFactor = dampeningFactor;
	this.spreadFactor = spreadFactor;
	
	for(var i = 0; i < this.waterColumnCount; i++) {
		this.waterColumns.push(new WaterColumn(this.targetHeight));
	}	
	
	var _this = this; //Needed in setInterval and TriggerBox, for specifying the correct this
	this.setUpdateInterval = setInterval(function(){_this.update()}, this.updateInterval);
	var posArray = [this.position.x, this.position.y];	// x,y
	var waterMassCenterArray = [(this.waterColumnCount-1)/2.0*this.waterColumnSpacing, this.targetHeight];	// x,y
	var waterMassSizeArray = [(this.waterColumnCount-1) * this.waterColumnSpacing, this.targetHeight*2];
	this.triggerBox = new TriggerBox(posArray, waterMassCenterArray, waterMassSizeArray, 0, _this, "waveFunc");
};

WaterMass.prototype = {
	
	update: function() {
		
		var leftDeltas = [];	// heightdiff between left column and current
		var rightDeltas = [];	// heightdiff between right column and current
		
		for(var i = 0; i < this.waterColumnCount; i++) {	// update each watercolumn
			this.waterColumns[i].update(this.springConstant, this.dampeningFactor);
		}
		
		for (var j = 0; j < 8; j++)	{	// iterate 8 times
		    for (var i = 0; i < this.waterColumnCount; i++)	// the watercolumns affect eachother
		    {
		        if (i > 0)	// every column except the very first have a left neighbour
		        {
		            leftDeltas[i] = this.spreadFactor * (this.waterColumns[i].getCurrHeight() - this.waterColumns[i - 1].getCurrHeight());
		            this.waterColumns[i - 1].increaseVelocityWithValue(leftDeltas[i]);
		        }
		        if (i < this.waterColumnCount - 1)	// every column except the very last have a right neighbour
		        {
		            rightDeltas[i] = this.spreadFactor * (this.waterColumns[i].getCurrHeight() - this.waterColumns[i + 1].getCurrHeight());
		            this.waterColumns[i + 1].increaseVelocityWithValue(rightDeltas[i]);
		        }
		    }
		 
		    for (var i = 0; i < this.waterColumnCount; i++)
		    {
		        if (i > 0)
		            this.waterColumns[i - 1].increaseCurrHeightWithValue(leftDeltas[i]);
		        if (i < this.waterColumnCount - 1)
		            this.waterColumns[i + 1].increaseCurrHeightWithValue(rightDeltas[i]);
		    }
		}
		
		this.updateBubbles();
		if(this.splashColdown >= 0)
			this.splashColdown -= this.updateInterval;
		if(this.splashParticles.length > 0)
			this.updateSplashParticles();
	},
	
	createSplashAtColumn: function(index) {

		for(var i = 0; i < this.splashParticleCount; i++) {
			var tmpPosition = {
				x: this.position.x + index * this.waterColumnSpacing + (Math.random()*world.player.getSize().x - world.player.getSize().x/2),
				y: this.position.y + this.getWaterColumnOnIndex(index).getCurrHeight() + world.player.velocity[1], 
				z: 2
			}
			var tmpVelocity = {
				x: Math.random()*2 - 1 + world.player.velocity[0]*0.5,
				y: 1.5 + Math.random()*2
			}
			var tmpDiameter = 4 + Math.random() * 4.;
			var tmpTimeToLive = Math.random() * 1000.;
			
			this.splashParticles.push(new ParticleWaterMassSplash(tmpPosition, tmpVelocity, tmpDiameter, tmpTimeToLive));
		}
	},
	
	updateSplashParticles: function() {
		for(var i = 0; i < this.splashParticles.length; i++) {	// handle the particles			
			var currParticle = this.splashParticles[i];
			if(currParticle.getLifetime() < 0.) {
				this.splashParticles.splice(i,1);
				i--;
				continue;	// skip updatePosition if time to die
			}
			currParticle.decreaseLifetime(this.updateInterval);
			currParticle.updatePosition();	// update particle position
			var tmpVel = {
				x: 0,
				y: -0.1
			}
			currParticle.increaseVelocityWithValue(tmpVel);	// apply gravity
		}
	},
	
	getSplashParticles: function() {
		return this.splashParticles;
	},
	
	getSplashColdown: function() {
		return this.splashColdown;
	},
	
	setSplashColdown: function(value) {
		this.splashColdown = value;
	},
	
	updateBubbles: function() {
		
		if(this.bubbles.length < this.bubbleCount) {	// create bubble
			var tmpDiameter = 5.;
			var fromEdge = Math.round(1/(this.waterColumnSpacing/(tmpDiameter/2)));
			var tmpOwnerIndex = Math.round(fromEdge+Math.random() * (this.waterColumnCount-(1+fromEdge*2)));
			
			var tmpPosition = {
				x: this.position.x + tmpOwnerIndex * this.waterColumnSpacing,
				y: this.position.y + tmpDiameter/2, 
				z: 1.4
			}
			var tmpVelocity = {
				x: 0.,
				y: 0.9
			}
			
			this.bubbles.push(new ParticleWaterMassBubble(tmpPosition, tmpVelocity, tmpDiameter, tmpOwnerIndex));
		}
		
		for(var i = 0; i < this.bubbles.length; i++) {	// handle the bubbles			
			var currBubble = this.bubbles[i];
			currBubble.updatePosition();	// update bubble position
			if(currBubble.getPosition().y > this.waterColumns[currBubble.getOwnerIndex()].getCurrHeight() + this.position.y) {
				this.bubbles.splice(i,1);
				i--;
			}
		}
		
	},
	
	getBubbles: function() {
		return this.bubbles;
	},
	
	getWaterAsArray: function() {
		var tmpArray = [];
		//console.log(this.position.x + " " + this.position.y);
		for(var i = 0; i < this.waterColumnCount-1; i++) {
			var x1 = this.position.x+i*this.waterColumnSpacing;
			var x2 = this.position.x+(i+1)*this.waterColumnSpacing;
			var y1 = this.position.y+this.waterColumns[i].getCurrHeight();
			var y2 = this.position.y+this.waterColumns[i+1].getCurrHeight();
			tmpArray.push( x1, this.position.y,	// down left
						   x1, y1,			 	// up left
						   x2, this.position.y,	// down right
						   x2, this.position.y,	// down right
						   x1, y1,				// up left                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
						   x2, y2 );			// up right
		}
		return tmpArray;
	},
	
	getWaterColorAsArray: function() {
		var tmpArray = [];
		for(var i = 0; i < this.waterColumnCount-1; i++) {
			tmpArray.push( this.bottomColor[0], this.bottomColor[1], this.bottomColor[2],	// down left
						   this.topColor[0], this.topColor[1], this.topColor[2], 			// up left
						   this.bottomColor[0], this.bottomColor[1], this.bottomColor[2],	// down right
						   this.bottomColor[0], this.bottomColor[1], this.bottomColor[2],	// down right
						   this.topColor[0], this.topColor[1], this.topColor[2],			// up left                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
						   this.topColor[0], this.topColor[1], this.topColor[2]); 		// up right
		}
		return tmpArray;
	},
	
	getWaterColumnSpacing: function() {
		return this.waterColumnSpacing;
	},
	
	getWaterColumnCount: function() {
		return this.waterColumnCount;
	},
	
	getPosition: function() {
		return this.position;
	},
	
	getWaterColumnOnIndex: function(index) {
		return this.waterColumns[index];
	},
	
	getTriggerBox: function() {
		return this.triggerBox;
	},	
}


//------------------------------------------------------WATERCOLUMN--------------------------------------------------//

WaterColumn = function(targetHeight) {
	this.velocity = 0;
	this.currHeight = targetHeight + 0;
	this.targetHeight = targetHeight;
};

WaterColumn.prototype = {
	
	update: function(springConstant, dampeningFactor) {
		var heightDiff = this.targetHeight - this.currHeight;
		this.velocity += springConstant * heightDiff - this.velocity * dampeningFactor;
		this.currHeight += this.velocity;
	},
	
	getCurrHeight: function() {
		return this.currHeight;
	},
	
	increaseCurrHeightWithValue: function(value) {
		this.currHeight += value;
	},
	
	increaseVelocityWithValue: function(value) {
		this.velocity += value;
	}
	
};


