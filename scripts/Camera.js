function Camera () {
}

Camera.prototype = {
	
	init: function(gl, world) {
	this.proj = mat4.perspective(mat4.create(), 3.14/4, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	this.lookat = mat4.lookAt(mat4.create(), [0, 0, 300], [0, 0, 0], [0, 1, 0]);
	this.view = this.lookat;
	this.world = world;
	}, 
	
	getProj: function() {
		return this.proj;
	},
	
	getView: function() {
		return this.view;
	}, 
	
	update: function() {
		//this.view = mat4.clone(this.lookat);
		//var tmpPos = this.world.player.getPosition();
		
		//mat4.translate(this.view, this.view, [-tmpPos[0], tmpPos[1], tmpPos[2]]);
	}
}
