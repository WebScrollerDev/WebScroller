LightBase = function(pos, color) {
	
	this.pos = {
		x: pos[0], 
		y: pos[1],
		z: pos[2]
	}
	
	this.color = {
		r: color[0], 
		g: color[1], 
		b: color[2]
	}
}

LightBase.prototype = {
	getPosition: function() {
		return this.pos;
	}, 
	
	getColor: function() {
		return this.color;
	}
}
