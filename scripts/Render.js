function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function(gl, world, cam) {
		this.gl = gl;
		this.prog = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.renderEntity = new RenderEntity(gl, world, cam, this.prog);
		this.renderWorld = new RenderWorld(gl, world, cam, this.prog);
	},
	
	render: function() {
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.renderWorld.render();
		this.renderEntity.render();
	}
}

RenderBase = function(gl, cam, prog) { //the base type of renderer
	this.gl = gl;
	this.cam = cam;
	this.prog = prog;
	
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

RenderEntity = function(gl, world, cam, prog) {	//Render Square Class
	RenderEntity.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
	
	this.modelPlayer = new ModelSquare();
	this.vaoPlayer = this.generateModel(this.modelPlayer);
	this.texPlayer = gl.createTexture();
	Texture.loadImage(gl, "resources/player.png", this.texPlayer);
}

InheritenceManager.extend(RenderEntity, RenderBase);

RenderEntity.prototype.render = function() {
	
	this.renderPlayer();
	
};

RenderEntity.prototype.renderPlayer = function() {
	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [16, 16, 0.5]);
	var playerPos = this.world.player.getPosition();

	mat4.translate(modelView, modelView, [this.gl.viewportWidth/100, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoPlayer);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texPlayer);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelPlayer.getNumVertices());
}

RenderWorld = function(gl, world, cam, prog) {
	RenderWorld.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
	
	this.modelBg = new ModelSquare();
	this.vaoBg = this.generateModel(this.modelBg);
	this.texBg = gl.createTexture();
	Texture.loadImage(gl, "resources/bg.png", this.texBg);

	this.modelMg = new ModelSquare();
	this.vaoMg = this.generateModel(this.modelMg);
	this.texMg = gl.createTexture();
	Texture.loadImage(gl, "resources/mg.png", this.texMg);
}

InheritenceManager.extend(RenderWorld, RenderBase);

RenderWorld.prototype.render = function() {	
	this.renderBg();
	this.renderMg();
};

RenderWorld.prototype.renderBg = function() {
	
	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [this.world.bg[1][0], this.world.bg[1][1], 1.0]);
	//mat4.scale(modelView, modelView, [10.0, 2.5, 1.0]);
	var playerPos = this.world.player.getPosition();
	mat4.translate(modelView, modelView, [-(playerPos[0] - (this.gl.viewportWidth/12.5))/this.texBg.width, 0.0, -10.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBg);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBg);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
};

RenderWorld.prototype.renderMg = function() {
	
	var modelView = mat4.create();
	mat4.scale(modelView, modelView, [this.world.bg[1][0], 32, 1.0]);
	//mat4.scale(modelView, modelView, [10.0, 2.5, 1.0]);
	var playerPos = this.world.player.getPosition();
	mat4.translate(modelView, modelView, [-(playerPos[0] - (this.gl.viewportWidth/12.5))/this.texMg.width, 0.0, -1.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoMg);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	//this.gl.enableAlphaTest();
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texMg);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelMg.getNumVertices());
};




