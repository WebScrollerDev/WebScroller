var progWindow, progButton;
MenuRenderer = function() {
	this.init();
}

MenuRenderer.prototype = {
	
	init: function() {
		progButton = utils.addShaderProg(gl, 'button.vert', 'button.frag');
		progWindow = utils.addShaderProg(gl, 'window.vert', 'window.frag');
		this.initShaders();
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

	},
	
	render: function() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		this.renderWindow.render();
	}
}

RenderWindow = function() {
	console.log("hej");
	RenderWindow.baseConstructor.call(this);
	
	this.modelWindow = new ModelSquare();
	this.initBuffers(this.modelWindow);
}

InheritenceManager.extend(RenderWindow, RenderBase);

RenderWindow.prototype.render = function() {
	gl.useProgram(progWindow);
	var currWindow = mainMenu.getCurrentWindow();
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

