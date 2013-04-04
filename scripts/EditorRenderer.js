EditorRenderer = function() {
	
}

EditorRenderer.prototype = {
	
	init: function(gl, cam) {
		this.gl = gl;
		this.prog = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.renderTiles = new EditorRenderTiles(gl, cam, this.prog);
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	},
	
	render: function() {
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.renderTiles.render();
	}
}

EditorRenderBase = function(gl, cam, prog) {
	this.gl = gl;
	this.cam = cam;
	this.prog = prog;
	
	this.initShader();
}

EditorRenderBase.prototype = {
	
	initShader: function() {
		this.gl.useProgram(this.prog);
		this.prog.position = this.gl.getAttribLocation(this.prog, "inPosition");
		this.prog.texCoord = this.gl.getAttribLocation(this.prog, "inTexCoord");
		this.prog.normal = this.gl.getAttribLocation(this.prog, "inNormal");
		this.prog.tex = this.gl.getUniformLocation(this.prog, "inTexSample");
		
		this.prog.proj = this.gl.getUniformLocation(this.prog, "projMatrix");
		this.prog.modelView = this.gl.getUniformLocation(this.prog, "modelViewMatrix");
		
		this.prog.fade = this.gl.getUniformLocation(this.prog, "fade");
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

EditorRenderTiles = function(gl, cam, prog) {
	EditorRenderTiles.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
	
	this.modelTiles = new ModelSquare();
	this.vaoTiles = this.generateModel(this.modelTiles);
}

InheritenceManager.extend(EditorRenderTiles, EditorRenderBase);

EditorRenderTiles.prototype.render = function() {
	this.gl.useProgram(this.prog);
	
	switch(currTileState) {
		case TILESTATE.BACKGROUND:
			this.renderTiles(bgTiles);
			break;
		case TILESTATE.MIDDLEGROUND:
			this.renderTiles(mgTiles);
			break;
		case TILESTATE.FOREGROUND:
			this.renderTiles(fgTiles);
			break;
	}
}

EditorRenderTiles.prototype.renderTiles = function(tiles) {
	for(var i = 0; i < tiles.length; i++) {
		var modelView = mat4.create();
		mat4.translate(modelView, modelView, [i*256, 0.0, 0.0]);
		mat4.scale(modelView, modelView, [128, 128, 0.0]);
		mat4.multiply(modelView, this.cam.getView(), modelView);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vaoTile);
		
		this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
		this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
		
		this.gl.bindTexture(this.gl.TEXTURE_2D, tiles[i].getTex());
		this.gl.uniform1i(this.prog.tex, 0);
		
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelTiles.getNumVertices());
	}
}
