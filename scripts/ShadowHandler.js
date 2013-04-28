ShadowHandler = function(castLength, updateInterval) {
	this.shadows = [];
	this.castLength = castLength;
	this.updateInterval = updateInterval;
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.setUpdateInterval = setInterval(function(){_this.calculatePoints()}, _this.updateInterval);
};

ShadowHandler.prototype = {
	calculatePoints: function() {
		var playerPos = world.player.getPosition();
		if(playerPos != world.player.getPrevPosition()) {	// if the player has moved we update the shadows
			
			var playerCenter = {
				x: playerPos.x + world.player.getSize().x,
				y: playerPos.y + world.player.getSize().y
			}
			
			for(var i = 0; i < this.shadows.length; i++) {
				
				var anchorPointOne = this.shadows[i].getAnchorPointOne();
				var anchorPointTwo = this.shadows[i].getAnchorPointTwo();
				
				var angle1 = Math.atan2( Math.abs(playerCenter.y - anchorPointOne.y) , Math.abs(playerCenter.x - anchorPointOne.x) );
				var angle2 = Math.atan2( Math.abs(playerCenter.y - anchorPointTwo.y) , Math.abs(playerCenter.x - anchorPointTwo.x) );
				
				var x1 = Math.cos(angle1) * this.castLength;
				var y1 = Math.sin(angle1) * this.castLength;
				var x2 = Math.cos(angle2) * this.castLength;
				var y2 = Math.cos(angle2) * this.castLength;
				
				if(playerCenter.x > anchorPointOne.x)
					this.shadows[i].setChangingPointOneX( (anchorPointOne.x - x1) );
				else
					this.shadows[i].setChangingPointOneX( (anchorPointOne.x + x1) );
					
				if(playerCenter.x > anchorPointTwo.x)
					this.shadows[i].setChangingPointTwoX( (anchorPointTwo.x - x2) );
				else
					this.shadows[i].setChangingPointTwoX( (anchorPointTwo.x + x2) );
					
				if(playerCenter.y > anchorPointOne.y)
					this.shadows[i].setChangingPointOneY( (anchorPointOne.y - y1) );
				else
					this.shadows[i].setChangingPointOneY( (anchorPointOne.y + y1) );
					
				if(playerCenter.y > anchorPointTwo.y)
					this.shadows[i].setChangingPointTwoY( (anchorPointTwo.y - y2) );
				else
					this.shadows[i].setChangingPointTwoY( (anchorPointTwo.y + y2) );
			}
			
		}
	},
	
	addShadow: function(PointOne, PointTwo) {
		this.shadows.push(new Shadow(PointOne, PointTwo));
	},
	
	getShadowsArray: function() {
		var shadowsCoordArray = [];
		for(var i = 0; i < this.shadows.length; i++) {
			if(this.shadows[i].getActive()) {
				var aCoordOne = this.shadows[i].getAnchorPointOne();
				var aCoordTwo = this.shadows[i].getAnchorPointTwo();
				var cCoordOne = this.shadows[i].getChangingPointOne();
				var cCoordTwo = this.shadows[i].getChangingPointTwo();
				// 6 coords for 2 triangles, ALeft -> CLeft -> ARight -> ARight -> CLeft -> CRight
				shadowsCoordArray.push(aCoordOne.x, aCoordOne.y, 0.0, 
									   cCoordOne.x, cCoordOne.y, 0.0,
									   aCoordTwo.x, aCoordTwo.y, 0.0,
									   cCoordTwo.x, cCoordTwo.y, 0.0);
			}
		}
		return shadowsCoordArray;
	}
};

