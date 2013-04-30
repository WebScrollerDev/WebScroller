var progTile;//progWindow, ;
Renderer = function() {
	
}

Renderer.prototype = {
	
	init: function() {
		//progWindow = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		progTile = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.initShaders();
		this.renderTile = new EditorRenderTile();
		//this.renderWindow = new EditorRenderWindow();
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	},
	
	initShaders: function() {
		/*gl.useProgram(progWindow);
		progWindow.position = gl.getAttribLocation(progWindow, "inPosition");
		progWindow.texCoord = gl.getAttribLocation(progWindow, "inTexCoord");
		progWindow.normal = gl.getAttribLocation(progWindow, "inNormal");
		progWindow.tex = gl.getUniformLocation(progWindow, "inTexSample");
		
		progWindow.proj = gl.getUniformLocation(progWindow, "projMatrix");
		progWindow.modelView = gl.getUniformLocation(progWindow, "modelViewMatrix");
		*/
		gl.useProgram(progTile);
		progTile.position = gl.getAttribLocation(progTile, "inPosition");
		progTile.texCoord = gl.getAttribLocation(progTile, "inTexCoord");
		progTile.normal = gl.getAttribLocation(progTile, "inNormal");
		progTile.tex = gl.getUniformLocation(progTile, "inTexSample");
		
		progTile.proj = gl.getUniformLocation(progTile, "projMatrix");
		progTile.modelView = gl.getUniformLocation(progTile, "modelViewMatrix");
	},
	
	render: function() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		this.renderTile.render();
		//this.renderWindow.render();
	}
}

RenderBase = function() {
	
}

RenderBase.prototype = {
	
	initBuffers: function(model) { //generate the model
		model.posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getVertexArray()), gl.STATIC_DRAW);
		
		model.texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
		
		model.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getNormalArray()), gl.STATIC_DRAW);
	}
}

EditorRenderTile = function() {
	EditorRenderTile.baseConstructor.call(this);
	
	this.modelTile = new ModelSquare();
	this.initBuffers(this.modelTile);
}

InheritenceManager.extend(EditorRenderTile, RenderBase);

EditorRenderTile.prototype.render = function() {
	gl.useProgram(progTile);
	
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

EditorRenderTile.prototype.renderTiles = function(tiles) {
	for(var i = 0; i < tiles.length; i++) {
		var modelView = mat4.create();
		mat4.translate(modelView, modelView, [i*256, 0.0, 0.0]);
		mat4.scale(modelView, modelView, [128, 128, 0.0]);
		mat4.multiply(modelView, cam.getView(), modelView);
		
		gl.uniformMatrix4fv(progTile.proj, false, cam.getProj());
		gl.uniformMatrix4fv(progTile.modelView, false, modelView);
		
		gl.bindTexture(gl.TEXTURE_2D, tiles[i].getTex());
	    gl.uniform1i(progTile.tex, 0);
	    
		gl.bindBuffer(gl.ARRAY_BUFFER, this.modelTile.posBuffer);
		gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.modelTile.texBuffer);
		gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.modelTile.normalBuffer);
		gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
	}
}
