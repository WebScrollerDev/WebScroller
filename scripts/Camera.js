function Camera () {
	this.proj = mat4.create();
	this.view = mat4.create();
	//this.keyArray = {};
}

Camera.prototype = {
	
	init: function(gl) {
	this.proj = mat4.perspective(mat4.create(), 3.14/4, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	this.view = mat4.lookAt(mat4.create(), [0, 0, 100], [0, 0, 0], [0, 1, 0]);
	}, 
	
	getProj: function() {
		return this.proj;
	},
	
	getView: function() {
		return this.view;
	},
	
	move: function(move) {
		mat4.translate(this.view, this.view, move);
	}
}
