function Camera () {
}

Camera.prototype = {
	
	init: function(gl) {
	//this.proj = mat4.perspective(mat4.create(), 3.14/4, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	this.lookat = mat4.lookAt(mat4.create(), [0, 0, 10], [0, 0, 0], [0, 1, 0]);
	this.proj = mat4.ortho(mat4.create(), 0, gl.viewportWidth, 0, gl.viewportHeight, 0.1, 1000.0);
	this.view = this.lookat;
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
