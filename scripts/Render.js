var progEntity, progWorld, progTile, progParticle, progParticleGpu, progParticleGpuShow, progBB, progCloth;

var nrOfParticles = 64;
function RenderManager() {
	
}

RenderManager.prototype = {
	
	init: function() {
		progEntity = utils.addShaderProg(gl, 'player.vert', 'player.frag');
		progWorld = utils.addShaderProg(gl, 'main.vert', 'main.frag');
		progParticle = utils.addShaderProg(gl, 'particle.vert', 'particle.frag');
		progTile = utils.addShaderProg(gl, 'tile.vert', 'tile.frag');
		progBB = utils.addShaderProg(gl, 'bb.vert', 'bb.frag');
		progCloth = utils.addShaderProg(gl, 'cloth.vert', 'cloth.frag');
		
		this.initShaders();
		this.renderEntity = new RenderEntity();
		this.renderWorld = new RenderWorld();
		this.renderParticle = new RenderParticle();
		this.renderLight = new RenderLight();
		this.renderTile = new RenderTile();		
		this.renderBB = new RenderBoundingBox();
		this.renderCloth = new RenderCloth();
		
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	},
	
	initShaders: function() {
		
//---------------------------------TILE SHADER-----------------------------------//	
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
		progTile.view = gl.getUniformLocation(progTile, "viewMatrix");
		progTile.lightPos = gl.getUniformLocation(progTile, "lightPos");
		progTile.lightColor = gl.getUniformLocation(progTile, "lightColor");
		progTile.trans = gl.getUniformLocation(progTile, "trans");
		//progTile.lightNr = gl.getUniformLocation(progTile, "lightNr");
		
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

//---------------------------------BOUNDING BOX SHADER-----------------------------------//	
		gl.useProgram(progBB);
		
		progBB.position = gl.getAttribLocation(progBB, "inPosition");
		gl.enableVertexAttribArray(progBB.position);
		
		progBB.tex = gl.getUniformLocation(progBB, "inTexSample");
		progBB.proj = gl.getUniformLocation(progBB, "projMatrix");
		progBB.modelView = gl.getUniformLocation(progBB, "modelViewMatrix");
		
//---------------------------------CLOTH SHADER-----------------------------------//
		gl.useProgram(progCloth);
		
		progCloth.position = gl.getAttribLocation(progCloth, "inPosition");
		gl.enableVertexAttribArray(progCloth.position);
		progCloth.proj = gl.getUniformLocation(progCloth, "projMatrix");
		progCloth.modelView = gl.getUniformLocation(progCloth, "modelViewMatrix");		

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
		this.renderCloth.render();
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
	Texture.loadImage(gl, "resources/player.png", this.texPlayer);
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
	
	//mat4.rotateZ(modelView, modelView, 3.14/2);
	if(playerVel.x < 0)
		this.modelPlayer.flipTexCoordsX(true);     // Set to true if you want to flip, at the moment every model will be flipped :S
	else if(playerVel.x > 0)
		this.modelPlayer.flipTexCoordsX(false);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelPlayer.getTexCoordArray()), gl.STATIC_DRAW);
	
	
	if(playerPos.x < (gl.viewportWidth)/2)
		mat4.translate(modelView, modelView, [playerPos.x, 0.0, 1.0]);
	else if(playerPos.x > (world.worldSize.x - ((gl.viewportWidth)/2)))
		mat4.translate(modelView, modelView, [playerPos.x - (world.worldSize.x - ((gl.viewportWidth))), 0.0, 1.0]);
	else
		mat4.translate(modelView, modelView, [(gl.viewportWidth)/2, 0.0, 1.0]);
		
	if(playerPos.y < gl.viewportHeight/2)
		mat4.translate(modelView, modelView, [0.0, playerPos.y, 0.0]);
	else if(playerPos.y > (world.worldSize.y - ((gl.viewportHeight)/2)))
		mat4.translate(modelView, modelView, [0.0, playerPos.y - (world.worldSize.y - ((gl.viewportHeight))), 0.0]);
	else
		mat4.translate(modelView, modelView, [0.0, gl.viewportHeight/2, 0.0]);
		
	
	mat4.scale(modelView, modelView, [world.player.size.x, world.player.size.y, 1.0]);
	//Used to center the player on the canvas
	mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
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
RenderCloth = function() {
	RenderCloth.baseConstructor.call(this);	
};

InheritenceManager.extend(RenderCloth, RenderBase);

RenderCloth.prototype.render = function() {
	gl.useProgram(progCloth);
	
	var modelView = mat4.create();
	var playerPos = {
		x: world.player.getPosition().x, 
		y: world.player.getPosition().y
	}
	var scale = 1.0;
	this.modelCloth = [];
	
	var points = world.cloth.getPoints();	// get the points
	var i = points.length;
	var nrLines = 0;
	//console.log(i);
	while(i--) {								// for each point
		var j = points[i].constraints.length;
		while(j--) {							// for each constraint in that point
			this.modelCloth = this.modelCloth.concat(points[i].constraints[j].getPoints());
			nrLines+=2;
			//this.modelCloth.push(points[i].constraints[j].getPoints());
		}
	}

	this.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelCloth), gl.STATIC_DRAW);
	
	
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
	//console.log(this.modelCloth);
	
	//mat4.scale(modelView, modelView, [1.0, 1.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);

	gl.uniformMatrix4fv(progCloth.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progCloth.modelView, false, modelView);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progCloth.position, 3, gl.FLOAT, false, 0, 0);
	
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
	
	this.init();
	//gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	//gl.vertexAttribPointer(progEntity, 1, gl.FLOAT, false, 0, 0);
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
	var n = nrOfParticles;
	var n2 = n*n;
	
	
	progParticleGpu = utils.addShaderProg(gl, 'particle-calc.vert', 'particle-calc.frag');
	gl.useProgram(progParticleGpu);
	progParticleGpu.pos = gl.getAttribLocation(progParticleGpu, "inPos");
	progParticleGpu.tex = gl.getAttribLocation(progParticleGpu, "inTex");
	gl.enableVertexAttribArray(progParticleGpu.pos);
	gl.enableVertexAttribArray(progParticleGpu.tex);
	this.posTexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posTexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,0,0, -1,1,0,1,
    1,-1,1,0, 1,1,1,1]), gl.STATIC_DRAW);
	//gl.vertexAttribPointer(progParticleGpu.pos, 2, gl.FLOAT, gl.FALSE, 16, 0);
	//gl.vertexAttribPointer(progParticleGpu.tex, 2, gl.FLOAT, gl.FALSE, 16, 8);
	//gl.bindBuffer(gl.ARRAY_BUFFER, null);
	var pix = [], pix1 = [], offset = 0.00001, lengthFromMiddle = 100;
	for(var i = 0; i < n2; i++){
		var phi = 2*i*Math.PI/n2;
		pix.push(lengthFromMiddle*Math.cos(phi), lengthFromMiddle*Math.sin(phi), 0);
		pix1.push((lengthFromMiddle + offset)*Math.cos(phi), (lengthFromMiddle + offset)*Math.sin(phi), 0);
	}
	
	var pos = [], vel = [];
	for(var x = 0; x < n*2; x += 2) {
		for(var y = 0; y < n*2; y += 2) {
			pos.push(x, y, 0);
			vel.push(Math.random()*2 - 1, Math.random()*2 - 1, 0);
		}
	}
	
//-------This texture stores the position and velocity-------//
	this.texParticlePos1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//-------This texture also stores the position and velocity-------//
  	this.texParticlePos2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticlePos2);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, new Float32Array(pos));
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 	
 	this.texParticleVel1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, this.texParticleVel1);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, new Float32Array(vel));
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
	
	
	
	progParticleGpu.posLoc = gl.getUniformLocation(progParticleGpu, "posSamp");
	progParticleGpu.velLoc = gl.getUniformLocation(progParticleGpu, "velSamp");
	
	progParticleGpuShow = utils.addShaderProg(gl, 'particle-calc-show.vert', 'particle-calc-show.frag');
	progParticleGpuShow.points = 3;
	gl.bindAttribLocation(progParticleGpuShow, progParticleGpuShow.points, "inPoints");
	gl.linkProgram(progParticleGpuShow);
	gl.useProgram(progParticleGpuShow);
	
	var vertices = [], d = 1/n;
	for (var x = 0; x < 1; x += d)
		for (var y = 0; y < 1; y += d)
			vertices.push (x, y);
			
	this.gpuParticleVao = gl.createBuffer();
	gl.enableVertexAttribArray(progParticleGpuShow.points);
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
   	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   	gl.vertexAttribPointer(progParticleGpuShow.points, 2, gl.FLOAT, false, 0, 0);
	
	gl.uniform1i(gl.getUniformLocation(progParticleGpuShow, "samp1"), 1);
	
	this.mvMatLoc = gl.getUniformLocation(progParticleGpuShow, "mvMatrix");
	this.prMatLoc = gl.getUniformLocation(progParticleGpuShow, "prMatrix");
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
	this.renderTemp();
	//gl.depthMask(true);
};

RenderParticle.prototype.renderTemp = function() {
	gl.useProgram(progParticleGpu);
	gl.viewport(0, 0, nrOfParticles, nrOfParticles);
	
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

  	gl.uniformMatrix4fv(this.prMatLoc, false, cam.getProj());
  	gl.uniformMatrix4fv(this.mvMatLoc, false, modelView);
  	
	//gl.enable(gl.BLEND);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.gpuParticleVao);
  	gl.drawArrays(gl.POINTS, 0, nrOfParticles*nrOfParticles);
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
	gl.useProgram(progTile);
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

	gl.uniformMatrix4fv(progTile.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTile.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTile.view, false, tmp);
	
	gl.uniform2f(progTile.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTile.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
	
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

	gl.uniformMatrix4fv(progTile.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTile.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTile.view, false, tmp);
	gl.uniform2f(progTile.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTile.tex, 0);
	
	//console.log(tmpModelTile);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
	
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

	gl.uniformMatrix4fv(progTile.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progTile.modelView, false, modelView);
	var tmp = mat4.copy(mat4.create(), modelView);
	mat4.transpose(tmp, tmp);
	gl.uniformMatrix4fv(progTile.view, false, tmp);
	gl.uniform2f(progTile.trans, pos.x, pos.y);
	
	gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(progTile.tex, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
	
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
	//gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoBg);

	gl.uniformMatrix4fv(progWorld.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progWorld.modelView, false, modelView);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texBg);
    gl.uniform1i(progWorld.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
	
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBg.getNumVertices());
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
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, 0.0, 0.0]);
	else if(playerPos.y > world.worldSize.y - ((gl.viewportHeight)/2))
		mat4.translate(modelView, modelView, [0.0, -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else {
		//----------------------------------- -playerpos      -window/3/2 to get to the middle   /Mgwidth to scale correctly -----------------//
		mat4.translate(modelView, modelView, [0.0, -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	}
	
	mat4.scale(modelView, modelView, [this.texMg.width, this.texMg.height, 1.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoMg);

	gl.uniformMatrix4fv(progWorld.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progWorld.modelView, false, modelView);
	
	//gl.enableAlphaTest();
	gl.bindTexture(gl.TEXTURE_2D, this.texMg);
    gl.uniform1i(progWorld.tex, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progTile.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
	gl.vertexAttribPointer(progTile.texCoord, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(progTile.normal, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelMg.getNumVertices());

};

RenderBoundingBox = function() {	//Render Square Class
	RenderBoundingBox.baseConstructor.call(this);
	
	this.modelBB = new ModelSquare();
	this.initBuffers(this.modelBB);
}

InheritenceManager.extend(RenderBoundingBox, RenderBase);

RenderBoundingBox.prototype.render = function() {
	if(debug) {
		gl.useProgram(progBB);
		
		
		var playerPos = {
			x: world.player.getPosition().x - world.player.size.x/2, 
			y: world.player.getPosition().y
		}
		this.renderBB(playerPos, world.player.size);
		var groundPos = {
			x: 0, 
			y: 0
		}
		var groundSize = {
			x: world.worldSize.x, 
			y: 10
		}
		this.renderBB(groundPos, groundSize);
		var tilesMg = world.getTilesMg();
		for(var i = 0; i < tilesMg.length; i++) {
			if(tilesMg[i].getTile().getBB() != null) {
				var pos = {
					x: tilesMg[i].getPosition().x + tilesMg[i].getTile().getBB().getMin().x, 
					y: tilesMg[i].getPosition().y + tilesMg[i].getTile().getBB().getMin().y
				}
				
				var size = {
					x: tilesMg[i].getTile().getBB().getMax().x - tilesMg[i].getTile().getBB().getMin().x,
					y: tilesMg[i].getTile().getBB().getMax().y - tilesMg[i].getTile().getBB().getMin().y
				}
				this.renderBB(pos, size);
			}
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
		mat4.translate(modelView, modelView, [pos.x, 0, 1.5]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [pos.x -(world.worldSize.x - (gl.viewportWidth)), 0.0, 1.5]);
	else {
		mat4.translate(modelView, modelView, [pos.x -(playerPos.x - ((gl.viewportWidth)/2)), 0.0, 1.5]);
	}
	
	if(playerPos.y < (gl.viewportHeight)/2)
		mat4.translate(modelView, modelView, [0.0, pos.y, 0.0]);
	else if(playerPos.x > world.worldSize.x - ((gl.viewportWidth)/2))
		mat4.translate(modelView, modelView, [0.0, pos.y -(world.worldSize.y - (gl.viewportHeight)), 0.0]);
	else {
		mat4.translate(modelView, modelView, [0.0, pos.y -(playerPos.y - ((gl.viewportHeight)/2)), 0.0]);
	}
	
	mat4.scale(modelView, modelView, [size.x, size.y, 0.0]);
	//Used to center the player on the canvas
	//mat4.translate(modelView, modelView, [-(world.player.size.x*0.5)/world.player.size.x, 0.0, 0.0]);
	mat4.multiply(modelView, cam.getView(), modelView);
	
	gl.uniformMatrix4fv(progBB.proj, false, cam.getProj());
	gl.uniformMatrix4fv(progBB.modelView, false, modelView);
	
	//gl.bindTexture(gl.TEXTURE_2D, tex);
 	//gl.uniform1i(this.prog.tex, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(progBB.position, 3, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.modelBB.getNumVertices());
}

RenderLight = function() {
	//RenderLight.baseConstructor.call(this);
	
	this.lightPos = [];
	this.lightColor = [];
	
	this.init();
}

//InheritenceManager.extend(RenderLight, RenderBase);

RenderLight.prototype.init = function() {
	var totalNrLights = world.lights.length;
	
	var lights = world.lights;
	for(var i = 0; i < totalNrLights; i++) {
		var position = [lights[i].getPosition().x, lights[i].getPosition().y, lights[i].getPosition().z];
		var color = [lights[i].getColor().r, lights[i].getColor().g, lights[i].getColor().b];
		this.lightPos = this.lightPos.concat(position);
		this.lightColor = this.lightColor.concat(color);
	}
	
	gl.useProgram(progTile);
	gl.uniform3fv(progTile.lightPos, this.lightPos);
	gl.uniform3fv(progTile.lightColor, this.lightColor);
}
