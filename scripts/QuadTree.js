QuadTree = function(x, y, w, h) {
	this.thresh = 3;
	this.segs = [];
	this.quads = [];

	this.quadRect = new QuadRect(x, y, w, h);
};

QuadTree.prototype = {
	
	addSegments: function(segs) {
		for (var i = 0; i < segs.length; i++) {
			if (this.quadRect.overlapsWithQuadLine(segs[i])) {
				this.segs.push(segs[i]);
			}
		}
	
		if (this.segs.length > this.thresh) {
			this.subdivide();
		}
	},

	getSegs: function() {
		var tmpSegs = [];

		tmpSegs = tmpSegs.concat(this.quadRect.getRectAsPoints());

		for (var i = 0; i < this.quads.length; i++) {
			tmpSegs = tmpSegs.concat(this.quads[i].getSegs());
		}
		return tmpSegs;
	},

	getIntersection: function(seg) {
		if (!this.quadRect.overlapsWithQuadLine(seg)) {
			return null;
		}
	
		for (var i = 0; i < this.segs.length; i++) {
			var s = this.segs[i];
			var inter = s.getIntersection(seg);
			if (inter) {
				var o = {};
				return s;
			}
		}
	
		for (var i = 0; i < this.quads.length; i++) {
			var inter = this.quads[i].getIntersection(seg);
			if (inter)
				return inter;
		}
	
		return null;
	},
	
	getIntersectionMultipleLines: function(lines) {
		var tmpArray = [];
		for(var i = 0; i < lines.length; i++) {
			tmpArray.push(this.getInterSection(lines[i]));
		}
		return tmpArray;
	},

	subdivide: function() {
		var w2 = this.quadRect.w / 2,
		    h2 = this.quadRect.h / 2,
		    x = this.quadRect.x,
		    y = this.quadRect.y;
	
		this.quads.push(new QuadTree(x, y, w2, h2));
		this.quads.push(new QuadTree(x + w2, y, w2, h2));
		this.quads.push(new QuadTree(x + w2, y + h2, w2, h2));
		this.quads.push(new QuadTree(x, y + h2, w2, h2));
	
		for (var i = 0; i < this.quads.length; i++) {
			this.quads[i].addSegments(this.segs);
		}
	
		this.segs = [];
	}

};

