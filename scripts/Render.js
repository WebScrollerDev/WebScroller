function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function(gl, cam) {
		this.gl = gl;
		this.renderSquare = new RenderSquare(gl, cam, 'main.vert', 'main.frag');
	},
	
	render: function() {
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.renderSquare.render();
	}
}

RenderBase = function(gl, cam, vert, frag) { //the base type of renderer
	this.gl = gl;
	this.cam = cam;
	this.prog = utils.addShaderProg(gl, vert, frag);
	
	this.initShader();
}

RenderBase.prototype = {
	
	initShader: function() {
		this.gl.useProgram(this.prog);
		this.prog.position = this.gl.getAttribLocation(this.prog, "inPosition");
		this.prog.texCoord = this.gl.getAttribLocation(this.prog, "inTexCoord");
		this.prog.normal = this.gl.getAttribLocation(this.prog, "inNormal");
		this.prog.tex = this.gl.getUniformLocation(this.prog, "inTexSample");
		
		this.prog.proj = this.gl.getUniformLocation(this.prog, "projMatrix");
		this.prog.modelView = this.gl.getUniformLocation(this.prog, "modelViewMatrix");
	}, 
	
	generateModel: function(model) { //generate the model
		
		this.gl.useProgram(this.prog);
		
		var vertexArrayObjID = this.gl.createBuffer();
		/*var vertexBufferObjID = this.gl.createBuffer();
		var indexBufferObjID = this.gl.createBuffer();
		
		var colorBufferObjID = this.gl.createBuffer();*/
		
		var normalBufferObjID = this.gl.createBuffer();
		var textureBufferObjID = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexArrayObjID);
		this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getVertexArray()), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(this.prog.position, 3, gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.prog.position);
		
		if(model.getTexCoordArray() != 0) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBufferObjID);
			this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), this.gl.STATIC_DRAW);
			this.gl.vertexAttribPointer(this.prog.texCoord, 2, gl.FLOAT, false, 0, 0);
			this.gl.enableVertexAttribArray(this.prog.texCoord);
		}
		
		if(model.getNormalArray() != 0) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBufferObjID);
			this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getNormalArray()), this.gl.STATIC_DRAW);
			this.gl.vertexAttribPointer(this.prog.normal, 3, gl.FLOAT, false, 0, 0);
			this.gl.enableVertexAttribArray(this.prog.normal);
		}
		
		return vertexArrayObjID;
	},
	
	getProg: function() {
		return this.prog;
	}
}

InheritenceManager = {};

InheritenceManager.extend = function(subClass, baseClass) {
	function inheritence() { }
	inheritence.prototype = baseClass.prototype;
	subClass.prototype = new inheritence();
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
}


RenderSquare = function(gl, cam, vert, frag) {	//Render Square Class
	RenderSquare.baseConstructor.call(this, gl, cam, vert, frag);
	this.model = new ModelSquare();
	this.vao = this.generateModel(this.model);
	this.texture = gl.createTexture();
	Texture.loadImage(gl, "resources/test.png", this.texture);
}

InheritenceManager.extend(RenderSquare, RenderBase);

RenderSquare.prototype.render = function() {
	
	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [1.5, 1.5, 0.5]);
	mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vao);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.model.getNumVertices());

};

