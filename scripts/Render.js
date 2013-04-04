function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function() {
		this.prog = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.renderEntity = new RenderEntity(this.prog);
		this.renderWorld = new RenderWorld(this.prog);
		this.renderParticle = new RenderParticle(utils.addShaderProg(gl, 'particle.vert', 'particle.frag'));
		this.renderTile = new RenderTile(this.prog);
		this.renderBB = new RenderBoundingBox(utils.addShaderProg(gl, 'bb.vert', 'bb.frag'));
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	},
	
	render: function() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		this.renderWorld.render();
		this.renderEntity.render();
		this.renderTile.render();
		this.renderBB.render();
		this.renderParticle.render();
	}
}

RenderBase = function(prog) { //the base type of renderer
	this.prog = prog;
	
	this.initShader();
}

RenderBase.prototype = {
	
	initShader: function() {
		gl.useProgram(this.prog);
		this.prog.position = gl.getAttribLocation(this.prog, "inPosition");
		this.prog.texCoord = gl.getAttribLocation(this.prog, "inTexCoord");
		this.prog.normal = gl.getAttribLocation(this.prog, "inNormal");
		this.prog.tex = gl.getUniformLocation(this.prog, "inTexSample");
		
		this.prog.proj = gl.getUniformLocation(this.prog, "projMatrix");
		this.prog.modelView = gl.getUniformLocation(this.prog, "modelViewMatrix");
		
		this.prog.fade = gl.getUniformLocation(this.prog, "fade");
	}, 
	
	generateModel: function(model) { //generate the model
		
		gl.useProgram(this.prog);
		
		var vertexArrayObjID = gl.createBuffer();
		/*var vertexBufferObjID = gl.createBuffer();
		var indexBufferObjID = gl.createBuffer();
		
		var colorBufferObjID = gl.createBuffer();*/
		
		var normalBufferObjID = gl.createBuffer();
		var textureBufferObjID = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexArrayObjID);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getVertexArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.prog.position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.prog.position);
		
		if(model.getTexCoordArray() != 0) {
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObjID);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
			gl.vertexAttribPointer(this.prog.texCoord, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.prog.texCoord);
		}
		
		if(model.getNormalArray() != 0) {
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObjID);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getNormalArray()), gl.STATIC_DRAW);
			gl.vertexAttribPointer(this.prog.normal, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.prog.normal);
		}
		
		return vertexArrayObjID;
	},
	
	getProg: function() {
		return this.prog;
	}
}

RenderEntity = function(prog) {	//Render Square Class
	RenderEntity.baseConstructor.call(this, prog);
	
	this.modelPlayer = new ModelSquare();
	this.vaoPlayer = this.generateModel(this.modelPlayer);
	this.texPlayer = gl.createTexture();
	Texture.loadImage(gl, "resources/player.png", this.texPlayer);
}

InheritenceManager.extend(RenderEntity, RenderBase);

RenderEntity.prototype.render = function() {
	gl.useProgram(this.prog);
	
	this.renderPlayer();
};

RenderEntity.prototype.renderPlayer = function() {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}

	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [playerPos.x, playerPos.y, 1.0]);
	else if(playerPos.x > (world.worldSize.x - ((gl.viewportWidth)/2)))
		mat4.translate(modelView, modelView, [playerPos.x - (world.worldSize.x - ((gl.viewportWidth))), playerPos.y, 1.0]);
	else
		mat4.translate(modelView, modelView, [(gl.viewportWidth)/2, playerPos.y, 1.0]);
	mat4.scale(modelView, modelView, [world.player.size.x, world.player.size.y, 1.0]);
	//Used to center the player on the canvas
	mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoPlayer);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texPlayer);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelPlayer.getNumVertices());
}

//----------------------------------PARTICLES------------------------------------//
RenderParticle = function(prog) {
	RenderParticle.baseConstructor.call(this, prog);
//------------------Smoke Particles---------------------//
	this.modelParticleSmoke = new ModelSquare();
	this.vaoParticleSmoke = this.generateModel(this.modelParticleSmoke);
	this.texParticleSmoke = gl.createTexture();
	Texture.loadImage(gl, "resources/smokeParticle.png", this.texParticleSmoke);
//------------------Fire Particles---------------------//
	this.modelParticleFire = new ModelSquare();
	this.vaoParticleFire = this.generateModel(this.modelParticleFire);
	this.texParticleFire = gl.createTexture();
	Texture.loadImage(gl, "resources/fireParticle.png", this.texParticleFire);
//------------------Fluid Particles---------------------//
	this.modelParticleFluid = new ModelSquare();
	this.vaoParticleFluid = this.generateModel(this.modelParticleFluid);
	this.texParticleFluid = gl.createTexture();
	Texture.loadImage(gl, "resources/fluidParticle.png", this.texParticleFluid);
	
	this.init();
};

InheritenceManager.extend(RenderParticle, RenderBase);

RenderParticle.prototype.init = function() { 
	var err = "Your browser does not support ";
	var ext;
	try {
		ext = gl.getExtension("OES_texture_float");
	} catch(e) {
		
	}
	if (!ext) {
		alert(err + "OES_texture_float extension"); 
		return;
	}
	if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0){
		alert(err + "Vertex texture"); return;
	}
	
	this.progParticle = utils.addShaderProg(gl, 'particle-calc.vert', 'particle-calc.frag');
	
	gl.useProgram(this.progParticle);
	this.progParticle.pos = gl.getAttribLocation(this.progParticle, "inPos");
	this.progParticle.tex = gl.getAttribLocation(this.progParticle, "inTex");
	gl.enableVertexAttribArray(this.progParticle.pos);
	gl.enableVertexAttribArray(this.progParticle.tex);
	var data = new Float32Array([	-1, -1, 	0, 0, 
									-1, 1, 		0, 1, 
									1, -1, 		1, 0, 
									1, 1, 		1, 1]);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.vertexAttribPointer(this.progParticle.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(this.progParticle.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
	
	var n = 64;
	var n2 = n*n;
	
	var pix = [], lengthFromMiddle = 100;
	for(var i = 0; i < n2; i++){
		var phi = 2*i*Math.PI/n2;
		pix.push(lengthFromMiddle*Math.cos(phi), lengthFromMiddle*Math.sin(phi), 0);
   }
	
//-------This texture stores the position and velocity-------//
	this.texParticle1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticle1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, new Float32Array(pix));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//-------This texture also stores the position and velocity-------//
  	this.texParticle2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticle2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, new Float32Array(pix));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//----------This framebuffer stores the texture so we can use it as a output in the shader----//
	/*this.FBO1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticle1, 0);
	
	this.FBO2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticle2, 0);

	if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
		console.log(err + "FLOAT as the color attachment to an FBO");
	
	*/
	
	//this.progParticle.sampLoc1 = gl.getUniformLocation(this.progParticle, "samp1");
	//this.progParticle.sampLoc2 = gl.getUniformLocation(this.progParticle, "samp2");
	
	this.progParticleShow = utils.addShaderProg(gl, 'particle-calc-show.vert', 'particle-calc-show.frag');
	this.progParticleShow.points = 3;
	gl.bindAttribLocation(this.progParticleShow, this.progParticleShow.points, "inPoints");
	gl.linkProgram(this.progParticleShow);
	gl.useProgram(this.progParticleShow);
	
	var vertices = [], d = 1/n;
	for (var y = 0; y < 1; y += d)
		for (var x = 0; x < 1; x += d)
			vertices.push (x, y);
	
	this.gpuParticleVao = gl.createBuffer();
	gl.enableVertexAttribArray( this.progParticleShow.points );
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
   	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   	gl.vertexAttribPointer(this.progParticleShow.points, 2, gl.FLOAT, false, 0, 0);
	
	gl.uniform1i(gl.getUniformLocation(this.progParticleShow, "sampl1"), 1);
	
	this.mvMatLoc = gl.getUniformLocation(this.progParticleShow, "mvMatrix");
	
	console.log("pos: " + this.progParticle.pos);
	console.log("tex: " + this.progParticle.tex);
	console.log("points: " + this.progParticleShow.points);
}

RenderParticle.prototype.render = function() {
	
	gl.useProgram(this.prog);
//------------------------------------SMOKE---------------------------------//
	gl.depthMask(false); //see other particles through the particles
	var smokeEmitters = world.getSmokeEmitters();
	for(var i = 0; i < smokeEmitters.length; i++)
	{
		var currEmitterParticles = smokeEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderSmokeParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getFade(), currEmitterParticles[j].getDiameter(), currEmitterParticles[j].getRotation());
		}
	}
//------------------------------------FIRE---------------------------------//
	gl.depthMask(false); //see other particles through the particles
	var fireEmitters = world.getFireEmitters();
	for(var i = 0; i < fireEmitters.length; i++)
	{
		var currEmitterParticles = fireEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderFireParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getFade(), currEmitterParticles[j].getDiameter(), currEmitterParticles[j].getRotation());
		}
	}
//------------------------------------FLUID---------------------------------//
	gl.depthMask(true); //see other particles through the particles
	var fluidEmitters = world.getFluidEmitters();
	for(var i = 0; i < fluidEmitters.length; i++)
	{
		var currEmitterParticles = fluidEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderFluidParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getDiameter());
		}
	}
	gl.depthMask(false);
	this.renderTemp();
	gl.depthMask(true);
};

RenderParticle.prototype.renderTemp = function() {
	/*gl.useProgram(this.progParticle);
	gl.viewport(0, 0, 64, 64);
	gl.uniform1i(this.progParticle.sampLoc1, 1);
	gl.uniform1i(this.progParticle.sampLoc2, 2);
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.flush();
	
	gl.uniform1i(this.progParticle.sampLoc1, 2);
	gl.uniform1i(this.progParticle.sampLoc2, 1);
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO2);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.flush();*/
	
	//gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(this.progParticleShow);
  	var mvMatrix = mat4.create();
  	mat4.lookAt(mvMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
  	mat4.translate(mvMatrix, mvMatrix, [gl.viewportWidth/2, gl.viewportHeight/2, 0.5]);
  	//mvMatrix = mat4.translate(mvMatrix, mvMatrix, [size/2, size/2, -700]);
  	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  	gl.uniformMatrix4fv(gl.getUniformLocation(this.progParticleShow, "prMatrix"), false, cam.getProj());
  	gl.uniformMatrix4fv(this.mvMatLoc, false, mvMatrix);
  	
	//gl.enable(gl.BLEND);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
  	gl.drawArrays(gl.POINTS, 0, 64*64);
  	//gl.disable(gl.BLEND);
 	gl.flush();
}

//------------------------------------SMOKE---------------------------------//
RenderParticle.prototype.renderSmokeParticle = function(pos, fade, scale, rotation) {
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y-(scale/2), 0.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth))-(scale/2), pos.y-(scale/2), 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2))-(scale/2), pos.y-(scale/2), 0.5]);

	mat4.rotate(modelView, modelView, rotation, [0,0,1]);

	mat4.scale(modelView, modelView, [scale/(fade+0.4), scale/(fade+0.4), 0.0]); //shrink the particles
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleSmoke);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleSmoke);
    gl.uniform1i(this.prog.tex, 0);
    gl.uniform1f(this.prog.fade, fade);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelParticleSmoke.getNumVertices());
};

//------------------------------------FIRE---------------------------------//
RenderParticle.prototype.renderFireParticle = function(pos, fade, scale, rotation) {
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
		
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y, 0.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth))-(scale/2), pos.y, 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2))-(scale/2), pos.y, 0.5]);
	
	mat4.rotate(modelView, modelView, rotation, [0,0,1]);
	
	mat4.scale(modelView, modelView, [scale*fade, scale*fade, 0.0]); //shrink the particles

	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleFire);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleFire);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelParticleFire.getNumVertices());
};

//------------------------------------FLUID---------------------------------//
RenderParticle.prototype.renderFluidParticle = function(pos, scale) {
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y-(scale/2), 0.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth))-(scale/2), pos.y-(scale/2), 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2))-(scale/2), pos.y-(scale/2), 0.5]);
	
	mat4.scale(modelView, modelView, [scale, scale, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleFluid);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleFluid);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelParticleFluid.getNumVertices());
};

//----------------------------------TILES------------------------------------//
RenderTile = function(gl, world, cam, prog) {	//Render Square Class
	RenderTile.baseConstructor.call(this, gl, cam, prog);
	world = world;
	
	this.modelTile = new ModelSquare();
	this.vaoTile = this.generateModel(this.modelTile);
	//this.texParticle = gl.createTexture();
	//Texture.loadImage(gl, "resources/particle.png", this.texParticle);
}

InheritenceManager.extend(RenderTile, RenderBase);

RenderTile.prototype.render = function() {
	gl.useProgram(this.prog);
	var tilesBg = world.getTilesBg();
	
	for(var i = 0; i < tilesBg.length; i++)
	{
		//console.log(world.getEmitter().getParticles()[i].getPosition());
		this.renderTileBg(tilesBg[i].getPosition(), tilesBg[i].getTile().getTex(), tilesBg[i].getTile().getSize());
	}
	
	var tilesMg = world.getTilesMg();
	
	for(var i = 0; i < tilesMg.length; i++)
	{
		//console.log(world.getEmitter().getParticles()[i].getPosition());
		this.renderTileMg(tilesMg[i].getPosition(), tilesMg[i].getTile().getTex(), tilesMg[i].getTile().getSize());
	}
	
	var tilesFg = world.getTilesFg();
	
	for(var i = 0; i < tilesFg.length; i++)
	{
		//console.log(world.getEmitter().getParticles()[i].getPosition());
		this.renderTileFg(tilesFg[i].getPosition(), tilesFg[i].getTile().getTex(), tilesFg[i].getTile().getSize());
	}
};

RenderTile.prototype.renderTileBg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, -9.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.bgSize.x - (gl.viewportWidth)), pos.y, -9.0]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, pos.y, -9.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileMg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 1.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), pos.y, 1.0]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, 1.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileFg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 2.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.fgSize.x - (gl.viewportWidth)), pos.y, 2.0]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, 2.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderWorld = function(prog) {
	RenderWorld.baseConstructor.call(this, prog);
	
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
	gl.useProgram(this.prog);
	this.renderBg();
	this.renderMg();
};

RenderWorld.prototype.renderBg = function() {
	
	var modelView = mat4.create();	  //make it wider
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, -10.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.texBg.width - (gl.viewportWidth)), 0.0, -10.0]);
	else {
		//---------WiewportWidth scaled with the bg/mg ratio----------------------------------------------------------------------------------playerpos scaled with the bg/mg ratio -----------------//
		var trans = (((gl.viewportWidth)/2)*((this.texBg.width - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - ((playerPos.x)*((this.texBg.width - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans, 0.0, -10.0]);
	}
	mat4.scale(modelView, modelView, [this.texBg.width, this.texBg.height, 1.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBg);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texBg);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
};

RenderWorld.prototype.renderMg = function() {
	
	var modelView = mat4.create();
	

	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(world.worldSize.x - (gl.viewportWidth)), 0.0, 0.0]);
	else {
		//----------------------------------- -playerpos      -window/3/2 to get to the middle   /Mgwidth to scale correctly -----------------//
		mat4.translate(modelView, modelView, [-(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 0.0]);
	}
	mat4.scale(modelView, modelView, [this.texMg.width, this.texMg.height, 1.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoMg);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	//gl.enableAlphaTest();
	gl.bindTexture(gl.TEXTURE_2D, this.texMg);
    gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelMg.getNumVertices());
};

RenderBoundingBox = function(prog) {	//Render Square Class
	RenderBoundingBox.baseConstructor.call(this, prog);
	
	this.modelBB = new ModelSquare();
	this.vaoBB = this.generateModel(this.modelBB);
	
	//this.shouldRender = false;
	//this.texParticle = gl.createTexture();
	//Texture.loadImage(gl, "resources/particle.png", this.texParticle);
}

InheritenceManager.extend(RenderBoundingBox, RenderBase);

RenderBoundingBox.prototype.render = function() {
	
	if(debug) {
		gl.useProgram(this.prog);
		
		
		var playerPos = {
			x: world.player.getPosition().x - world.player.size.x/2, 
			y: world.player.getPosition().y
		}
		this.renderBB(playerPos, world.player.size);
		
		var tilesMg = world.getTilesMg();
		for(var i = 0; i < tilesMg.length; i++) {
			
			var pos = {
				x: tilesMg[i].getPosition().x + tilesMg[i].getTile().getBB().getMin().x, 
				y: tilesMg[i].getPosition().y + tilesMg[i].getTile().getBB().getMin().y
			}
			
			var size = {
				x: tilesMg[i].getTile().getBB().getMax().x,
				y: tilesMg[i].getTile().getBB().getMax().y
			}
			this.renderBB(pos, size);
		}
	}
};

RenderBoundingBox.prototype.renderBB = function(pos, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 1.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), pos.y, 1.5]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, 1.5]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBB);

	gl.uniformMatrix4fv(this.prog.proj, false, cam.getProj());
	gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	//gl.bindTexture(gl.TEXTURE_2D, tex);
 	//gl.uniform1i(this.prog.tex, 0);
	
	gl.drawArrays(gl.LINE_STRIP, 0, this.modelBB.getNumVertices());
}