function Camera () {
	this.proj = mat4.create();
	this.view = mat4.create();
	//this.keyArray = {};
}

Camera.prototype.init = function(gl) {
	this.proj = mat4.perspective(mat4.create(), 3.14/4, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	this.view = mat4.lookAt(mat4.create(), [0, 0, 5], [0, 0, 0], [0, 1, 0]);
};


Camera.prototype.getProj = function() {
	return this.proj;
};

Camera.prototype.getView = function() {
	return this.view;
};

Camera.prototype.move = function(move) {
	mat4.translate(this.view, this.view, move);
};
