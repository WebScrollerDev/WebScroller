QuadRect = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	var tl = new QuadPoint([this.x, this.y]);
	var tr = tl.clone().add(new QuadPoint([w, 0]));
	var bl = tl.clone().add(new QuadPoint([0, h]));
	var br = bl.clone().add(new QuadPoint([w, 0]));
	this.quadLines = [new QuadLine(tl, tr),
			new QuadLine(tr, br),
			new QuadLine(br, bl),
			new QuadLine(bl, tl)];
};

QuadRect.prototype = {
	
	containsQuadPoint: function(p) {
		var x = p.x, y = p.y;
		return x >= this.x &&
			x <= this.x + this.w &&
			y >= this.y &&
			y <= this.y + this.h;
	},

	overlapsWithQuadLine: function(l2) {
		return this.containsQuadPoint(l2.a) ||	
			this.containsQuadPoint(l2.b) ||
			this.quadLines[0].getIntersection(l2) != null ||
			this.quadLines[1].getIntersection(l2) != null ||
			this.quadLines[2].getIntersection(l2) != null ||
			this.quadLines[3].getIntersection(l2) != null;
	}, 
	
	getRectAsPoints: function() {	// clockwise
		return [this.x,				this.y + this.h,	0.0,	//	3
				this.x + this.w,	this.y + this.h,	0.0,	//	2
				this.x + this.w,	this.y + this.h,	0.0,	//	2
				this.x + this.w,	this.y, 			0.0, 	//	1
				this.x + this.w,	this.y, 			0.0,	//	1
				this.x,				this.y,				0.0,	//	0
				this.x,				this.y,				0.0,	//	0
				this.x,				this.y + this.h,	0.0];	//	3
	}

};