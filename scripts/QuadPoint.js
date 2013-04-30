QuadPoint = function(pos) {
	this.x = pos[0];
	this.y = pos[1];
};

QuadPoint.prototype = {

	clone: function() {
		return new QuadPoint([this.x, this.y]);
	},

	add: function(other) {
		this.x += other.x;
		this.y += other.y;
	
		return this;
	},

	plus: function(other) {
		return this.clone().add(other);
	},

	scale: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	
		return this;
	},

	times: function(scalar) {
		return this.clone().scale(scalar);	
	},

	subtract: function(other) {
		this.x -= other.x;
		this.y -= other.y;
	
		return this;
	},

	minus: function(other) {
		return this.clone().subtract(other);
	},

	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	distance: function(other) {
		return this.minus(other).magnitude();
	},

	dot: function(other) {
		return this.x * other.x + this.y * other.y;
	},

	interpolate: function(x, other) {
		return this.plus(other.minus(this).times(x));
	},

	normalize: function() {
		this.scale(1.0 / this.magnitude());
		return this;
	},

	normal: function() {
		return this.clone().normalize();
	},

	rotate: function(angle) {
		return new QuadPoint([this.x * Math.cos(angle) - this.y * Math.sin(angle),
				this.x * Math.sin(angle) + this.y * Math.cos(angle)]);
	},

	transform: function(offset, angle) {
		this.rotate(angle).add(offset);
	},

	average: function(other) {
		return this.interpolate(0.5, other);
	},

	fromPolar: function(ang, rad) {
		this.x = Math.cos(ang) * rad;
		this.y = Math.sin(ang) * rad;
	
		return this;
	}

};

