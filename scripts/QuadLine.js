QuadLine = function(a, b) {
	this.a = a;
	this.b = b;
}

QuadLine.prototype = {
	
	length: function() {
		return a.distance(b);
	},
	
	getPointA: function() {
		return this.a;
	},
	
	getPointB: function() {
		return this.b;
	},
	
	setPointA: function(a) {
		this.a = a;
	},
	
	setPointB: function(b) {
		this.b = b;
	},
	
	setPointAB: function(a, b) {
		this.a = a;
		this.b = b;
	},
	
	getAngle: function(l2) {
		
		var thisLine = this.b.minus(this.a);
		var thisLineAsArray = [thisLine.x, thisLine.y];
		var otherLine = l2.b.minus(l2.a);
		var otherLineAsArray = [otherLine.x, otherLine.y];
		return Math.acos(vec2.dot(vec2.normalize(otherLineAsArray, otherLineAsArray), vec2.normalize(thisLineAsArray, thisLineAsArray)));
	},
	
	getAngleToNormal: function(l2) {
		var thisNormal = vec2.normalize(vec2.create(), [-(this.b.y-this.a.y),(this.b.x - this.a.x)]);
		return Math.acos(vec2.dot(thisNormal, [0.0, 1.0]));
		
	},
	
	getIntersection: function(other) {
		var nx, ny, dn;
		var x4_x3 = other.b.x - other.a.x;
		var pre2 = other.b.y - other.a.y;
		var pre3 = this.b.x - this.a.x;
		var pre4 = this.b.y - this.a.y;
		var pre5 = this.a.y - other.a.y;
		var pre6 = this.a.x - other.a.x;
	
		nx = x4_x3 * pre5 - pre2 * pre6;
		ny = pre3 * pre5 - pre4 * pre6;
		dn = pre2 * pre3 - x4_x3 * pre4;
	
		nx /= dn;
		ny /= dn;
	
		if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
			ny = this.y + nx * pre4;
			nx = this.x + nx * pre3;
			return new QuadPoint([nx, ny]);
		}
		return null;
	},

	reflect: function(vel) {
		var diff = this.a.minus(this.b);
		var n = new QuadPoint([diff.y, -diff.x]).normal();
		return vel.add(n.times(-2 * vel.dot(n)));
	}

};
