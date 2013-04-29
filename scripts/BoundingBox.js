OBB = function(offset, center, size, angle) {
	this.centerLocal = {
		x: center[0], 
		y: center[1]
	}
	
	this.center = {
		x: center[0] + offset[0], 
		y: center[1] + offset[1]
	}
	
	this.size = {
		x: size[0], 
		y: size[1]
	}
	
	this.angle = angle;
	
	//console.log("created obb");
	this.corner = [];
	this.axis = [];
	this.origin = [];

	this.updateCorners();
}

OBB.prototype = {
	
	updatePosition: function(pos) {
		this.center = {
			x: this.centerLocal.x + pos.x, 
			y: this.centerLocal.y + pos.y
		}
		
		this.updateCorners();
	}, 
	
	updateCorners: function() {
		var X = vec2.fromValues(Math.cos(this.angle) * (this.size.x / 2), Math.sin(this.angle) * (this.size.x / 2));
		var Y = vec2.fromValues(-Math.sin(this.angle) * (this.size.y / 2), Math.cos(this.angle) * (this.size.y / 2));
	
		this.corner[0] = vec2.fromValues(this.center.x - X[0] - Y[0], this.center.y - X[1] - Y[1]);
		this.corner[1] = vec2.fromValues(this.center.x + X[0] - Y[0], this.center.y + X[1] - Y[1]);
		this.corner[2] = vec2.fromValues(this.center.x + X[0] + Y[0], this.center.y + X[1] + Y[1]);
		this.corner[3] = vec2.fromValues(this.center.x - X[0] + Y[0], this.center.y - X[1] + Y[1]);
	
		this.computeAxes();
	},
	
	overlaps1Way: function(other) {
		//console.log("overlaps");
		for(var i = 0; i < 2; ++i) {
			var t = vec2.dot(other.corner[0], this.axis[i]);
			
			var tMin = t;
			var tMax = t;
			
			for(var c = 1; c < 4; ++c) {
				t = vec2.dot(other.corner[c], this.axis[i]);
				
				if(t < tMin)
					tMin = t;
				else if(t > tMax)
					tMax = t;
			}
			
			
			if((tMin > 1 + this.origin[i]) || (tMax < this.origin[i]))
				return false;
		}
		
		return true;
	}, 
	
	computeAxes: function() {
		this.axis[0] = vec2.sub(vec2.create(), this.corner[1], this.corner[0]);
		this.axis[1] = vec2.sub(vec2.create(), this.corner[3], this.corner[0]);
		
		for(var i = 0; i < 2; ++i) {
			
			this.axis[i][0] /= vec2.squaredLength(this.axis[i]);
			this.axis[i][1] /= vec2.squaredLength(this.axis[i]);
			
			this.origin[i] = vec2.dot(this.corner[0], this.axis[i]);
		}
	}, 
	
	moveTo: function(center) {
		var centerTmp = [center.x, center.y];
		var part = (this.corner[0] + this.corner[1] + this.corner[2] + this.corner[3]) / 4;
		var centroid = vec2.fromValues(part, part);
		
		var translation = vec2.sub(vec2.create(), centerTmp, centroid);
		
		for(var i = 0; i < 4; ++i) {
			//console.log("before: " + this.corner[i]);
			this.corner[i] = vec2.add(vec2.create(), this.corner[i], translation);
			//console.log("after: " + this.corner[i]);
		}
		
		this.computeAxes();
		
	}, 
	
	overlaps: function(other) {
		return this.overlaps1Way(other) && other.overlaps1Way(this);
	}
}
