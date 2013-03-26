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
	
	var playerPos = this.world.player.getPosition();
	if(playerPos[0] < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [playerPos[0], playerPos[1], 0.0]);
	else if(playerPos[0] > (this.world.worldSize.x - ((this.gl.viewportWidth)/2)))
		mat4.translate(modelView, modelView, [playerPos[0] - (this.world.worldSize.x - ((this.gl.viewportWidth))), playerPos[1], 0.0]);
	else
		mat4.translate(modelView, modelView, [(this.gl.viewportWidth)/2, playerPos[1], 0.0]);
	mat4.scale(modelView, modelView, [this.world.player.size.x, this.world.player.size.y, 0.0]);
	//Used to center the player on the canvas
	mat4.translate(modelView, modelView, [-(this.world.player.size.x*0.5)/this.world.player.size.x, 0.0, 0.0]);
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
	
	this.modelFg = new ModelSquare();
	this.vaoFg = this.generateModel(this.modelFg);
	this.texFg = gl.createTexture();
	Texture.loadImage(gl, "resources/fg.png", this.texFg);
}

InheritenceManager.extend(RenderWorld, RenderBase);

RenderWorld.prototype.render = function() {	
	this.renderBg();
	this.renderMg();
	this.renderFg();
};

RenderWorld.prototype.renderBg = function() {
	
	var modelView = mat4.create();	  //make it wider
	var playerPos = this.world.player.getPosition();
	
	if(playerPos[0] < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, -10.0]);
	else if(playerPos[0] > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.texBg.width - (this.gl.viewportWidth)), 0.0, -10.0]);
	else {
		//---------WiewportWidth scaled with the bg/mg ratio----------------------------------------------------------------------------------playerpos scaled with the bg/mg ratio -----------------//
		var trans = (((this.gl.viewportWidth)/2)*((this.texBg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth))) - ((playerPos[0])*((this.texBg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans, 0.0, -10.0]);
	}
	mat4.scale(modelView, modelView, [this.texBg.width, this.texBg.height, 1.0]);
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
	
	var playerPos = this.world.player.getPosition();
	if(playerPos[0] < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, -1.0]);
	else if(playerPos[0] > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.world.worldSize.x - (this.gl.viewportWidth)), 0.0, -1.0]);
	else {
		//----------------------------------- -playerpos      -window/3/2 to get to the middle   /Mgwidth to scale correctly -----------------//
		mat4.translate(modelView, modelView, [-(playerPos[0] - ((this.gl.viewportWidth)/2)), 0.0, -1.0]);
	}
	mat4.scale(modelView, modelView, [this.texMg.width, this.texMg.height, 1.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoMg);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	//this.gl.enableAlphaTest();
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texMg);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelMg.getNumVertices());
};

RenderWorld.prototype.renderFg = function() {
	
	var modelView = mat4.create();	  //make it wider
	var playerPos = this.world.player.getPosition();
	
	if(playerPos[0] < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 1.0]);
	else if(playerPos[0] > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.texFg.width - (this.gl.viewportWidth)), 0.0, 1.0]);
	else {
		//---------WiewportWidth scaled with the bg/mg ratio----------------------------------------------------------------------------------playerpos scaled with the bg/mg ratio -----------------//
		var trans = (((this.gl.viewportWidth)/2)*((this.texFg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth))) - ((playerPos[0])*((this.texFg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans, 0.0, 1.0]);
	}
	mat4.scale(modelView, modelView, [this.texFg.width, this.texFg.height, 1.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoFg);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texFg);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelFg.getNumVertices());
};




