function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function(gl, world, cam) {
		this.gl = gl;
		this.prog = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		this.renderEntity = new RenderEntity(gl, world, cam, this.prog);
		this.renderWorld = new RenderWorld(gl, world, cam, this.prog);
		this.renderParticle = new RenderParticle(gl, world, cam, utils.addShaderProg(gl, 'particle.vert', 'particle.frag'));
		this.renderTile = new RenderTile(gl, world, cam, this.prog);
		this.renderBB = new RenderBoundingBox(gl, world, cam, utils.addShaderProg(gl, 'bb.vert', 'bb.frag'));
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	},
	
	render: function() {
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.renderWorld.render();
		this.renderEntity.render();
		this.renderTile.render();
		this.renderBB.render();
		this.renderParticle.render();
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
	this.gl.useProgram(this.prog);
	
	this.renderPlayer();
	
};

RenderEntity.prototype.renderPlayer = function() {
	var modelView = mat4.create();
	
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}

	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [playerPos.x, playerPos.y, 1.0]);
	else if(playerPos.x > (this.world.worldSize.x - ((this.gl.viewportWidth)/2)))
		mat4.translate(modelView, modelView, [playerPos.x - (this.world.worldSize.x - ((this.gl.viewportWidth))), playerPos.y, 1.0]);
	else
		mat4.translate(modelView, modelView, [(this.gl.viewportWidth)/2, playerPos.y, 1.0]);
	mat4.scale(modelView, modelView, [this.world.player.size.x, this.world.player.size.y, 1.0]);
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

//----------------------------------PARTICLES------------------------------------//
RenderParticle = function(gl, world, cam, prog) {
	RenderParticle.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
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
	
	this.init(gl);
};

InheritenceManager.extend(RenderParticle, RenderBase);

RenderParticle.prototype.init = function(gl) { 
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
									1, -1, 		1, 0, 
									-1, 1, 		0, 1, 
									1, 1, 		1, 1]);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.vertexAttribPointer(this.progParticle.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(this.progParticle.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
	
	var n = 256;
	
	var posVel = new Float32Array(4*n*n);
	var i = 0;
	
	for(var x = 0; x < n; x++) {
		for(var y = 0; y < n; y++) {
			var velocity = {
				x: Math.random() * 2 - 1, 
				y: Math.random() * 2 - 1
			}
			//if((x % 10 == 0) && (y % 10 == 0)) {
				posVel[i++] = x;
				posVel[i++] = y;
				posVel[i++] = velocity.x;
				posVel[i++] = velocity.y;
			//}
		}
	}
//-------This texture stores the position and velocity-------//
	this.texParticle1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticle1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, posVel);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//-------This texture also stores the position and velocity-------//
  	this.texParticle2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticle2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, posVel);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//----------This framebuffer stores the texture so we can use it as a output in the shader----//
	this.FBO1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticle1, 0);
	
	this.FBO2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticle2, 0);

	if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
		console.log(err + "FLOAT as the color attachment to an FBO");
		
	this.progParticle.sampLoc1 = gl.getUniformLocation(this.progParticle, "samp1");
	this.progParticle.sampLoc2 = gl.getUniformLocation(this.progParticle, "samp2");
	
	this.progParticleShow = utils.addShaderProg(gl, 'particle-calc-show.vert', 'particle-calc-show.frag');
	
	gl.useProgram(this.progParticleShow);
	this.progParticleShow.position = this.gl.getAttribLocation(this.progParticleShow, "inPosition");
	
	var posTrans = new Float32Array(8*(n-1)*(n-1));
	var i = 0;
	h = 1/(n-1);
	for(var x = 0; x < n-1; x++) {
		for(var y = 0; y < n-1; y++) {
			posTrans[i++] = x*h;
			posTrans[i++] = y*h;
			
			posTrans[i++] = x*h;
			posTrans[i++] = (y+1)*h;
			
			posTrans[i++] = (x+1)*h;
			posTrans[i++] = y*h;
			
			posTrans[i++] = (x+1)*h;
			posTrans[i++] = (y+1)*h;
		}
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, posTrans, gl.STATIC_DRAW);
	gl.vertexAttribPointer(this.progParticleShow.position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.progParticleShow.position);
	gl.activeTexture(gl.TEXTURE0);
}

RenderParticle.prototype.render = function() {
	this.gl.useProgram(this.prog);
//------------------------------------SMOKE---------------------------------//
	this.gl.depthMask(false); //see other particles through the particles
	var smokeEmitters = this.world.getSmokeEmitters();
	for(var i = 0; i < smokeEmitters.length; i++)
	{
		var currEmitterParticles = smokeEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderSmokeParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getFade(), currEmitterParticles[j].getDiameter(), currEmitterParticles[j].getRotation());
		}
	}
//------------------------------------FIRE---------------------------------//
	this.gl.depthMask(false); //see other particles through the particles
	var fireEmitters = this.world.getFireEmitters();
	for(var i = 0; i < fireEmitters.length; i++)
	{
		var currEmitterParticles = fireEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderFireParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getFade(), currEmitterParticles[j].getDiameter(), currEmitterParticles[j].getRotation());
		}
	}
//------------------------------------FLUID---------------------------------//
	this.gl.depthMask(true); //see other particles through the particles
	var fluidEmitters = this.world.getFluidEmitters();
	for(var i = 0; i < fluidEmitters.length; i++)
	{
		var currEmitterParticles = fluidEmitters[i].getParticles();
		for(var j = 0; j < currEmitterParticles.length; j++)
		{
			this.renderFluidParticle(currEmitterParticles[j].getPosition(), currEmitterParticles[j].getDiameter());
		}
	}
	
	//this.renderTemp();
};

RenderParticle.prototype.renderTemp = function() {
	this.gl.useProgram(this.progParticle);
	
	this.gl.uniform1i(this.progParticle.sampLoc1, 1);
	this.gl.uniform1i(this.progParticle.sampLoc2, 2);
	this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
	this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	this.gl.flush();
	
	this.gl.uniform1i(this.progParticle.sampLoc1, 2);
	this.gl.uniform1i(this.progParticle.sampLoc2, 1);
	this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO2);
	this.gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	this.gl.flush();
	
	this.gl.useProgram(this.progParticleShow);
	//PROJ AND MODELVIEW NEEDED
	this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.progParticleShow, "projMatrix"), false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.progParticleShow, "modelViewMatrix"), false, this.cam.getView());
	
		
	/*this.gl.enable(this.gl.BLEND);
	this.gl.drawArrays(this.gl.POINTS, 0, 256);
	this.gl.disable(this.gl.BLEND);
	this.gl.flush();*/
}

//------------------------------------SMOKE---------------------------------//
RenderParticle.prototype.renderSmokeParticle = function(pos, fade, scale, rotation) {
	var modelView = mat4.create();
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y-(scale/2), 0.5]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.worldSize.x - (this.gl.viewportWidth))-(scale/2), pos.y-(scale/2), 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2))-(scale/2), pos.y-(scale/2), 0.5]);

	mat4.rotate(modelView, modelView, rotation, [0,0,1]);

	mat4.scale(modelView, modelView, [scale/(fade+0.4), scale/(fade+0.4), 0.0]); //shrink the particles
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleSmoke);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParticleSmoke);
    this.gl.uniform1i(this.prog.tex, 0);
    this.gl.uniform1f(this.prog.fade, fade);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelParticleSmoke.getNumVertices());
};

//------------------------------------FIRE---------------------------------//
RenderParticle.prototype.renderFireParticle = function(pos, fade, scale, rotation) {
	var modelView = mat4.create();
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
		
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y, 0.5]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.worldSize.x - (this.gl.viewportWidth))-(scale/2), pos.y, 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2))-(scale/2), pos.y, 0.5]);
	
	mat4.rotate(modelView, modelView, rotation, [0,0,1]);
	
	mat4.scale(modelView, modelView, [scale*fade, scale*fade, 0.0]); //shrink the particles

	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleFire);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParticleFire);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelParticleFire.getNumVertices());
};

//------------------------------------FLUID---------------------------------//
RenderParticle.prototype.renderFluidParticle = function(pos, scale) {
	var modelView = mat4.create();
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x-(scale/2), pos.y-(scale/2), 0.5]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.worldSize.x - (this.gl.viewportWidth))-(scale/2), pos.y-(scale/2), 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2))-(scale/2), pos.y-(scale/2), 0.5]);
	
	mat4.scale(modelView, modelView, [scale, scale, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleFluid);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParticleFluid);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelParticleFluid.getNumVertices());
};

//----------------------------------TILES------------------------------------//
RenderTile = function(gl, world, cam, prog) {	//Render Square Class
	RenderTile.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
	
	this.modelTile = new ModelSquare();
	this.vaoTile = this.generateModel(this.modelTile);
	//this.texParticle = gl.createTexture();
	//Texture.loadImage(gl, "resources/particle.png", this.texParticle);
}

InheritenceManager.extend(RenderTile, RenderBase);

RenderTile.prototype.render = function() {
	this.gl.useProgram(this.prog);
	var tilesBg = this.world.getTilesBg();
	
	for(var i = 0; i < tilesBg.length; i++)
	{
		//console.log(this.world.getEmitter().getParticles()[i].getPosition());
		this.renderTileBg(tilesBg[i].getPosition(), tilesBg[i].getTile().getTex(), tilesBg[i].getTile().getSize());
	}
	
	var tilesMg = this.world.getTilesMg();
	
	for(var i = 0; i < tilesMg.length; i++)
	{
		//console.log(this.world.getEmitter().getParticles()[i].getPosition());
		this.renderTileMg(tilesMg[i].getPosition(), tilesMg[i].getTile().getTex(), tilesMg[i].getTile().getSize());
	}
	
	var tilesFg = this.world.getTilesFg();
	
	for(var i = 0; i < tilesFg.length; i++)
	{
		//console.log(this.world.getEmitter().getParticles()[i].getPosition());
		this.renderTileFg(tilesFg[i].getPosition(), tilesFg[i].getTile().getTex(), tilesFg[i].getTile().getSize());
	}
};

RenderTile.prototype.renderTileBg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, -9.0]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.bgSize.x - (this.gl.viewportWidth)), pos.y, -9.0]);
	else {
		var trans = (((this.gl.viewportWidth)/2)*((this.world.bgSize.x - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth))) - 
					(playerPos.x*((this.world.bgSize.x - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, -9.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(this.world.player.size.x*0.5)/this.world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileMg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 1.0]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.worldSize.x - (this.gl.viewportWidth)), pos.y, 1.0]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2)), pos.y, 1.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(this.world.player.size.x*0.5)/this.world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileFg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 2.0]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.fgSize.x - (this.gl.viewportWidth)), pos.y, 2.0]);
	else {
		var trans = (((this.gl.viewportWidth)/2)*((this.world.fgSize.x - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth))) - 
					(playerPos.x*((this.world.fgSize.x - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, 2.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(this.world.player.size.x*0.5)/this.world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoTile);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
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
	this.gl.useProgram(this.prog);
	this.renderBg();
	this.renderMg();
};

RenderWorld.prototype.renderBg = function() {
	
	var modelView = mat4.create();	  //make it wider
	
	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, -10.0]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.texBg.width - (this.gl.viewportWidth)), 0.0, -10.0]);
	else {
		//---------WiewportWidth scaled with the bg/mg ratio----------------------------------------------------------------------------------playerpos scaled with the bg/mg ratio -----------------//
		var trans = (((this.gl.viewportWidth)/2)*((this.texBg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth))) - ((playerPos.x)*((this.texBg.width - this.gl.viewportWidth)/(this.world.worldSize.x - this.gl.viewportWidth)));
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
	

	var playerPos = {
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(this.world.worldSize.x - (this.gl.viewportWidth)), 0.0, 0.0]);
	else {
		//----------------------------------- -playerpos      -window/3/2 to get to the middle   /Mgwidth to scale correctly -----------------//
		mat4.translate(modelView, modelView, [-(playerPos.x - ((this.gl.viewportWidth)/2)), 0.0, 0.0]);
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

RenderBoundingBox = function(gl, world, cam, prog) {	//Render Square Class
	RenderBoundingBox.baseConstructor.call(this, gl, cam, prog);
	this.world = world;
	
	this.modelBB = new ModelSquare();
	this.vaoBB = this.generateModel(this.modelBB);
	
	//this.shouldRender = false;
	//this.texParticle = gl.createTexture();
	//Texture.loadImage(gl, "resources/particle.png", this.texParticle);
}

InheritenceManager.extend(RenderBoundingBox, RenderBase);

RenderBoundingBox.prototype.render = function() {
	
	if(debug) {
		this.gl.useProgram(this.prog);
		
		
		var playerPos = {
			x: this.world.player.getPosition().x - this.world.player.size.x/2, 
			y: this.world.player.getPosition().y
		}
		this.renderBB(playerPos, this.world.player.size);
		
		var tilesMg = this.world.getTilesMg();
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
		x: this.world.player.getPosition().x, 
		y: this.world.player.getPosition().y
	}
	if(playerPos.x < (this.gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, 1.5]);
	else if(playerPos.x > this.world.worldSize.x - ((this.gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(this.world.worldSize.x - (this.gl.viewportWidth)), pos.y, 1.5]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((this.gl.viewportWidth)/2)), pos.y, 1.5]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(this.world.player.size.x*0.5)/this.world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, this.cam.getView(), modelView);
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBB);

	this.gl.uniformMatrix4fv(this.prog.proj, false, this.cam.getProj());
	this.gl.uniformMatrix4fv(this.prog.modelView, false, modelView);
	
	//this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
 	//this.gl.uniform1i(this.prog.tex, 0);
	
	this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.modelBB.getNumVertices());
}

