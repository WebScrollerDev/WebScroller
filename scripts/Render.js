var progEntity, progWorld, progTileMg, progTileBg, progTileFg, 
	progParticle, progParticleGpuPos, progParticleGpuVelDen, 
	progParticleGpuShow, progLine, progShadow, progRain;

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
		progShadow = utils.addShaderProg(gl, 'shadow.vert', 'shadow.frag');
		progParticleGpuPos = utils.addShaderProg(gl, 'particle-calc-pos.vert', 'particle-calc-pos.frag');
		progParticleGpuVelDen = utils.addShaderProg(gl, 'particle-calc-velDen.vert', 'particle-calc-velDen.frag');
		progRain = utils.addShaderProg(gl, 'rain.vert', 'rain.frag');
		
		this.initShaders();
		this.renderEntity = new RenderEntity();
		this.renderWorld = new RenderWorld();
		this.renderParticle = new RenderParticle();
		this.renderLight = new RenderLight();
		this.renderTile = new RenderTile();		
		this.renderBB = new RenderBoundingBox();
		this.renderQT = new RenderQuadTree();
		this.renderFabric = new RenderFabric();
		this.renderShadow = new RenderShadow();
		this.renderRain = new RenderRain();
		
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
		progLine.color = gl.getUniformLocation(progLine, "inColor");
		
//-----------------------------------SHADOW SHADER------------------------------------//
		gl.useProgram(progShadow);
		
		progShadow.position = gl.getAttribLocation(progShadow, "inPosition");
		gl.enableVertexAttribArray(progShadow.position);
		progShadow.proj = gl.getUniformLocation(progShadow, "projMatrix");
		progShadow.modelView = gl.getUniformLocation(progShadow, "modelViewMatrix");	
		progShadow.color = gl.getUniformLocation(progShadow, "inColor");
		
//-----------------------------------RAIN SHADER------------------------------------//
		gl.useProgram(progRain);
		
		progRain.position = gl.getAttribLocation(progRain, "inPosition");
		gl.enableVertexAttribArray(progRain.position);
		progRain.proj = gl.getUniformLocation(progRain, "projMatrix");
		progRain.modelView = gl.getUniformLocation(progRain, "modelViewMatrix");	
		progRain.color = gl.getUniformLocation(progRain, "inColor");
		
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
		
//-------------------------------POSITION PARTICLE SHADER-------------------------------//
		
		gl.useProgram(progParticleGpuPos);
		progParticleGpuPos.pos = gl.getAttribLocation(progParticleGpuPos, "inPos");
		gl.enableVertexAttribArray(progParticleGpuPos.pos);
		progParticleGpuPos.tex = gl.getAttribLocation(progParticleGpuPos, "inTex");
		gl.enableVertexAttribArray(progParticleGpuPos.tex);
		progParticleGpuPos.posLoc = gl.getUniformLocation(progParticleGpuPos, "posSamp");
		progParticleGpuPos.velDenLoc = gl.getUniformLocation(progParticleGpuPos, "velDenSamp");
		
//-------------------------------VELOCITY/DENSITY PARTICLE SHADER-------------------------------//
		
		gl.useProgram(progParticleGpuVelDen);		
		progParticleGpuVelDen.pos = gl.getAttribLocation(progParticleGpuVelDen, "inPos");
		gl.enableVertexAttribArray(progParticleGpuVelDen.pos);
		progParticleGpuVelDen.tex = gl.getAttribLocation(progParticleGpuVelDen, "inTex");
		gl.enableVertexAttribArray(progParticleGpuVelDen.tex);
		progParticleGpuVelDen.posLoc = gl.getUniformLocation(progParticleGpuVelDen, "posSamp");
		progParticleGpuVelDen.velDenLoc = gl.getUniformLocation(progParticleGpuVelDen, "velDenSamp");
		progParticleGpuVelDen.borderLoc = gl.getUniformLocation(progParticleGpuVelDen, "borderSamp");
		progParticleGpuVelDen.borderPosLoc = gl.getUniformLocation(progParticleGpuVelDen, "borderPos");
		progParticleGpuVelDen.posPlayer = gl.getUniformLocation(progParticleGpuVelDen, "inPosPlayer");
		progParticleGpuVelDen.velPlayer = gl.getUniformLocation(progParticleGpuVelDen, "inVelPlayer");
		
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
		this.renderQT.render();
		this.renderParticle.render();
		this.renderFabric.render();
		this.renderShadow.render();
		this.renderRain.render();
	}
}

RenderBase = function() { //the base type of renderer
	
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
	this.modelPlayer.anim(world.player.totalNrFramesPerAnimation, world.player.currFrame, world.player.totalNrAnimations, world.player.status, world.player.flipped);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelPlayer.texBuffer);
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
    
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelPlayer.posBuffer);
	gl.vertexAttribPointer(progEntity.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelPlayer.texBuffer);
	gl.vertexAttribPointer(progEntity.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelPlayer.normalBuffer);
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

//----------------------------------SHADOW------------------------------------//
RenderShadow = function() {
	RenderShadow.baseConstructor.call(this);
};

InheritenceManager.extend(RenderShadow, RenderBase);

RenderShadow.prototype.render = function() {
	
	gl.useProgram(progShadow);
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	var model = world.getShadowHandler().getShadowsArray();
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

	gl.uniformMatrix4fv(progShadow.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progShadow.modelView, false, modelView);
	gl.uniform3f(progShadow.color, 0.0, 0.0, 0.0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progShadow.position, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, model.length/2);
};

//----------------------------------RAIN------------------------------------//
RenderRain = function() {
	RenderRain.baseConstructor.call(this);
	this.modelRain = new ModelSquare();
	this.initBuffers(this.modelRain);
};

InheritenceManager.extend(RenderRain, RenderBase);

RenderRain.prototype.render = function() {
	
	gl.useProgram(progRain);
	gl.depthMask(false); //see other particles through the particles
	var rainEmitters = world.getRainEmitters();
	for(var i = 0; i < rainEmitters.length; i++)
	{
		var currEmitterRaindrops = rainEmitters[i].getParticlesAsArray();
		this.renderRainDrop(currEmitterRaindrops);

	}
	gl.depthMask(true); //see other particles through the particles
};

RenderRain.prototype.renderRainDrop = function(array) {

	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}

	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
	
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

	gl.uniformMatrix4fv(progRain.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progRain.modelView, false, modelView);
	gl.uniform3f(progRain.color, 0.2, 0.2, 1.0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progRain.position, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.POINTS, 0, array.length/2);
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

	this.initGpuParticle(world.gpuParticles[0].getAmount(), world.gpuParticles[0].getPos(), world.gpuParticles[0].getVelDen(), world.gpuParticles[0].getVertices());
	
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.checkIfDoneInterval = setInterval(function(){_this.borderDataDone(world.gpuParticles[0])}, 50);
};

InheritenceManager.extend(RenderParticle, RenderBase);

RenderParticle.prototype.initGpuParticle = function(particleAmount, pos, velDen, vertices) { 
	var particleAmount2 = particleAmount*particleAmount;
	
	this.posTexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posTexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,0,0, -1,1,0,1, 1,-1,1,0, 1,1,1,1]), gl.STATIC_DRAW);
	
//-------This texture stores the position-------//
	this.texParticlePos1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//-------This texture also stores the position-------//
  	this.texParticlePos2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	
 	this.texParticleVelDen1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleVelDen1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(velDen));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	
 	
 	this.texParticleVelDen2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleVelDen2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, particleAmount, particleAmount, 0, gl.RGB, gl.FLOAT, new Float32Array(velDen));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 		
//----------This framebuffer stores the texture so we can use it as a output in the shader----//
	this.FBOPos1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOPos1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticlePos1, 0);
	
	this.FBOPos2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOPos2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticlePos2, 0);
	
	this.FBOVelDen1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOVelDen1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticleVelDen1, 0);
	
	this.FBOVelDen2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOVelDen2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParticleVelDen2, 0);

	if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
		console.log(err + "FLOAT as the color attachment to an FBO");
	
	
	progParticleGpuShow = utils.addShaderProg(gl, 'particle-show.vert', 'particle-show.frag');
	progParticleGpuShow.points = 3;
	gl.bindAttribLocation(progParticleGpuShow, progParticleGpuShow.points, "inPoints");
	gl.linkProgram(progParticleGpuShow);
	gl.useProgram(progParticleGpuShow);
			
	this.gpuParticleVao = gl.createBuffer();
	gl.enableVertexAttribArray(progParticleGpuShow.points);
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
   	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   	gl.vertexAttribPointer(progParticleGpuShow.points, 2, gl.FLOAT, false, 0, 0);
	
	gl.uniform1i(gl.getUniformLocation(progParticleGpuShow, "posSamp"), 1);
	gl.uniform1i(gl.getUniformLocation(progParticleGpuShow, "velDenSamp"), 3);
	
	progParticleGpuShow.modelView = gl.getUniformLocation(progParticleGpuShow, "modelViewMatrix");
	progParticleGpuShow.proj = gl.getUniformLocation(progParticleGpuShow, "projMatrix");
};

RenderParticle.prototype.borderDataDone = function(gpuParticle) {
	if(gpuParticle.getBorderLoadStatus()) {
		clearInterval(this.checkIfDoneInterval);
		this.initGpuParticleBorder(gpuParticle);
	}
};

RenderParticle.prototype.initGpuParticleBorder = function(gpuParticle) {
	gl.useProgram(progParticleGpuVelDen);
	gl.uniform2fv(progParticleGpuVelDen.borderPosLoc, gpuParticle.getBorderPos());
	
	
	this.texParticleBorder = gl.createTexture();
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleBorder);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gpuParticle.getBorderSize().x, gpuParticle.getBorderSize().y, 0, gl.RGBA, gl.FLOAT, new Float32Array(gpuParticle.getBorder().data));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
};

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
//-------------------------------GPU FLUID---------------------------------//
	gl.depthMask(false); //see other particles through the particles
	this.renderGpuParticle(world.gpuParticles[0].getAmount());
	gl.depthMask(true);
};

RenderParticle.prototype.renderGpuParticle = function(amount) {
	
	gl.viewport(0, 0, amount, amount);
	
	gl.useProgram(progParticleGpuPos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posTexBuffer);
	gl.vertexAttribPointer(progParticleGpuPos.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(progParticleGpuPos.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
	
  	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
  	var playerVel = {
  		x: world.player.getVelocity()[0],
  		y: world.player.getVelocity()[1]
  	}
	var playerSize = world.player.getSize();
	gl.useProgram(progParticleGpuVelDen);
	
	gl.uniform2f(progParticleGpuVelDen.posPlayer, playerPos.x + playerSize.x/2, playerPos.y + playerSize.y/2);
	gl.uniform2f(progParticleGpuVelDen.velPlayer, playerVel.x, playerVel.y);
	gl.vertexAttribPointer(progParticleGpuVelDen.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	gl.vertexAttribPointer(progParticleGpuVelDen.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
		
	for(var i = 0; i < 1; i++) {
		gl.useProgram(progParticleGpuVelDen);
		gl.uniform1i(progParticleGpuVelDen.velDenLoc, 3);
		gl.uniform1i(progParticleGpuVelDen.posLoc, 1);
		gl.uniform1i(progParticleGpuVelDen.borderLoc, 5);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOVelDen1);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
		
		gl.useProgram(progParticleGpuPos);
		gl.uniform1i(progParticleGpuPos.posLoc, 1);
		gl.uniform1i(progParticleGpuPos.velDenLoc, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOPos1);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
		
		
		gl.useProgram(progParticleGpuVelDen);
		gl.uniform1i(progParticleGpuVelDen.velDenLoc, 4);
		gl.uniform1i(progParticleGpuVelDen.posLoc, 1);
		gl.uniform1i(progParticleGpuVelDen.borderLoc, 5);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOVelDen2);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
		
		gl.useProgram(progParticleGpuPos);
		gl.uniform1i(progParticleGpuPos.posLoc, 2);
		gl.uniform1i(progParticleGpuPos.velDenLoc, 3);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBOPos2);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
	}
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.useProgram(progParticleGpuShow);
  	var modelView = mat4.create();
  	mat4.lookAt(modelView, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
  	//mat4.translate(modelView, modelView, [gl.viewportWidth/2, gl.viewportHeight/2, 0.5]);

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

	mat4.scale(modelView, modelView, [scale/(fade+0.2), scale/(fade+0.2), 0.0]); //shrink the particles
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progParticle.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progParticle.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleSmoke);
    gl.uniform1i(progParticle.tex, 0);
    gl.uniform1f(progParticle.fade, fade);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleSmoke.posBuffer);
	gl.vertexAttribPointer(progParticle.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleSmoke.texBuffer);
	gl.vertexAttribPointer(progParticle.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleSmoke.normalBuffer);
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

	gl.uniformMatrix4fv(progParticle.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progParticle.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleFire);
    gl.uniform1i(progParticle.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleFire.posBuffer);
	gl.vertexAttribPointer(progParticle.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleFire.texBuffer);
	gl.vertexAttribPointer(progParticle.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelParticleFire.normalBuffer);
	gl.vertexAttribPointer(progParticle.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelParticleFire.getNumVertices());
};

//----------------------------------TILES------------------------------------//
RenderTile = function() {	//Render Square Class
	RenderTile.baseConstructor.call(this);
	
	this.modelTile = new ModelSquare();
	this.initBuffers(this.modelTile);
	
	this.modelTileAnim = new ModelSquare();
	this.initBuffers(this.modelTileAnim);
}

InheritenceManager.extend(RenderTile, RenderBase);

RenderTile.prototype.render = function() {
//----------------------------------------------STATIC BG------------------------------------------//
	var tilesBg = world.getTilesBg();
	gl.useProgram(progTileBg);	
	for(var i = 0; i < tilesBg.length; i++)
	{
		this.renderTileBg(tilesBg[i].getPosition(), tilesBg[i].getTile().getTex(), tilesBg[i].getTile().getSize(), this.modelTile);
	}
//---------------------------------------------ANIMATED BG-----------------------------------------//
	var tilesAnimBg = world.getTilesAnimatedBg();
	gl.useProgram(progTileBg);	
	for(var i = 0; i < tilesAnimBg.length; i++)
	{
		this.renderTileAnimatedBg(tilesAnimBg[i].getPosition(), tilesAnimBg[i].getTile().getTex(), tilesAnimBg[i].getTile().getSize(), tilesAnimBg[i].getCurrAnim(), tilesAnimBg[i].getMaxAnim(), this.modelTileAnim);
	}
//----------------------------------------------STATIC MG------------------------------------------//	
	var tilesMg = world.getTilesMg();
	gl.useProgram(progTileMg);
	for(var i = 0; i < tilesMg.length; i++)
	{
		this.renderTileMg(tilesMg[i].getPosition(), tilesMg[i].getTile().getTex(), tilesMg[i].getTile().getSize(), tilesMg[i].getAngle(), this.modelTile);	
	}
//---------------------------------------------ANIMATED MG-----------------------------------------//
	var tilesAnimMg = world.getTilesAnimatedMg();
	gl.useProgram(progTileMg);
	for(var i = 0; i < tilesAnimMg.length; i++)
	{
		this.renderTileAnimatedMg(tilesAnimMg[i].getPosition(), tilesAnimMg[i].getTile().getTex(), tilesAnimMg[i].getTile().getSize(), tilesAnimMg[i].getCurrAnim(), tilesAnimMg[i].getMaxAnim(), this.modelTileAnim);	
	}
//----------------------------------------------STATIC FG------------------------------------------//
	var tilesFg = world.getTilesFg();
	gl.useProgram(progTileFg);
	for(var i = 0; i < tilesFg.length; i++)
	{
		this.renderTileFg(tilesFg[i].getPosition(), tilesFg[i].getTile().getTex(), tilesFg[i].getTile().getSize(), this.modelTile);
	}
//---------------------------------------------ANIMATED FG-----------------------------------------//
	var tilesAnimFg = world.getTilesAnimatedFg();
	gl.useProgram(progTileFg);
	for(var i = 0; i < tilesAnimFg.length; i++)
	{
		this.renderTileAnimatedFg(tilesAnimFg[i].getPosition(), tilesAnimFg[i].getTile().getTex(), tilesAnimFg[i].getTile().getSize(), tilesAnimFg[i].getCurrAnim(), tilesAnimFg[i].getMaxAnim(), this.modelTileAnim);
	}
};
//-----------------------------------------------RENDER STATIC BG---------------------------------------------//
RenderTile.prototype.renderTileBg = function(pos, tex, size, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.bgSize.x - (gl.viewportWidth)), pos.y, pos.z]);
	else {
		/*var trans = (((gl.viewportWidth)/2)*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));*/
		var trans = (((gl.viewportWidth)/2)*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - ((playerPos.x)*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, pos.y, pos.z]);
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
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileBg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileBg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileBg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
}
//----------------------------------------------RENDER ANIMNATED BG-------------------------------------------//
RenderTile.prototype.renderTileAnimatedBg = function(pos, tex, size, currAnim, maxAnim, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	model.anim(maxAnim[0], currAnim[0], maxAnim[1], currAnim[1], false);
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, pos.y, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.bgSize.x - (gl.viewportWidth)), pos.y, pos.z]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.bgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, pos.y, pos.z]);
	}
	
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progTileBg.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTileBg.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTileBg.view, false, tmp);
	
	gl.uniform2f(progTileBg.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTileBg.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileBg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileBg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileBg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
}
//-----------------------------------------------RENDER STATIC MG---------------------------------------------//
RenderTile.prototype.renderTileMg = function(pos, tex, size, rot, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), 0.0, pos.z]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), 0.0, pos.z]);
	}
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else {
		mat4.translate(modelView, modelView, [0.0, pos.y -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	}
	mat4.translate(modelView, modelView, [size.x/2, size.y/2, 0.0]);
	mat4.rotateZ(modelView, modelView, rot);
	mat4.translate(modelView, modelView, [-size.x/2, -size.y/2, 0.0]);
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
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileMg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileMg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileMg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
}
//----------------------------------------------RENDER ANIMNATED MG-------------------------------------------//
RenderTile.prototype.renderTileAnimatedMg = function(pos, tex, size, currAnim, maxAnim, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	model.anim(maxAnim[0], currAnim[0], maxAnim[1], currAnim[1], false);
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), 0.0, pos.z]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), 0.0, pos.z]);
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
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileMg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileMg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileMg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
}

//-----------------------------------------------RENDER STATIC FG---------------------------------------------//
RenderTile.prototype.renderTileFg = function(pos, tex, size, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.fgSize.x - (gl.viewportWidth)), 0.0, pos.z]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, pos.z]);
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
    
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileFg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileFg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileFg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
}
//----------------------------------------------RENDER ANIMNATED FG-------------------------------------------//

RenderTile.prototype.renderTileAnimatedFg = function(pos, tex, size, currAnim, maxAnim, model) {
	var modelView = mat4.create();
	
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	
	model.anim(maxAnim[0], currAnim[0], maxAnim[1], currAnim[1], false);
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.getTexCoordArray()), gl.STATIC_DRAW);
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [pos.x, 0.0, pos.z]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.fgSize.x - (gl.viewportWidth)), 0.0, pos.z]);
	else {
		var trans = (((gl.viewportWidth)/2)*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth))) - 
					(playerPos.x*((world.fgSize.x - gl.viewportWidth)/(world.worldSize.x - gl.viewportWidth)));
		mat4.translate(modelView, modelView, [trans + pos.x, 0.0, pos.z]);
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
    
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuffer);
	gl.vertexAttribPointer(progTileFg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
	gl.vertexAttribPointer(progTileFg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.vertexAttribPointer(progTileFg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.getNumVertices());
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
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelBg.posBuffer);
	gl.vertexAttribPointer(progTileBg.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelBg.texBuffer);
	gl.vertexAttribPointer(progTileBg.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.modelBg.normalBuffer);
	gl.vertexAttribPointer(progTileBg.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
};
//--------------------------------------------BB---------------------------------------//
RenderBoundingBox = function() {
	RenderBoundingBox.baseConstructor.call(this);
	this.modelBB = [];
	this.modelTB = [];
	//---------------------------------STATIC BBs REGULAR------------------------//
	var tilesMg = world.getTilesMg();
	for(var i = 0; i < tilesMg.length; i++) {
		if(tilesMg[i].getBBs() != null) {
			for(var j = 0; j < tilesMg[i].getBBs().length; j++) {
				var bb = tilesMg[i].getBBs()[j];
				if(!tilesMg[i].isMoving()) {
					this.modelBB = this.modelBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);	
				}
			}
		}
	}
	//---------------------------------STATIC BBs & TBs ANIMATED-----------------//
	var animTiles = world.getTilesAnimatedMg();
	for(var i = 0; i < animTiles.length; i++) {
		if(animTiles[i].getBBs() != null) {
			for(var j = 0; j < animTiles[i].getBBs().length; j++) {
				var bb = animTiles[i].getBBs()[j];
				if(!animTiles[i].isMoving()) {
					this.modelBB = this.modelBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
					this.modelBB = this.modelBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
				}
			}
		}
		if(animTiles[i].getTriggerBox() != null) {
			for(var j = 0; j < animTiles[i].getTriggerBox().length; j++) {
				var tb = animTiles[i].getTriggerBox()[j];
				if(!animTiles[i].isMoving()) {
					this.modelTB = this.modelTB.concat([tb.corner[0][0], tb.corner[0][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[1][0], tb.corner[1][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[1][0], tb.corner[1][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[2][0], tb.corner[2][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[2][0], tb.corner[2][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[3][0], tb.corner[3][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[3][0], tb.corner[3][1], 0]);
					this.modelTB = this.modelTB.concat([tb.corner[0][0], tb.corner[0][1], 0]);
				}
			}
		}
	}
	
}

InheritenceManager.extend(RenderBoundingBox, RenderBase);

RenderBoundingBox.prototype.render = function() {
	if(debug) {
		this.modelMovingBB = [];
		this.modelMovingTB = [];
		var tilesMg = world.getTilesMg();
		for(var i = 0; i < tilesMg.length; i++) {	// static tiles BB
			if(tilesMg[i].getBBs() != null) {
				for(var j = 0; j < tilesMg[i].getBBs().length; j++) {
					var bb = tilesMg[i].getBBs()[j];
					if(tilesMg[i].isMoving()) {
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);	
					}
				}
			}
		}
		
		var animTiles = world.getTilesAnimatedMg();
		for(var i = 0; i < animTiles.length; i++) {	// anim tiles BB & TB
			if(animTiles[i].getBBs() != null) {
				for(var j = 0; j < animTiles[i].getBBs().length; j++) {
					var bb = animTiles[i].getBBs()[j];
					if(tilesMg[i].isMoving()) {
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[1][0], bb.corner[1][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[2][0], bb.corner[2][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[3][0], bb.corner[3][1], 0]);
						this.modelMovingBB = this.modelMovingBB.concat([bb.corner[0][0], bb.corner[0][1], 0]);
					}
				}
			}
			if(animTiles[i].getTriggerBox() != null) {
				for(var j = 0; j < animTiles[i].getTriggerBox().length; j++) {
					var tb = animTiles[i].getTriggerBox()[j];
					if(animTiles[i].isMoving()) {
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[0][0], tb.corner[0][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[1][0], tb.corner[1][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[1][0], tb.corner[1][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[2][0], tb.corner[2][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[2][0], tb.corner[2][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[3][0], tb.corner[3][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[3][0], tb.corner[3][1], 0]);
						this.modelMovingTB = this.modelMovingTB.concat([tb.corner[0][0], tb.corner[0][1], 0]);
					}
				}
			}
		}
			
		
			
		this.modelPlayer = [];
		var bb = world.player.obb;
		this.modelPlayer = this.modelPlayer.concat([bb.corner[0][0], bb.corner[0][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[1][0], bb.corner[1][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[1][0], bb.corner[1][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[2][0], bb.corner[2][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[2][0], bb.corner[2][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[3][0], bb.corner[3][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[3][0], bb.corner[3][1], 0]);
		this.modelPlayer = this.modelPlayer.concat([bb.corner[0][0], bb.corner[0][1], 0]);	

		this.renderBB(this.modelTB, [0.0, 1.0, 0.0]);
		this.renderBB(this.modelBB, [1.0, 0.0, 0.0]);
		this.renderBB(this.modelMovingBB, [1.0, 0.0, 0.0]);
		this.renderBB(this.modelMovingTB, [0.0, 1.0, 0.0]);
		this.renderBB(this.modelPlayer, [1.0, 0.0, 0.0]);
	}
	
};

RenderBoundingBox.prototype.renderBB = function(model, color) {
	gl.useProgram(progLine);
	
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}

	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model), gl.STATIC_DRAW);
	
	
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
	gl.uniform3fv(progLine.color, color);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progLine.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.LINES, 0, model.length/3);
}

//--------------------------------------------QT---------------------------------------//
RenderQuadTree = function() {
	RenderQuadTree.baseConstructor.call(this);
	this.model = world.rootQuadTree.getSegs();
}

InheritenceManager.extend(RenderQuadTree, RenderBase);

RenderQuadTree.prototype.render = function() {
	if(debug) {
			this.renderQT();	
	}	
};

RenderQuadTree.prototype.renderQT= function() {
	gl.useProgram(progLine);
	
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	

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
	gl.uniform3fv(progLine.color, [0.0, 0.0, 1.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(progLine.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.LINES, 0, this.model.length/3);
}


//-------------------------------------------RENDER LIGHT---------------------------------------//
RenderLight = function() {
	
//-----------------------MG LIGHTS------------------------------//
	this.staticLightsMg = new Array();
	this.flickeringLightsMg = new Array();
	this.morphingLightsMg = new Array();
	for(var i = 0; i < world.tilesMg.length; i++) {
		for(var j = 0; j < world.tilesMg[i].getStaticLights().length; j++)
			this.staticLightsMg.push(world.tilesMg[i].getStaticLights()[j]);
		for(var j = 0; j < world.tilesMg[i].getFlickeringLights().length; j++)
			this.flickeringLightsMg.push(world.tilesMg[i].getFlickeringLights()[j]);
		for(var j = 0; j < world.tilesMg[i].getMorphingLights().length; j++)
			this.morphingLightsMg.push(world.tilesMg[i].getMorphingLights()[j]);
	}
	this.lightPosMg = [];
	this.lightColorMg = [];
	this.lightIntensityMg = [];

//-----------------------BG LIGHTS------------------------------//
	this.staticLightsBg = new Array();
	this.flickeringLightsBg = new Array();
	this.morphingLightsBg = new Array();
	for(var i = 0; i < world.tilesBg.length; i++) {
		for(var j = 0; j < world.tilesBg[i].getStaticLights().length; j++)
			this.staticLightsBg.push(world.tilesBg[i].getStaticLights()[j]);
		for(var j = 0; j < world.tilesBg[i].getFlickeringLights().length; j++)
			this.flickeringLightsBg.push(world.tilesBg[i].getFlickeringLights()[j]);
		for(var j = 0; j < world.tilesBg[i].getMorphingLights().length; j++)
			this.morphingLightsBg.push(world.tilesBg[i].getMorphingLights()[j]);
	}
	
	this.lightPosBg = [];
	this.lightColorBg = [];
	this.lightIntensityBg = [];

//-----------------------FG LIGHTS------------------------------//	
	this.staticLightsFg = new Array();
	this.flickeringLightsFg = new Array();
	this.morphingLightsFg = new Array();
	for(var i = 0; i < world.tilesFg.length; i++) {
		for(var j = 0; j < world.tilesFg[i].getStaticLights().length; j++)
			this.staticLightsFg.push(world.tilesFg[i].getStaticLights()[j]);
		for(var j = 0; j < world.tilesFg[i].getFlickeringLights().length; j++)
			this.flickeringLightsFg.push(world.tilesFg[i].getFlickeringLights()[j]);
		for(var j = 0; j < world.tilesFg[i].getMorphingLights().length; j++)
			this.morphingLightsFg.push(world.tilesFg[i].getMorphingLights()[j]);
	}
	
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
	this.totalMgLights = totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights;
	if(this.totalMgLights > 0) {
		gl.useProgram(progTileMg);
		gl.uniform3fv(progTileMg.lightPos, this.lightPosMg);
		gl.uniform3fv(progTileMg.lightColor, this.lightColorMg);
		gl.uniform1fv(progTileMg.lightIntensity, this.lightIntensityMg);
	}

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
	this.totalBgLights = totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights;
	if(this.totalBgLights > 0) {
		gl.useProgram(progTileBg);
		gl.uniform3fv(progTileBg.lightPos, this.lightPosBg);
		gl.uniform3fv(progTileBg.lightColor, this.lightColorBg);
		gl.uniform1fv(progTileBg.lightIntensity, this.lightIntensityBg);
	}
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
	this.totalFgLights = totalNrStaticLights + totalNrFlickeringLights + totalNrMorphingLights;
	if(this.totalFgLights > 0) {
		gl.useProgram(progTileFg);
		gl.uniform3fv(progTileFg.lightPos, this.lightPosFg);
		gl.uniform3fv(progTileFg.lightColor, this.lightColorFg);
		gl.uniform1fv(progTileFg.lightIntensity, this.lightIntensityFg);
	}
}

//--------------------LIGHT UPDATE---------------------//
RenderLight.prototype.update = function() {
	//console.log(this.totalMgLights + " " + this.totalBgLights + " " + this.totalFgLights);
	if(this.totalMgLights > 0)
		this.updateMg();
	if(this.totalBgLights > 0)
		this.updateBg();
	if(this.totalFgLights > 0)
		this.updateFg();
}
//------------------------------------MG LIGHTS UPDATE-----------------------------------------//
RenderLight.prototype.updateMg = function() {
	
	var totalNrStaticLights = this.staticLightsMg.length;	
	var totalNrFlickeringLights = this.flickeringLightsMg.length;
	var totalNrMorphingLights = this.morphingLightsMg.length;
	
	for(var i = 0; i < totalNrStaticLights; i++) {	// static //Every static light will be placed on the rope for now
		//this.staticLightsMg[i].setPosition(world.rope.getPosition(10));
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
	
	for(var i = 0; i < totalNrStaticLights; i++) {	// static //Every static light will be placed on the rope for now
		//this.staticLightsMg[i].setPosition(world.rope.getPosition(10));
		var tmpPos = this.staticLightsBg[i].getPosition();
		this.lightPosBg[i*3] = tmpPos.x;
		this.lightPosBg[i*3+1] = tmpPos.y;
		this.lightPosBg[i*3+2] = tmpPos.z;
	}
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
	gl.uniform3fv(progTileBg.lightPos, this.lightPosBg);
	gl.uniform3fv(progTileBg.lightColor, this.lightColorBg);
	gl.uniform1fv(progTileBg.lightIntensity, this.lightIntensityBg);
}

//------------------------------------FG LIGHTS UPDATE-----------------------------------------//
RenderLight.prototype.updateFg = function() {
	
	var totalNrStaticLights = this.staticLightsFg.length;	
	var totalNrFlickeringLights = this.flickeringLightsFg.length;
	var totalNrMorphingLights = this.morphingLightsFg.length;
	for(var i = 0; i < totalNrStaticLights; i++) {	// static //Every static light will be placed on the rope for now
		//this.staticLightsMg[i].setPosition(world.rope.getPosition(10));
		var tmpPos = this.staticLightsFg[i].getPosition();
		this.lightPosFg[i*3] = tmpPos.x;
		this.lightPosFg[i*3+1] = tmpPos.y;
		this.lightPosFg[i*3+2] = tmpPos.z;
	}
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
	gl.uniform3fv(progTileFg.lightPos, this.lightPosFg);
	gl.uniform3fv(progTileFg.lightColor, this.lightColorFg);
	gl.uniform1fv(progTileFg.lightIntensity, this.lightIntensityFg);
}



