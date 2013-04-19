var progEntity, progWorld, progTileMg, progTileBg, progTileFg, progParticle, progParticleGpu, progParticleGpuShowg, progLine;

function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function() {
		
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
		
		
		progEntity = utils.addShaderProg(gl, 'player.vert', 'player.frag');
		progWorld = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		progParticle = utils.addShaderProg(gl, 'particle.vert', 'particle.frag');
		progTileMg = utils.addShaderProg(gl, 'tileMg.vert', 'tileMg.frag');
		progTileBg = utils.addShaderProg(gl, 'tileBg.vert', 'tileBg.frag');
		progTileFg = utils.addShaderProg(gl, 'tileFg.vert', 'tileFg.frag');
		progLine = utils.addShaderProg(gl, 'line.vert', 'line.frag');
		progParticleGpu = utils.addShaderProg(gl, 'particle-calc.vert', 'particle-calc.frag');
		
		this.initShaders();
		this.renderEntity = new RenderEntity();
		this.renderWorld = new RenderWorld();
		this.renderParticle = new RenderParticle();
		this.renderLight = new RenderLight();
		this.renderTile = new RenderTile();		
		this.renderBB = new RenderBoundingBox();
		this.renderFabric = new RenderFabric();
		
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	},
	
	initShaders: function() {
		
//---------------------------------TILE-MG SHADER-----------------------------------//	
		gl.useProgram(progTileMg);
		
		progTileMg.position = gl.getAttribLocation(progTileMg, "inPosition");
		gl.enableVertexAttribArray(progTileMg.position);
		
		progTileMg.texCoord = gl.getAttribLocation(progTileMg, "inTexCoord");
		gl.enableVertexAttribArray(progTileMg.texCoord);
		
		progTileMg.normal = gl.getAttribLocation(progTileMg, "inNormal");
		gl.enableVertexAttribArray(progTileMg.normal);
		
		progTileMg.tex = gl.getUniformLocation(progTileMg, "inTexSample");
		progTileMg.proj = gl.getUniformLocation(progTileMg, "projMatrix");
		progTileMg.modelView = gl.getUniformLocation(progTileMg, "modelViewMatrix");
		progTileMg.view = gl.getUniformLocation(progTileMg, "viewMatrix");
		
		progTileMg.lightPos = gl.getUniformLocation(progTileMg, "lightPos");
		progTileMg.lightColor = gl.getUniformLocation(progTileMg, "lightColor");
		progTileMg.lightIntensity = gl.getUniformLocation(progTileMg, "lightIntensity");
		
		progTileMg.trans = gl.getUniformLocation(progTileMg, "trans");
		
//---------------------------------TILE-BG SHADER-----------------------------------//	
		gl.useProgram(progTileBg);
		
		progTileBg.position = gl.getAttribLocation(progTileBg, "inPosition");
		gl.enableVertexAttribArray(progTileBg.position);
		
		progTileBg.texCoord = gl.getAttribLocation(progTileBg, "inTexCoord");
		gl.enableVertexAttribArray(progTileBg.texCoord);
		
		progTileBg.normal = gl.getAttribLocation(progTileBg, "inNormal");
		gl.enableVertexAttribArray(progTileBg.normal);
		
		progTileBg.tex = gl.getUniformLocation(progTileBg, "inTexSample");
		progTileBg.proj = gl.getUniformLocation(progTileBg, "projMatrix");
		progTileBg.modelView = gl.getUniformLocation(progTileBg, "modelViewMatrix");
		progTileBg.view = gl.getUniformLocation(progTileBg, "viewMatrix");
		
		progTileBg.lightPos = gl.getUniformLocation(progTileBg, "lightPos");
		progTileBg.lightColor = gl.getUniformLocation(progTileBg, "lightColor");
		progTileBg.lightIntensity = gl.getUniformLocation(progTileBg, "lightIntensity");
		
		progTileBg.trans = gl.getUniformLocation(progTileBg, "trans");
		
//---------------------------------TILE-FG SHADER-----------------------------------//	
		gl.useProgram(progTileFg);
		
		progTileFg.position = gl.getAttribLocation(progTileFg, "inPosition");
		gl.enableVertexAttribArray(progTileFg.position);
		
		progTileFg.texCoord = gl.getAttribLocation(progTileFg, "inTexCoord");
		gl.enableVertexAttribArray(progTileFg.texCoord);
		
		progTileFg.normal = gl.getAttribLocation(progTileFg, "inNormal");
		gl.enableVertexAttribArray(progTileFg.normal);
		
		progTileFg.tex = gl.getUniformLocation(progTileFg, "inTexSample");
		progTileFg.proj = gl.getUniformLocation(progTileFg, "projMatrix");
		progTileFg.modelView = gl.getUniformLocation(progTileFg, "modelViewMatrix");
		progTileFg.view = gl.getUniformLocation(progTileFg, "viewMatrix");
		
		progTileFg.lightPos = gl.getUniformLocation(progTileFg, "lightPos");
		progTileFg.lightColor = gl.getUniformLocation(progTileFg, "lightColor");
		progTileFg.lightIntensity = gl.getUniformLocation(progTileFg, "lightIntensity");
		
		progTileFg.trans = gl.getUniformLocation(progTileFg, "trans");
		
//---------------------------------ENTITY SHADER-----------------------------------//		
		gl.useProgram(progEntity);
		
		progEntity.position = gl.getAttribLocation(progEntity, "inPosition");
		gl.enableVertexAttribArray(progEntity.position);
		progEntity.texCoord = gl.getAttribLocation(progEntity, "inTexCoord2");
		gl.enableVertexAttribArray(progEntity.texCoord);
		progEntity.normal = gl.getAttribLocation(progEntity, "inNormal");
		gl.enableVertexAttribArray(progEntity.normal);
		
		progEntity.tex = gl.getUniformLocation(progEntity, "inTexSample");
		progEntity.proj = gl.getUniformLocation(progEntity, "projMatrix");
		progEntity.modelView = gl.getUniformLocation(progEntity, "modelViewMatrix");

//---------------------------------WORLD SHADER-----------------------------------//		
		gl.useProgram(progWorld);
		
		progWorld.position = gl.getAttribLocation(progWorld, "inPosition");
		gl.enableVertexAttribArray(progWorld.position);
		progWorld.texCoord = gl.getAttribLocation(progWorld, "inTexCoord");
		gl.enableVertexAttribArray(progWorld.texCoord);
		progWorld.normal = gl.getAttribLocation(progWorld, "inNormal");
		gl.enableVertexAttribArray(progWorld.normal);
		
		progWorld.tex = gl.getUniformLocation(progWorld, "inTexSample");
		progWorld.proj = gl.getUniformLocation(progWorld, "projMatrix");
		progWorld.modelView = gl.getUniformLocation(progWorld, "modelViewMatrix");
		
//---------------------------------FABRIC/BB SHADER-----------------------------------//
		gl.useProgram(progLine);
		
		progLine.position = gl.getAttribLocation(progLine, "inPosition");
		gl.enableVertexAttribArray(progLine.position);
		progLine.proj = gl.getUniformLocation(progLine, "projMatrix");
		progLine.modelView = gl.getUniformLocation(progLine, "modelViewMatrix");	
		progLine.color = 	gl.getUniformLocation(progLine, "inColor");

//---------------------------------PARTICLE SHADER-----------------------------------//	
		gl.useProgram(progParticle);
		
		progParticle.position = gl.getAttribLocation(progParticle, "inPosition");
		gl.enableVertexAttribArray(progParticle.position);
		progParticle.texCoord = gl.getAttribLocation(progParticle, "inTexCoord");
		gl.enableVertexAttribArray(progParticle.texCoord);
		progParticle.normal = gl.getAttribLocation(progParticle, "inNormal");
		gl.enableVertexAttribArray(progParticle.normal);
		
		progParticle.tex = gl.getUniformLocation(progParticle, "inTexSample");
		progParticle.proj = gl.getUniformLocation(progParticle, "projMatrix");
		progParticle.modelView = gl.getUniformLocation(progParticle, "modelViewMatrix");
		progParticle.fade = gl.getUniformLocation(progParticle, "fade");
		
		gl.useProgram(progParticleGpu);
		progParticleGpu.pos = gl.getAttribLocation(progParticleGpu, "inPos");
		gl.enableVertexAttribArray(progParticleGpu.pos);
		progParticleGpu.tex = gl.getAttribLocation(progParticleGpu, "inTex");
		gl.enableVertexAttribArray(progParticleGpu.tex);
		progParticleGpu.posLoc = gl.getUniformLocation(progParticleGpu, "posSamp");
		progParticleGpu.velLoc = gl.getUniformLocation(progParticleGpu, "velSamp");
		
	},
	
	render: function() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		this.renderWorld.render();
		this.renderEntity.render();
		this.renderLight.update();
		this.renderTile.render();
		this.renderBB.render();
		this.renderParticle.render();
		this.renderFabric.render();
	}
}

RenderBase = function() { //the base type of renderer
	
}

RenderBase.prototype = {
	
	initBuffers: function(model) { //generate the model
		
		this.posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getVertexArray()), gl.STATIC_DRAW);
		
		this.texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
		
		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getNormalArray()), gl.STATIC_DRAW);
	}
}

RenderEntity = function() {	//Render Square Class
	RenderEntity.baseConstructor.call(this);
	this.modelPlayer = new ModelSquare();
	this.initBuffers(this.modelPlayer);
	this.texPlayer = gl.createTexture();
	Texture.loadImage(gl, "resources/player_ss.png", this.texPlayer);
}

InheritenceManager.extend(RenderEntity, RenderBase);

RenderEntity.prototype.render = function() {
	gl.useProgram(progEntity);
	
	this.renderPlayer();
};

RenderEntity.prototype.renderPlayer = function() {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	var playerVel = {
		x: world.player.getVelocity()[0],
		y: world.player.getVelocity()[1]
	}
	this.modelPlayer.anim(world.player.animationFrames[world.player.status], world.player.currFrame, world.player.totalNrAnimations, world.player.status, world.player.flipped);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelPlayer.getTexCoordArray()), gl.STATIC_DRAW);
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [playerPos.x, 0.0, 1.2]);
	else if(playerPos.x > (world.worldSize.x - ((gl.viewportWidth)/2)))
		mat4.translate(modelView, modelView, [playerPos.x - (world.worldSize.x - ((gl.viewportWidth))), 0.0, 1.2]);
	else
		mat4.translate(modelView, modelView, [(gl.viewportWidth)/2, 0.0, 1.2]);
		
	if(playerPos.y < gl.viewportHeight/2)
		mat4.translate(modelView, modelView, [0.0, playerPos.y, 0.0]);
	else if(playerPos.y > (world.worldSize.y - ((gl.viewportHeight)/2)))
		mat4.translate(modelView, modelView, [0.0, playerPos.y - (world.worldSize.y - ((gl.viewportHeight))), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, gl.viewportHeight/2, 0.0]);
		
	
	mat4.scale(modelView, modelView, [world.player.size.x, world.player.size.y, 1.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	//gl.bindBuffer(gl.ARRAY_BUFFER, tmpVaoPlayer);

	gl.uniformMatrix4fv(progEntity.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progEntity.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texPlayer);
    gl.uniform1i(progEntity.tex, 0);
    
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progEntity.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progEntity.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progEntity.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelPlayer.getNumVertices());
};

//----------------------------------CLOTH------------------------------------//
RenderFabric = function() {
	RenderFabric.baseConstructor.call(this);
};

InheritenceManager.extend(RenderFabric, RenderBase);

RenderFabric.prototype.render = function() {
	this.renderFabric(world.rope.getPoints(), 10.0, world.rope.getColor());
	this.renderFabric(world.cloth.getPoints(), 1.0, world.cloth.getColor());
};

RenderFabric.prototype.renderFabric = function(points, lineWidth, color) {
	
	gl.useProgram(progLine);
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	var i = points.length;
	var nrLines = 0;
	var model = [];
	while(i--) {								// for each point
		var j = points[i].constraints.length;
		while(j--) {							// for each constraint in that point
			model = model.concat(points[i].constraints[j].getPoints());
			nrLines+=2;
		}
	}
	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model), gl.STATIC_DRAW);
	
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 1.1]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(world.worldSize.x - (gl.viewportWidth)), 0.0, 1.1]);
	else
		mat4.translate(modelView, modelView, [-(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 1.1]);

	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progLine.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progLine.modelView, false, modelView);
	gl.uniform3f(progLine.color, color[0], color[1], color[2]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progLine.position, 3, gl.FLOAT, false, 0, 0);
	gl.lineWidth(lineWidth);
	gl.drawArrays(gl.LINES, 0, nrLines);
};

//----------------------------------PARTICLES------------------------------------//
RenderParticle = function() {
	RenderParticle.baseConstructor.call(this);
	
	
	
//------------------Smoke Particles---------------------//
	this.modelParticleSmoke = new ModelSquare();
	this.initBuffers(this.modelParticleSmoke);
	this.texParticleSmoke = gl.createTexture();
	Texture.loadImage(gl, "resources/smokeParticle.png", this.texParticleSmoke);
//------------------Fire Particles---------------------//
	this.modelParticleFire = new ModelSquare();
	//this.vaoParticleFire = generateModel(this.modelParticleFire, progParticle);
	this.initBuffers(this.modelParticleFire);
	this.texParticleFire = gl.createTexture();
	Texture.loadImage(gl, "resources/fireParticle.png", this.texParticleFire);
//------------------Fluid Particles---------------------//
	this.modelParticleFluid = new ModelSquare();
	this.initBuffers(this.modelParticleFluid);
	//this.vaoParticleFluid = generateModel(this.modelParticleFluid, progParticle);
	this.texParticleFluid = gl.createTexture();
	Texture.loadImage(gl, "resources/fluidParticle.png", this.texParticleFluid);

	this.initGpuParticle(world.gpuParticles[0].getAmount(), world.gpuParticles[0].getPos(), world.gpuParticles[0].getVel(), world.gpuParticles[0].getVertices());
};

InheritenceManager.extend(RenderParticle, RenderBase);

RenderParticle.prototype.initGpuParticle = function(particleAmount, pos, vel, vertices) { 
	var particleAmount2 = particleAmount*particleAmount;
	
	this.posTexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posTexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,0,0, -1,1,0,1, 1,-1,1,0, 1,1,1,1]), gl.STATIC_DRAW);
	
//-------This texture stores the position and velocity-------//
	this.texParticlePos1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//-------This texture also stores the position and velocity-------//
  	this.texParticlePos2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	
 	this.texParticleVel1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleVel1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(vel));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//-------This texture also stores the position and velocity-------//
 	
//----------This framebuffer stores the texture so we can use it as a output in the shader----//
	this.FBO1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticlePos1, 0);
	
	this.FBO2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticlePos2, 0);

	if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
		console.log(err + "FLOAT as the color attachment to an FBO");
	
	
	progParticleGpuShow = utils.addShaderProg(gl, 'particle-calc-show.vert', 'particle-calc-show.frag');
	progParticleGpuShow.points = 3;
	gl.bindAttribLocation(progParticleGpuShow, progParticleGpuShow.points, "inPoints");
	gl.linkProgram(progParticleGpuShow);
	gl.useProgram(progParticleGpuShow);
			
	this.gpuParticleVao = gl.createBuffer();
	gl.enableVertexAttribArray(progParticleGpuShow.points);
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
   	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   	gl.vertexAttribPointer(progParticleGpuShow.points, 2, gl.FLOAT, false, 0, 0);
	
	gl.uniform1i(gl.getUniformLocation(progParticleGpuShow, "samp1"), 1);
	
	progParticleGpuShow.modelView = gl.getUniformLocation(progParticleGpuShow, "modelViewMatrix");
	progParticleGpuShow.proj = gl.getUniformLocation(progParticleGpuShow, "projMatrix");
}

RenderParticle.prototype.render = function() {
	
	gl.useProgram(progParticle);
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
	//gl.depthMask(false);
	this.renderGpuParticle(world.gpuParticles[0].getAmount());
	//gl.depthMask(true);
};

RenderParticle.prototype.renderGpuParticle = function(amount) {
	gl.useProgram(progParticleGpu);
	gl.viewport(0, 0, amount, amount);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posTexBuffer);
	gl.vertexAttribPointer(progParticleGpu.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(progParticleGpu.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
		
	for(var i = 0; i < 1; i++) {
		
		gl.uniform1i(progParticleGpu.posLoc, 1);
		gl.uniform1i(progParticleGpu.velLoc, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO1);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
		
		gl.uniform1i(progParticleGpu.posLoc, 2);
		gl.uniform1i(progParticleGpu.velLoc, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO2);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
	}
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.useProgram(progParticleGpuShow);
  	var modelView = mat4.create();
  	mat4.lookAt(modelView, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
  	//mat4.translate(modelView, modelView, [gl.viewportWidth/2, gl.viewportHeight/2, 0.5]);
  	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
  	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [-(world.worldSize.x - (gl.viewportWidth)), 0.0, 0.5]);
	else
		mat4.translate(modelView, modelView, [-(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 0.5]);

	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);

  	gl.uniformMatrix4fv(progParticleGpuShow.proj, false, cam.getProj());
  	gl.uniformMatrix4fv(progParticleGpuShow.modelView, false, modelView);
  	
	//gl.enable(gl.BLEND);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
  	gl.drawArrays(gl.POINTS, 0, amount*amount);
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
		mat4.translate(modelView, modelView, [pos.x-(scale/2), 0.0, 0.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth))-(scale/2), 0.0, 0.5]);
	else
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2))-(scale/2), 0.0, 0.5]);


	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y-(scale/2), 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.worldSize.y - (gl.viewportHeight))-(scale/2), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, pos.y -(playerPos.y - ((gl.viewportHeight)/2))-(scale/2), 0.0]);
	
	mat4.rotate(modelView, modelView, rotation, [0,0,1]);

	mat4.scale(modelView, modelView, [scale/(fade+0.4), scale/(fade+0.4), 0.0]); //shrink the particles
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progParticle.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progParticle.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleSmoke);
    gl.uniform1i(progParticle.tex, 0);
    gl.uniform1f(progParticle.fade, fade);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progParticle.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progParticle.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progParticle.normal, 3, gl.FLOAT, false, 0, 0);
	
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
		
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y-(scale/2), 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.worldSize.y - (gl.viewportHeight))-(scale/2), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, pos.y -(playerPos.y - ((gl.viewportHeight)/2))-(scale/2), 0.0]);
	
	mat4.rotate(modelView, modelView, rotation, [0,0,1]);
	
	mat4.scale(modelView, modelView, [scale*fade, scale*fade, 0.0]); //shrink the particles

	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoParticleFire);

	gl.uniformMatrix4fv(progParticle.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progParticle.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleFire);
    gl.uniform1i(progParticle.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progParticle.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progParticle.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progParticle.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelParticleFire.getNumVertices());
};

//----------------------------------TILES------------------------------------//
RenderTile = function() {	//Render Square Class
	RenderTile.baseConstructor.call(this);
	this.modelTile = new ModelSquare();
	
	this.initBuffers(this.modelTile);
}

InheritenceManager.extend(RenderTile, RenderBase);

RenderTile.prototype.render = function() {

	var tilesBg = world.getTilesBg();
	gl.useProgram(progTileBg);	
	for(var i = 0; i < tilesBg.length; i++)
	{
		//console.log(world.getEmitter().getParticles()[i].getPosition());
		this.renderTileBg(tilesBg[i].getPosition(), tilesBg[i].getTile().getTex(), tilesBg[i].getTile().getSize());
	}
	
	var tilesMg = world.getTilesMg();
	gl.useProgram(progTileMg);
	for(var i = 0; i < tilesMg.length; i++)
	{
		//console.log(world.getEmitter().getParticles()[i].getPosition());
		this.renderTileMg(tilesMg[i].getPosition(), tilesMg[i].getTile().getTex(), tilesMg[i].getTile().getSize());
	}
	
	var tilesFg = world.getTilesFg();
	gl.useProgram(progTileFg);
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

	gl.uniformMatrix4fv(progTileBg.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTileBg.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTileBg.view, false, tmp);
	
	gl.uniform2f(progTileBg.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTileBg.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTileBg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTileBg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTileBg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileMg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, 1.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), 0.0, 1.0]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 1.0]);
	}
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else {
		mat4.translate(modelView, modelView, [0.0, pos.y -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	}
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progTileMg.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTileMg.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTileMg.view, false, tmp);
	gl.uniform2f(progTileMg.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTileMg.tex, 0);
	
	//console.log(tmpModelTile);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTileMg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTileMg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTileMg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderTile.prototype.renderTileFg = function(pos, tex, size) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, 2.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.fgSize.x - (gl.viewportWidth)), 0.0, 2.0]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, 2.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.fgSize.y - (gl.viewportHeight)), 0.0]);
	else {
		var trans = (((gl.viewportHeight)/2)*((world.fgSize.y - gl.viewportHeight)/(world.worldSize.y - gl.viewportHeight))) - 
					(playerPos.y*((world.fgSize.y - gl.viewportHeight)/(world.worldSize.y - gl.viewportHeight)));
		mat4.translate(modelView, modelView, [0.0, trans + pos.y, 0.0]);
		//mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), pos.y, -9.0]);
	}
	
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progTileFg.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTileFg.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTileFg.view, false, tmp);
	gl.uniform2f(progTileFg.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTileFg.tex, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTileFg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTileFg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTileFg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelTile.getNumVertices());
}

RenderWorld = function() {
	RenderWorld.baseConstructor.call(this);
	
	this.modelBg = new ModelSquare();
	this.initBuffers(this.modelBg);
	//this.vaoBg = generateModel(this.modelBg, progWorld);
	this.texBg = gl.createTexture();
	Texture.loadImage(gl, "resources/bg.png", this.texBg);

	this.modelMg = new ModelSquare();
	this.initBuffers(this.modelMg);
	//this.vaoMg = generateModel(this.modelMg, progWorld);
	this.texMg = gl.createTexture();
	Texture.loadImage(gl, "resources/mg.png", this.texMg);
}

InheritenceManager.extend(RenderWorld, RenderBase);

RenderWorld.prototype.render = function() {	
	gl.useProgram(progWorld);
	this.renderBg();
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
	//gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBg);

	gl.uniformMatrix4fv(progWorld.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progWorld.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texBg);
    gl.uniform1i(progWorld.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTileBg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTileBg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTileBg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
};

RenderBoundingBox = function() {	//Render Square Class
	RenderBoundingBox.baseConstructor.call(this);
}

InheritenceManager.extend(RenderBoundingBox, RenderBase);

RenderBoundingBox.prototype.render = function() {
	if(debug) {
		var tilesMg = world.getTilesMg();
		for(var i = 0; i < tilesMg.length; i++) {
			if(tilesMg[i].getBB() != null) {
				this.renderBB(tilesMg[i].getBB());
			}
		}
		
		this.renderBB(world.player.obb);
	}
	
};

RenderBoundingBox.prototype.renderBB = function(bb) {
	gl.useProgram(progLine);
	
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	this.model = [];

	var nrLines = 0;
	
	this.model = this.model.concat([bb.corner[0][0], bb.corner[0][1], 0]);
	this.model = this.model.concat([bb.corner[1][0], bb.corner[1][1], 0]);
	this.model = this.model.concat([bb.corner[1][0], bb.corner[1][1], 0]);
	this.model = this.model.concat([bb.corner[2][0], bb.corner[2][1], 0]);
	this.model = this.model.concat([bb.corner[2][0], bb.corner[2][1], 0]);
	this.model = this.model.concat([bb.corner[3][0], bb.corner[3][1], 0]);
	this.model = this.model.concat([bb.corner[3][0], bb.corner[3][1], 0]);
	this.model = this.model.concat([bb.corner[0][0], bb.corner[0][1], 0]);

	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model), gl.STATIC_DRAW);
	
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [0.0, 0, 1.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [0.0 -(world.worldSize.x - (gl.viewportWidth)), 0.0, 1.5]);
	else {
		mat4.translate(modelView, modelView, [0.0 -(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 1.5]);
	}
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else {
		mat4.translate(modelView, modelView, [0.0, -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	}
	
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progLine.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progLine.modelView, false, modelView);
	gl.uniform3fv(progLine.color, [1.0, 0.0, 0.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progLine.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.LINES, 0, 8);
}

RenderLight = function() {
	
//-----------------------MG LIGHTS------------------------------//
	this.staticLightsMg = world.staticLightsMg;
	this.flickeringLightsMg = world.flickeringLightsMg;
	this.morphingLightsMg = world.morphingLightsMg;
	
	this.lightPosMg = [];
	this.lightColorMg = [];
	this.lightIntensityMg = [];

//-----------------------BG LIGHTS------------------------------//
	this.staticLightsBg = world.staticLightsBg;
	this.flickeringLightsBg = world.flickeringLightsBg;
	this.morphingLightsBg = world.morphingLightsBg;
	
	this.lightPosBg = [];
	this.lightColorBg = [];
	this.lightIntensityBg = [];

//-----------------------FG LIGHTS------------------------------//	
	this.staticLightsFg = world.staticLightsFg;
	this.flickeringLightsFg = world.flickeringLightsFg;
	this.morphingLightsFg = world.morphingLightsFg;
	
	this.lightPosFg = [];
	this.lightColorFg = [];
	this.lightIntensityFg = [];

	this.initLights();
}

RenderLight.prototype.initLights = function() {
	
//----------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------MG LIGHTS--------------------------------------------------------//
	
//-------------------------STATIC LIGHTS-----------------------------//
	var totalNrStaticLights = this.staticLightsMg.length;	
	for(var i = 0; i < totalNrStaticLights; i++) {
		var position = [this.staticLightsMg[i].getPosition().x, this.staticLightsMg[i].getPosition().y, this.staticLightsMg[i].getPosition().z];
		var color = [this.staticLightsMg[i].getColor().r, this.staticLightsMg[i].getColor().g, this.staticLightsMg[i].getColor().b];
		this.lightPosMg = this.lightPosMg.concat(position);
		this.lightColorMg = this.lightColorMg.concat(color);
		this.lightIntensityMg = this.lightIntensityMg.concat(this.staticLightsMg[i].getIntensity());
	}
//-----------------------FLICKERING LIGHTS---------------------------//	
	var totalNrFlickeringLights = this.flickeringLightsMg.length;
	for(var i = 0; i < totalNrFlickeringLights; i++) {
		var position = [this.flickeringLightsMg[i].getPosition().x, this.flickeringLightsMg[i].getPosition().y, this.flickeringLightsMg[i].getPosition().z];
		var color = [this.flickeringLightsMg[i].getColor().r, this.flickeringLightsMg[i].getColor().g, this.flickeringLightsMg[i].getColor().b];
		this.lightPosMg = this.lightPosMg.concat(position);
		this.lightColorMg = this.lightColorMg.concat(color);
		this.lightIntensityMg = this.lightIntensityMg.concat(this.flickeringLightsMg[i].getIntensity());
	}
//------------------------MORPHING LIGHTS----------------------------//	
	var totalNrMorphingLights = this.morphingLightsMg.length;
	for(var i = 0; i < totalNrMorphingLights; i++) {
		var position = [this.morphingLightsMg[i].getPosition().x, this.morphingLightsMg[i].getPosition().y, this.morphingLightsMg[i].getPosition().z];
		var color = [this.morphingLightsMg[i].getColor().r, this.morphingLightsMg[i].getColor().g, this.morphingLightsMg[i].getColor().b];
		this.lightPosMg = this.lightPosMg.concat(position);
		this.lightColorMg = this.lightColorMg.concat(color);
		this.lightIntensityMg = this.lightIntensityMg.concat(this.morphingLightsMg[i].getIntensity());
	}
	
	gl.useProgram(progTileMg);
	gl.uniform3fv(progTileMg.lightPos, this.lightPosMg);
	gl.uniform3fv(progTileMg.lightColor, this.lightColorMg);
	gl.uniform1fv(progTileMg.lightIntensity, this.lightIntensityMg);

//----------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------BG LIGHTS--------------------------------------------------------//

//-------------------------STATIC LIGHTS-----------------------------//
	var totalNrStaticLights = this.staticLightsBg.length;	
	for(var i = 0; i < totalNrStaticLights; i++) {
		var position = [this.staticLightsBg[i].getPosition().x, this.staticLightsBg[i].getPosition().y, this.staticLightsBg[i].getPosition().z];
		var color = [this.staticLightsBg[i].getColor().r, this.staticLightsBg[i].getColor().g, this.staticLightsBg[i].getColor().b];
		this.lightPosBg = this.lightPosBg.concat(position);
		this.lightColorBg = this.lightColorBg.concat(color);
		this.lightIntensityBg = this.lightIntensityBg.concat(this.staticLightsBg[i].getIntensity());
	}
//-----------------------FLICKERING LIGHTS---------------------------//	
	var totalNrFlickeringLights = this.flickeringLightsBg.length;
	for(var i = 0; i < totalNrFlickeringLights; i++) {
		var position = [this.flickeringLightsBg[i].getPosition().x, this.flickeringLightsBg[i].getPosition().y, this.flickeringLightsBg[i].getPosition().z];
		var color = [this.flickeringLightsBg[i].getColor().r, this.flickeringLightsBg[i].getColor().g, this.flickeringLightsBg[i].getColor().b];
		this.lightPosBg = this.lightPosBg.concat(position);
		this.lightColorBg = this.lightColorBg.concat(color);
		this.lightIntensityBg = this.lightIntensityBg.concat(this.flickeringLightsBg[i].getIntensity());
	}
//------------------------MORPHING LIGHTS----------------------------//	
	var totalNrMorphingLights = this.morphingLightsBg.length;
	for(var i = 0; i < totalNrMorphingLights; i++) {
		var position = [this.morphingLightsBg[i].getPosition().x, this.morphingLightsBg[i].getPosition().y, this.morphingLightsBg[i].getPosition().z];
		var color = [this.morphingLightsBg[i].getColor().r, this.morphingLightsBg[i].getColor().g, this.morphingLightsBg[i].getColor().b];
		this.lightPosBg = this.lightPosBg.concat(position);
		this.lightColorBg = this.lightColorBg.concat(color);
		this.lightIntensityBg = this.lightIntensityBg.concat(this.morphingLightsBg[i].getIntensity());
	}
	
	gl.useProgram(progTileBg);
	gl.uniform3fv(progTileBg.lightPos, this.lightPosBg);
	gl.uniform3fv(progTileBg.lightColor, this.lightColorBg);
	gl.uniform1fv(progTileBg.lightIntensity, this.lightIntensityBg);
	
//----------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------FG LIGHTS--------------------------------------------------------//

//-------------------------STATIC LIGHTS-----------------------------//
	var totalNrStaticLights = this.staticLightsFg.length;	
	for(var i = 0; i < totalNrStaticLights; i++) {
		var position = [this.staticLightsFg[i].getPosition().x, this.staticLightsFg[i].getPosition().y, this.staticLightsFg[i].getPosition().z];
		var color = [this.staticLightsFg[i].getColor().r, this.staticLightsFg[i].getColor().g, this.staticLightsFg[i].getColor().b];
		this.lightPosFg = this.lightPosFg.concat(position);
		this.lightColorFg = this.lightColorFg.concat(color);
		this.lightIntensityFg = this.lightIntensityFg.concat(this.staticLightsFg[i].getIntensity());
	}
//-----------------------FLICKERING LIGHTS---------------------------//	
	var totalNrFlickeringLights = this.flickeringLightsFg.length;
	for(var i = 0; i < totalNrFlickeringLights; i++) {
		var position = [this.flickeringLightsFg[i].getPosition().x, this.flickeringLightsFg[i].getPosition().y, this.flickeringLightsFg[i].getPosition().z];
		var color = [this.flickeringLightsFg[i].getColor().r, this.flickeringLightsFg[i].getColor().g, this.flickeringLightsFg[i].getColor().b];
		this.lightPosFg = this.lightPosFg.concat(position);
		this.lightColorFg = this.lightColorFg.concat(color);
		this.lightIntensityFg = this.lightIntensityFg.concat(this.flickeringLightsFg[i].getIntensity());
	}
//------------------------MORPHING LIGHTS----------------------------//	
	var totalNrMorphingLights = this.morphingLightsFg.length;
	for(var i = 0; i < totalNrMorphingLights; i++) {
		var position = [this.morphingLightsFg[i].getPosition().x, this.morphingLightsFg[i].getPosition().y, this.morphingLightsFg[i].getPosition().z];
		var color = [this.morphingLightsFg[i].getColor().r, this.morphingLightsFg[i].getColor().g, this.morphingLightsFg[i].getColor().b];
		this.lightPosFg = this.lightPosFg.concat(position);
		this.lightColorFg = this.lightColorFg.concat(color);
		this.lightIntensityFg = this.lightIntensityFg.concat(this.morphingLightsFg[i].getIntensity());
	}
	
	gl.useProgram(progTileFg);
	gl.uniform3fv(progTileFg.lightPos, this.lightPosFg);
	gl.uniform3fv(progTileFg.lightColor, this.lightColorFg);
	gl.uniform1fv(progTileFg.lightIntensity, this.lightIntensityFg);
}

//--------------------LIGHT UPDATE---------------------//
RenderLight.prototype.update = function() {
	this.updateMg();
	this.updateBg();
	this.updateFg();
}
//------------------------------------MG LIGHTS UPDATE-----------------------------------------//
RenderLight.prototype.updateMg = function() {
	
	var totalNrStaticLights = this.staticLightsMg.length;	
	var totalNrFlickeringLights = this.flickeringLightsMg.length;
	var totalNrMorphingLights = this.morphingLightsMg.length;
	
	for(var i = 0; i < totalNrStaticLights; i++) {	// static //Every static light will be placed on the rope for now
		this.staticLightsMg[i].setPosition(world.rope.getPosition(10));
		var tmpPos = this.staticLightsMg[i].getPosition();
		this.lightPosMg[i*3] = tmpPos.x;
		this.lightPosMg[i*3+1] = tmpPos.y;
		this.lightPosMg[i*3+2] = tmpPos.z;
	}
	
	for(var i = totalNrStaticLights; i < (totalNrStaticLights + totalNrFlickeringLights); i++) {	// flickering
		this.lightIntensityMg[i] = this.flickeringLightsMg[i - totalNrStaticLights].getIntensity();
	}
	for(var i = (totalNrStaticLights + totalNrFlickeringLights); i < (totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights); i++) {	// morphing
		this.lightIntensityMg[i] = this.morphingLightsMg[i - (totalNrStaticLights + totalNrFlickeringLights)].getIntensity();
		var tmpColor = this.morphingLightsMg[i - (totalNrStaticLights + totalNrFlickeringLights)].getColor();
		this.lightColorMg[i*3] = tmpColor.r;
		this.lightColorMg[i*3+1] = tmpColor.g;
		this.lightColorMg[i*3+2] = tmpColor.b;
	}
	
	gl.useProgram(progTileMg);
	gl.uniform3fv(progTileMg.lightPos, this.lightPosMg);
	gl.uniform3fv(progTileMg.lightColor, this.lightColorMg);
	gl.uniform1fv(progTileMg.lightIntensity, this.lightIntensityMg);
}

//------------------------------------BG LIGHTS UPDATE-----------------------------------------//
RenderLight.prototype.updateBg = function() {
	
	var totalNrStaticLights = this.staticLightsBg.length;	
	var totalNrFlickeringLights = this.flickeringLightsBg.length;
	var totalNrMorphingLights = this.morphingLightsBg.length;
	
	for(var i = totalNrStaticLights; i < (totalNrStaticLights + totalNrFlickeringLights); i++) {	// flickering
		this.lightIntensityBg[i] = this.flickeringLightsBg[i - totalNrStaticLights].getIntensity();
	}
	for(var i = (totalNrStaticLights + totalNrFlickeringLights); i < (totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights); i++) {	// morphing
		this.lightIntensityBg[i] = this.morphingLightsBg[i - (totalNrStaticLights + totalNrFlickeringLights)].getIntensity();
		var tmpColor = this.morphingLightsBg[i - (totalNrStaticLights + totalNrFlickeringLights)].getColor();
		this.lightColorBg[i*3] = tmpColor.r;
		this.lightColorBg[i*3+1] = tmpColor.g;
		this.lightColorBg[i*3+2] = tmpColor.b;
	}
	
	gl.useProgram(progTileBg);
	gl.uniform3fv(progTileBg.lightColor, this.lightColorBg);
	gl.uniform1fv(progTileBg.lightIntensity, this.lightIntensityBg);
}

//------------------------------------FG LIGHTS UPDATE-----------------------------------------//
RenderLight.prototype.updateFg = function() {
	
	var totalNrStaticLights = this.staticLightsFg.length;	
	var totalNrFlickeringLights = this.flickeringLightsFg.length;
	var totalNrMorphingLights = this.morphingLightsFg.length;
	
	for(var i = totalNrStaticLights; i < (totalNrStaticLights + totalNrFlickeringLights); i++) {	// flickering
		this.lightIntensityFg[i] = this.flickeringLightsFg[i - totalNrStaticLights].getIntensity();
	}
	for(var i = (totalNrStaticLights + totalNrFlickeringLights); i < (totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights); i++) {	// morphing
		this.lightIntensityFg[i] = this.morphingLightsFg[i - (totalNrStaticLights + totalNrFlickeringLights)].getIntensity();
		var tmpColor = this.morphingLightsFg[i - (totalNrStaticLights + totalNrFlickeringLights)].getColor();
		this.lightColorFg[i*3] = tmpColor.r;
		this.lightColorFg[i*3+1] = tmpColor.g;
		this.lightColorFg[i*3+2] = tmpColor.b;
	}
	
	gl.useProgram(progTileFg);
	gl.uniform3fv(progTileFg.lightColor, this.lightColorFg);
	gl.uniform1fv(progTileFg.lightIntensity, this.lightIntensityFg);
}



