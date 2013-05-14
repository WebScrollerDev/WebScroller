
//-------------------------------------------------------WATERMASS---------------------------------------------------//

WaterMass = function(position, waterSize, waterColumnCount, updateInterval, springConstant, dampeningFactor, spreadFactor) {
	this.position = {	// down left of the watermass
		x: position[0],
		y: position[1]	
	}
	this.targetHeight = waterSize[1];
	this.waterColumnCount = waterColumnCount;
	this.waterColumnSpacing = waterSize[0] / waterColumnCount;
	this.waterColumns = [];
	this.updateInterval = updateInterval;
	
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
						   x2, y2 )				// up right
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
