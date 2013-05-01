var progTile, progWindow, progButton;
Renderer = function() {
	
}

Renderer.prototype = {
	
	init: function() {
		progButton = utils.addShaderProg(gl, 'button.vert', 'button.frag');
		progWindow = utils.addShaderProg(gl, 'window.vert', 'window.frag');
		progTile = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.initShaders();
		this.renderTile = new EditorRenderTile();
		this.renderWindow = new RenderWindow();
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	},
	
	initShaders: function() {
		gl.useProgram(progWindow);
		progWindow.position = gl.getAttribLocation(progWindow, "inPosition");
		gl.enableVertexAttribArray(progWindow.position);
		progWindow.texCoord = gl.getAttribLocation(progWindow, "inTexCoord");
		gl.enableVertexAttribArray(progWindow.texCoord);
		progWindow.normal = gl.getAttribLocation(progWindow, "inNormal");
		gl.enableVertexAttribArray(progWindow.normal);
		progWindow.tex = gl.getUniformLocation(progWindow, "inTexSample");
		progWindow.proj = gl.getUniformLocation(progWindow, "projMatrix");
		progWindow.modelView = gl.getUniformLocation(progWindow, "modelViewMatrix");
		
		gl.useProgram(progButton);
		progButton.position = gl.getAttribLocation(progButton, "inPosition");
		gl.enableVertexAttribArray(progButton.position);
		progButton.texCoord = gl.getAttribLocation(progButton, "inTexCoord");
		gl.enableVertexAttribArray(progButton.texCoord);
		progButton.normal = gl.getAttribLocation(progButton, "inNormal");
		gl.enableVertexAttribArray(progButton.normal);
		progButton.tex = gl.getUniformLocation(progButton, "inTexSample");
		progButton.textTex = gl.getUniformLocation(progButton, "inTextTexSample");
		progButton.proj = gl.getUniformLocation(progButton, "projMatrix");
		progButton.modelView = gl.getUniformLocation(progButton, "modelViewMatrix");
		
		
		gl.useProgram(progTile);
		progTile.position = gl.getAttribLocation(progTile, "inPosition");
		gl.enableVertexAttribArray(progTile.position);
		progTile.texCoord = gl.getAttribLocation(progTile, "inTexCoord");
		gl.enableVertexAttribArray(progTile.texCoord);
		progTile.normal = gl.getAttribLocation(progTile, "inNormal");
		gl.enableVertexAttribArray(progTile.normal);
		progTile.tex = gl.getUniformLocation(progTile, "inTexSample");
		
		progTile.proj = gl.getUniformLocation(progTile, "projMatrix");
		progTile.modelView = gl.getUniformLocation(progTile, "modelViewMatrix");
	},
	
	render: function() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		this.renderTile.render();
		this.renderWindow.render();
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
	if(editor.getCurrentWindow() == editor.windows[editor.windowType.tile]) {
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
}

EditorRenderTile.prototype.renderTiles = function(tiles) {
	for(var i = 0; i < tiles.length; i++) {
		var modelView = mat4.create();
		mat4.translate(modelView, modelView, [100 + i*256, 400.0, 1.2]);
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

RenderWindow = function() {
	RenderWindow.baseConstructor.call(this);
	
	this.modelWindow = new ModelSquare();
	this.initBuffers(this.modelWindow);
}

InheritenceManager.extend(RenderWindow, RenderBase);

RenderWindow.prototype.render = function() {
	gl.useProgram(progWindow);
	var currWindow = editor.getCurrentWindow();
	this.renderWindow(currWindow);
	gl.useProgram(progButton);
	for(var i = 0; i < currWindow.getButtons().length; i++) {
		this.renderButton(currWindow, currWindow.getButtons()[i]);
		this.renderButtonText(currWindow, currWindow.getButtons()[i]);
	}
}

RenderWindow.prototype.renderWindow = function(window) {
	var modelView = mat4.create();
	mat4.translate(modelView, modelView, [window.getPos().x, window.getPos().y, 0.0]);
	mat4.scale(modelView, modelView, [window.getSize().x, window.getSize().y, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	
	gl.uniformMatrix4fv(progWindow.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progWindow.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, window.getTex());
    gl.uniform1i(progWindow.tex, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.posBuffer);
	gl.vertexAttribPointer(progWindow.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.texBuffer);
	gl.vertexAttribPointer(progWindow.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.normalBuffer);
	gl.vertexAttribPointer(progWindow.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelWindow.getNumVertices());
}

RenderWindow.prototype.renderButton = function(guiWindow, guiButton) {
	var modelView = mat4.create();
	mat4.translate(modelView, modelView, [guiWindow.getPos().x + guiButton.getPos().x, guiWindow.getPos().y + guiButton.getPos().y, 1.0]);
	mat4.scale(modelView, modelView, [guiButton.getSize().x, guiButton.getSize().y, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	
	gl.uniformMatrix4fv(progButton.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progButton.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, guiButton.getTex());
    gl.uniform1i(progButton.tex, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.posBuffer);
	gl.vertexAttribPointer(progButton.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.texBuffer);
	gl.vertexAttribPointer(progButton.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.normalBuffer);
	gl.vertexAttribPointer(progButton.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelWindow.getNumVertices());
}

RenderWindow.prototype.renderButtonText = function(guiWindow, guiButton) {
	var modelView = mat4.create();
	mat4.translate(modelView, modelView, [guiWindow.getPos().x + guiButton.getPos().x, guiWindow.getPos().y + guiButton.getPos().y, 1.1]);
	mat4.scale(modelView, modelView, [guiButton.getSize().x, guiButton.getSize().y, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	
	gl.uniformMatrix4fv(progButton.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progButton.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, guiButton.getTextTex());
    gl.uniform1i(progButton.textTex, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.posBuffer);
	gl.vertexAttribPointer(progButton.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.texBuffer);
	gl.vertexAttribPointer(progButton.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelWindow.normalBuffer);
	gl.vertexAttribPointer(progButton.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelWindow.getNumVertices());
}

