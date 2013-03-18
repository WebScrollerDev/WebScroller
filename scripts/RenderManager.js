function RenderManager() {
	
}

RenderManager.prototype.init = function(gl, cam) {
	this.vao = gl.createBuffer();
	this.shaderProgram = utils.addShaderProg(gl, 'main.vert', 'main.frag');
	this.cam = cam;
	this.initShader(gl);
	this.initBuffer(gl);
}

RenderManager.prototype.initShader = function(gl) {
	gl.useProgram(this.shaderProgram);
	this.shaderProgram.position = gl.getAttribLocation(this.shaderProgram, "inPosition");
	gl.enableVertexAttribArray(this.shaderProgram.position);

	this.shaderProgram.proj = gl.getUniformLocation(this.shaderProgram, "projMatrix");
	this.shaderProgram.modelView = gl.getUniformLocation(this.shaderProgram, "modelViewMatrix");
}

RenderManager.prototype.initBuffer = function(gl) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);
	var vertices = [
					0.0, 1.0, 0.0, 
					-1.0, -1.0, 0.0, 
					1.0, -1.0, 0.0];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vao.itemSize = 3;
	this.vao.numItems = 3;
}

RenderManager.prototype.render = function(gl) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	//mat4.identity(mvMatrix);
	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [0.5, 0.5, 0.5]);
	mat4.translate(modelView, modelView, [-0.5, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);
	gl.vertexAttribPointer(this.shaderProgram.position, this.vao.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(this.shaderProgram.proj, false, this.cam.getProj());
	gl.uniformMatrix4fv(this.shaderProgram.modelView, false, modelView);
	
	gl.drawArrays(gl.TRIANGLES, 0, this.vao.numItems);
}
