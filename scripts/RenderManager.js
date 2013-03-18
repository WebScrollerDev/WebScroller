function RenderManager() {
	
}

RenderManager.prototype.init = function(gl, cam) {
	this.vao = gl.createBuffer();
	this.shaderProgram = utils.addShaderProg(gl, 'main.vert', 'main.frag');
	this.cam = cam;
	this.gl = gl;
	this.initShader();
	this.initBuffer();
	
}

this.RenderManager.prototype.initShader = function() {
	this.gl.useProgram(this.shaderProgram);
	this.shaderProgram.position = this.gl.getAttribLocation(this.shaderProgram, "inPosition");
	gl.enableVertexAttribArray(this.shaderProgram.position);

	this.shaderProgram.proj = this.gl.getUniformLocation(this.shaderProgram, "projMatrix");
	this.shaderProgram.modelView = this.gl.getUniformLocation(this.shaderProgram, "modelViewMatrix");
}

this.RenderManager.prototype.initBuffer = function() {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vao);
	var vertices = [
					0.0, 1.0, 0.0, 
					-1.0, -1.0, 0.0, 
					1.0, -1.0, 0.0];
	this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	this.vao.itemSize = 3;
	this.vao.numItems = 3;
}

RenderManager.prototype.render = function() {
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [0.5, 0.5, 0.5]);
	mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);
	this.gl.vertexAttribPointer(this.shaderProgram.position, this.vao.itemSize, gl.FLOAT, false, 0, 0);
	this.gl.uniformMatrix4fv(this.shaderProgram.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.shaderProgram.modelView, false, modelView);
	
	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vao.numItems);
}
