var tmpTilesBg = [];
var tmpTilesMg = [];
var tmpAnimatedTilesMg = [];
var tmpTilesFg = [];
var obbs = [];
var tbs = [];
var lights = [];
var tmpRopes = [];
var tmpCloths = [];
var tmpParticles = [];
var tmpWaters = [];
var tmpGpuAir;
var tmpGpuFluid;
var bg = false;
var mg = false;
var fg = false;
var light = false;
var fabricsBool = false;
var particleBool = false;
var waterBool = false;
var gpuParticlesBool = false;

var doneLoading = false;

var selectedWorld = 0;
function loadXml(selWorld) {
	selectedWorld = selWorld;
	$.ajax({
    	type: "GET",
    	url: "config/mgTiles.xml",
    	dataType: "xml",
    	success: parseMgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/bgTiles.xml",
    	dataType: "xml",
    	success: parseBgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/fgTiles.xml",
    	dataType: "xml",
    	success: parseFgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/lights.xml",
    	dataType: "xml",
    	success: parseLights
  	});
  	$.ajax({
    	type: "GET",
    	url: "config/fabrics.xml",
    	dataType: "xml",
    	success: parseFabrics
  	});
  	$.ajax({
    	type: "GET",
    	url: "config/particles.xml",
    	dataType: "xml",
    	success: parseParticles
  	});
  	$.ajax({
    	type: "GET",
    	url: "config/waters.xml",
    	dataType: "xml",
    	success: parseWaters
  	});
  	$.ajax({
    	type: "GET",
    	url: "config/gpuParticles.xml",
    	dataType: "xml",
    	success: parseGpuParticles
  	});
}

function loadWorldXml() {
	if(bg && mg && fg && light && fabricsBool && particleBool && waterBool && gpuParticlesBool) {
		$.ajax({
	    	type: "GET",
	    	url: "config/worlds.xml",
	    	dataType: "xml",
	    	success: parseWorlds
	  	});
	}
}

function parseWorlds(xml) {
	$(xml).find("Worlds").each(function() {
		$(this).find("World").each(function() {
			var worldId, bgPath;
			var worldSize = [], playerSpawn = [];
			
			worldId = parseInt($(this).find("WorldId").text());
			if(selectedWorld == worldId) {
				bgPath = $(this).find("BgPath").text();
				world.setBgPath(bgPath);
				$(this).find("WorldSize").each(function() {
					worldSize[0] = parseInt($(this).find("WorldX").text());
					worldSize[1] = parseInt($(this).find("WorldY").text());
				});
				world.setWorldSize(worldSize);
				$(this).find("PlayerSpawn").each(function() {
					playerSpawn[0] = parseInt($(this).find("SpawnX").text());
					playerSpawn[1] = parseInt($(this).find("SpawnY").text());
				});
				world.player.setPosition(playerSpawn);
				if(rainOn) {
					$(this).find("Rain").each(function() {
						var amount, spawnInterval;
						var particleVelocity = [], particleVelocitySpan = [];
						
						amount = parseInt($(this).find("Amount").text());
						spawnInterval = parseInt($(this).find("SpawnInterval").text());
						$(this).find("ParticleVelocity").each(function() {
							particleVelocity[0] = parseFloat($(this).find("VelX").text());
							particleVelocity[1] = parseFloat($(this).find("VelY").text());
						});
						$(this).find("ParticleVelocitySpan").each(function() {
							particleVelocitySpan[0] = parseFloat($(this).find("VelSpanX").text());
							particleVelocitySpan[1] = parseFloat($(this).find("VelSpanY").text());
						});
						
						world.addRain(new EmitterRain(amount*rainMult, spawnInterval/rainMult, particleVelocity, particleVelocitySpan));
					});
				}
				$(this).find("Waters").each(function() {
					var waterMasses = [];
					$(this).find("Water").each(function() {
						var waterId;
						var waterPos = [], waterSize = [];
						
						waterId = parseInt($(this).find("WaterId").text());
						$(this).find("WaterPos").each(function() {
							waterPos[0] = parseInt($(this).find("WaterX").text());
							waterPos[1] = parseInt($(this).find("WaterY").text());
						});
						$(this).find("WaterSize").each(function() {
							waterSize[0] = parseInt($(this).find("WaterSizeX").text());
							waterSize[1] = parseInt($(this).find("WaterSizeY").text());
						});
						
						waterMasses.push(new WaterMass(waterPos, waterSize, tmpWaters[waterId].columnCount, tmpWaters[waterId].updateInterval, tmpWaters[waterId].springHardness, tmpWaters[waterId].springFriction, tmpWaters[waterId].spreadFactor, tmpWaters[waterId].bottomColor, tmpWaters[waterId].topColor, tmpWaters[waterId].bubbleCount, tmpWaters[waterId].splashCount));
					});
					world.setWaterMasses(waterMasses);
				});
				$(this).find("GpuParticles").each(function() {
					$(this).find("Fluid").each(function() {
						var fluidSpacing;
						var fluidPos = [], fluidOffset = [];
						
						fluidSpacing = parseInt($(this).find("FluidSpacing").text());
						$(this).find("FluidPos").each(function() {
							fluidPos[0] = parseInt($(this).find("FluidX").text());
							fluidPos[1] = parseInt($(this).find("FluidY").text());
						});
						$(this).find("FluidOffset").each(function() {
							fluidOffset[0] = parseInt($(this).find("FluidX").text());
							fluidOffset[1] = parseInt($(this).find("FluidY").text());
						});
						world.gpuFluid = new GpuFluidParticle(fluidPos, fluidOffset, fluidSpacing, tmpGpuFluid.amount, tmpGpuFluid.collisionImage, tmpGpuFluid.warpTo, tmpGpuFluid.warpFrom, tmpGpuFluid.color)
					});
					$(this).find("Air").each(function() {
						world.gpuAir = new GpuAirParticle(tmpGpuAir.amount, tmpGpuAir.color);
					});
				});
				$(this).find("TilesBg").each(function() {
					var tilesPlaceable = [];
					$(this).find("Tile").each(function() {
						var id = parseInt($(this).find("Id").text());
						var pos;
						$(this).find("Pos").each(function() {
							pos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text()), parseFloat($(this).find("Z").text())];
						});
						var tilePlaceable = new TilePlaceable(tmpTilesBg[id], pos);
						$(this).find("Lights").each(function() {
							console.log("found bg light");
							$(this).find("Light").each(function() {
								var id = parseInt($(this).find("LightId").text());
								var light = lights[id];
								var lightPos = [];
								$(this).find("LightPos").each(function() {
									lightPos[0] = parseInt($(this).find("LightX").text());
									lightPos[1] = parseInt($(this).find("LightY").text());
									lightPos[2] = parseInt($(this).find("LightZ").text());
								});
								if(light.type == "static") {
									tilePlaceable.addStaticLight(new LightBase(vec3.add(vec3.create(), pos, lightPos), light.color, light.intensity));
								}
								if(light.type == "flickering") {
									tilePlaceable.addFlickeringLight(new LightFlickering(vec3.add(vec3.create(), pos, lightPos), light.color, light.flickerSpeed, light.flickerSpeedSpan, light.intensity));
								}
								if(light.type == "morphing") {
									tilePlaceable.addMorphingLight(new LightMorphing(vec3.add(vec3.create(), pos, lightPos), light.colors, light.flickerSpeed, light.flickerSpeedSpan, light.intensity, light.morphSpeed, light.morphSpeedSpan));
								}
							});
						});
						tilesPlaceable.push(tilePlaceable);
					});
					world.setTilesBg(tilesPlaceable);
				});
				
				$(this).find("TilesMg").each(function() {
					var tilesPlaceable = [];
					var tilesAnimated = [];
					var smokeEmitters = [];
					$(this).find("Tile").each(function() {
						var tileAnimated;
						var id = parseInt($(this).find("Id").text());
						var pos;
						var currentTile;
						var normalTile = false;
						$(this).find("Pos").each(function() {
							pos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text()), parseFloat($(this).find("Z").text())];
						});
						//console.log(tmpAnimatedTilesMg);
						
						if(tmpTilesMg[id] != null) {
							currentTile = new TilePlaceable(tmpTilesMg[id], pos);
							normalTile = true;
						}
						else if(tmpAnimatedTilesMg[id] != null) {
							currentTile = new TileAnimated(tmpAnimatedTilesMg[id].tile, pos, tmpAnimatedTilesMg[id].totalNrAnimations, tmpAnimatedTilesMg[id].maxNrFramesPerAnimation, tmpAnimatedTilesMg[id].nrFramesPerAnimation, tmpAnimatedTilesMg[id].animationSpeed);
						}
						//console.log(currentTile);
						if(obbs[id] != null) {
							for(var i = 0; i < obbs[id].length; i++) {
								var tmpObb = new OBB(pos, obbs[id][i].center, obbs[id][i].size, obbs[id][i].angle);
								currentTile.addBoundingBox(tmpObb);
								if(obbs[id][i].shadows)
									world.shadowHandler.addShadowPair(tmpObb.corner[3], tmpObb.corner[2], tmpObb.corner[1], tmpObb.corner[0]);
							}
						}
						if(tbs[id] != null) {
							for(var i = 0; i < tbs[id].length; i++) {
								currentTile.addTriggerBox(new TriggerBox(pos, tbs[id][i].center, tbs[id][i].size, tbs[id][i].angle, currentTile, tbs[id][i].triggerFunc));
							}
						}
						$(this).find("Lights").each(function() {
							$(this).find("Light").each(function() {
								var id = parseInt($(this).find("LightId").text());
								var light = lights[id];
								var lightPos = [];
								$(this).find("LightPos").each(function() {
									lightPos[0] = parseInt($(this).find("LightX").text());
									lightPos[1] = parseInt($(this).find("LightY").text());
									lightPos[2] = parseInt($(this).find("LightZ").text());;
								});
								if(light.type == "static") {
									currentTile.addStaticLight(new LightBase(vec3.add(vec3.create(), pos, lightPos), light.color, light.intensity));
								}
								if(light.type == "flickering") {
									currentTile.addFlickeringLight(new LightFlickering(vec3.add(vec3.create(), pos, lightPos), light.color, light.flickerSpeed, light.flickerSpeedSpan, light.intensity));
								}
								if(light.type == "morphing") {
									currentTile.addMorphingLight(new LightMorphing(vec3.add(vec3.create(), pos, lightPos), light.colors, light.flickerSpeed, light.flickerSpeedSpan, light.intensity, light.morphSpeed, light.morphSpeedSpan));
								}
							});
						});
						
						$(this).find("Particles").each(function() {
							$(this).find("Particle").each(function() {
								var id = parseInt($(this).find("ParticleId").text());
								var particle = tmpParticles[id];
								var particlePos = [];
								$(this).find("ParticlePos").each(function() {
									particlePos[0] = parseInt($(this).find("ParticleX").text());
									particlePos[1] = parseInt($(this).find("ParticleY").text());
									particlePos[2] = parseInt($(this).find("ParticleZ").text());
								});
								if(particle.type == "smoke") {
									smokeEmitters.push(new EmitterSmoke(vec3.add(vec3.create(), pos, particlePos), tmpParticles[id].maxParticles, tmpParticles[id].spawnInterval, tmpParticles[id].diameter, tmpParticles[id].velocity, tmpParticles[id].velocitySpan, tmpParticles[id].lifeTime, tmpParticles[id].lifeTimeSpan));
								}
							});
						});
						if(normalTile)
							tilesPlaceable.push(currentTile);
						else
							tilesAnimated.push(currentTile);
					});
					
					world.setTilesAnimatedMg(tilesAnimated);
					world.setTilesMg(tilesPlaceable);
					world.setSmokeEmitters(smokeEmitters);
				});
				
				$(this).find("TilesFg").each(function() {
					var tilesPlaceable = [];
					$(this).find("Tile").each(function() {
						var id = parseInt($(this).find("Id").text());
						var pos;
						$(this).find("Pos").each(function() {
							pos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text()), parseFloat($(this).find("Z").text())];
						});
						var tilePlaceable = new TilePlaceable(tmpTilesFg[id], pos);
						$(this).find("Lights").each(function() {
							$(this).find("Light").each(function() {
								var id = parseInt($(this).find("LightId").text());
								var light = lights[id];
								var lightPos = [];
								$(this).find("LightPos").each(function() {
									lightPos[0] = parseInt($(this).find("LightX").text());
									lightPos[1] = parseInt($(this).find("LightY").text());
									lightPos[2] = parseInt($(this).find("LightZ").text());
								});
								if(light.type == "static") {
									tilePlaceable.addStaticLight(new LightBase(vec3.add(vec3.create(), pos, lightPos), light.color, light.intensity));
								}
								if(light.type == "flickering") {
									tilePlaceable.addFlickeringLight(new LightFlickering(vec3.add(vec3.create(), pos, lightPos), light.color, light.flickerSpeed, light.flickerSpeedSpan, light.intensity));
								}
								if(light.type == "morphing") {
									tilePlaceable.addMorphingLight(new LightMorphing(vec3.add(vec3.create(), pos, lightPos), light.colors, light.flickerSpeed, light.flickerSpeedSpan, light.intensity, light.morphSpeed, light.morphSpeedSpan));
								}
							});
						});
						tilesPlaceable.push(tilePlaceable);
					});
					world.setTilesFg(tilesPlaceable);
				});
				
				$(this).find("Ropes").each(function() {
					var ropes = [];
					$(this).find("Rope").each(function() {
						var id, startPos, endPos, rope;
						
						id = parseInt($(this).find("Id").text());
						$(this).find("StartPos").each(function() {
							startPos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text())];
						});
						$(this).find("EndPos").each(function() {
							endPos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text())];
						});
						rope = new Rope(startPos, endPos, tmpRopes[id].numJoints, tmpRopes[id].lastPinned, tmpRopes[id].color);
						$(this).find("AttachedTiles").each(function() {
							$(this).find("AttachedTile").each(function() {
								var tileIndex = parseInt($(this).find("TileIndex").text());
								var joint = parseInt($(this).find("Joint").text());
								rope.attachTile(world.getTilesMg()[tileIndex], joint);
							});
						});
						$(this).find("AttachedLights").each(function() {
							$(this).find("AttachedLight").each(function() {
								var lightId = parseInt($(this).find("LightId").text());
								var joint = parseInt($(this).find("Joint").text());
								var light = lights[lightId];
								//console.log(lights[lightId]);
								var pos = [0, 0, 0];
								var lightPos = [0, 0, 0];
								if(light.type == "static") {
									rope.attachLightS(new LightBase(vec3.add(vec3.create(), pos, lightPos), light.color, light.intensity), joint);
								}
								if(light.type == "flickering") {
									rope.attachLightF(new LightFlickering(vec3.add(vec3.create(), pos, lightPos), light.color, light.flickerSpeed, light.flickerSpeedSpan, light.intensity), joint);
								}
								if(light.type == "morphing") {
									rope.attachLightM(new LightMorphing(vec3.add(vec3.create(), pos, lightPos), light.colors, light.flickerSpeed, light.flickerSpeedSpan, light.intensity, light.morphSpeed, light.morphSpeedSpan), joint);
								}
								
							});
						});
						ropes.push(rope);
					});
					world.setRopes(ropes);
				});
				
				$(this).find("Cloths").each(function() {
					var cloths = [];
					$(this).find("Cloth").each(function() {
						var id, pos;
						
						id = parseInt($(this).find("Id").text());
						$(this).find("Pos").each(function() {
							pos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text())];
						});
						cloths.push(new Cloth(pos, tmpCloths[id].size, tmpCloths[id].spacing, tmpCloths[id].color));
					});
					world.setCloths(cloths);
				});
			}
		});
	});
	doneLoading = true;
}

function parseMgTiles(xml)
{
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			if($(this).find("BoundingBoxes")) {
				//var minX, maxX, minY, maxY;
				var tmpBbs = [];
				$(this).find("BoundingBox").each(function() {
					var bbCenter = [];
					var bbSize = [];
					var bbAngle, shadows;
					shadows = false;
					$(this).find("BBSize").each(function() {
						bbSize[0] = parseInt($(this).find("BBX").text());
						bbSize[1] = parseInt($(this).find("BBY").text());
					});
					
					$(this).find("BBCenter").each(function() {
						bbCenter[0] = parseInt($(this).find("BBX").text());
						bbCenter[1] = parseInt($(this).find("BBY").text());
					});
					
					bbAngle = (parseInt($(this).find("BBAngle").text())*Math.PI)/180;
					shadows = $(this).find("Shadows").text() == "true" ? true : false;
					var obbTmp = {
						center: bbCenter, 
						size: bbSize, 
						angle: bbAngle, 
						shadows: shadows
					}
					tmpBbs.push(obbTmp);
				});
				obbs[id] = tmpBbs;
			}
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});
			
			
			//console.log("Adding tile to tiles");
			tmpTilesMg[id] = tile;
		});
		
		$(this).find("AnimatedTile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			
			var id, totalNrAnimations, maxNrFramesPerAnimation, animationSpeed;
			var nrFramesPerAnimation = [], tmpNrFramesPerAnimation = [];
			
			id = parseInt($(this).find("Id").text());
			totalNrAnimations = parseInt($(this).find("TotalNrAnimations").text());
			maxNrFramesPerAnimation = parseInt($(this).find("MaxNrFramesPerAnimation").text());
			animationSpeed = parseInt($(this).find("AnimationSpeed").text());
			tmpNrFramesPerAnimation = $(this).find("NrFramesPerAnimation").text().split(",");
			for(var i = 0; i < tmpNrFramesPerAnimation.length; i++) {
				nrFramesPerAnimation.push(parseInt(tmpNrFramesPerAnimation[i]));
			}
			
			if($(this).find("BoundingBoxes")) {
				//var minX, maxX, minY, maxY;
				var tmpBbs = [];
				$(this).find("BoundingBox").each(function() {
					var bbCenter = [];
					var bbSize = [];
					var bbAngle;
					$(this).find("BBSize").each(function() {
						bbSize[0] = parseInt($(this).find("BBX").text());
						bbSize[1] = parseInt($(this).find("BBY").text());
					});
					
					$(this).find("BBCenter").each(function() {
						bbCenter[0] = parseInt($(this).find("BBX").text());
						bbCenter[1] = parseInt($(this).find("BBY").text());
					});
					
					bbAngle = (parseInt($(this).find("BBAngle").text())*Math.PI)/180;
					shadows = $(this).find("Shadows").text() == "true" ? true : false;
					var obbTmp = {
						center: bbCenter, 
						size: bbSize, 
						angle: bbAngle, 
						shadows: shadows
					}
					tmpBbs.push(obbTmp);
				});
				obbs[id] = tmpBbs;
			}
			if($(this).find("TriggerBoxes")) {
				//var minX, maxX, minY, maxY;
				var tmpTbs = [];
				$(this).find("TriggerBox").each(function() {
					var bbCenter = [];
					var bbSize = [];
					var bbAngle, triggerFunc;
					$(this).find("TBSize").each(function() {
						bbSize[0] = parseInt($(this).find("TBX").text());
						bbSize[1] = parseInt($(this).find("TBY").text());
					});
					
					$(this).find("TBCenter").each(function() {
						bbCenter[0] = parseInt($(this).find("TBX").text());
						bbCenter[1] = parseInt($(this).find("TBY").text());
					});
					
					bbAngle = (parseInt($(this).find("TBAngle").text())*Math.PI)/180;
					triggerFunc = $(this).find("TriggerFunc").text();
					var tbTmp = {
						center: bbCenter, 
						size: bbSize, 
						angle: bbAngle, 
						triggerFunc: triggerFunc
					}
					tmpTbs.push(tbTmp);
				});
				tbs[id] = tmpTbs;
			}
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});
			
			//console.log("Adding tile to tiles");
			tmpAnimatedTilesMg[id] = {
				tile: tile, 
				totalNrAnimations: totalNrAnimations, 
				maxNrFramesPerAnimation: maxNrFramesPerAnimation, 
				nrFramesPerAnimation: nrFramesPerAnimation,
				animationSpeed: animationSpeed
			};
			//console.log(tmpAnimatedTilesMg);
		});
	});
	mg = true;
	loadWorldXml();
}

function parseBgTiles(xml)
{
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});

			tmpTilesBg[id] = tile;
		});
	});
	bg = true;
	loadWorldXml();
}

function parseFgTiles(xml)
{
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});

			tmpTilesFg[id] = tile;
		});
	});
	fg = true;
	loadWorldXml();
}

function parseLights(xml)
{
	$(xml).find("Lights").each(function() {
		$(this).find("StaticLight").each(function() {
			var id, intensity;
			var color = [];
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			intensity = parseFloat($(this).find("Intensity").text());
			id = parseInt($(this).find("Id").text());
			var tmpLight = {
				type: "static",
				color: color, 
				intensity: intensity
			}
			lights[id] = tmpLight;
		});
		$(this).find("FlickeringLight").each(function() {
			var id, flickerSpeed, flickerSpeedSpan;
			var intensity = [];
			var color = [];
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			$(this).find("Intensity").each(function() {
				intensity[0] = parseFloat($(this).find("Min").text());
				intensity[1] = parseFloat($(this).find("Max").text());
			});
			id = parseInt($(this).find("Id").text());
			$(this).find("Flicker").each(function() {
				flickerSpeed = parseFloat($(this).find("Speed").text());
				flickerSpeedSpan = parseFloat($(this).find("SpeedSpan").text());
			});
			var tmpLight = {
				type: "flickering",
				color: color, 
				intensity: intensity, 
				flickerSpeed: flickerSpeed, 
				flickerSpeedSpan: flickerSpeedSpan
			}
			lights[id] = tmpLight;
		});
		$(this).find("MorphingLight").each(function() {
			var id, flickerSpeed, flickerSpeedSpan, morphSpeed, morphSpeedSpan;
			var intensity = [];
			var colors = [];
			$(this).find("Colors").each(function() {
				var color = [];
				$(this).find("Color").each(function() {
					color[0] = parseFloat($(this).find("R").text());
					color[1] = parseFloat($(this).find("G").text());
					color[2] = parseFloat($(this).find("B").text());
					colors.push(color);
					color = [];
				});
			});
			
			$(this).find("Intensity").each(function() {
				intensity[0] = parseFloat($(this).find("Min").text());
				intensity[1] = parseFloat($(this).find("Max").text());
			});
			id = parseInt($(this).find("Id").text());
			$(this).find("Flicker").each(function() {
				flickerSpeed = parseFloat($(this).find("Speed").text());
				flickerSpeedSpan = parseFloat($(this).find("SpeedSpan").text());
			});
			$(this).find("Morph").each(function() {
				morphSpeed = parseFloat($(this).find("Speed").text());
				morphSpeedSpan = parseFloat($(this).find("SpeedSpan").text());
			});
			var tmpLight = {
				type: "morphing",
				colors: colors, 
				intensity: intensity, 
				flickerSpeed: flickerSpeed, 
				flickerSpeedSpan: flickerSpeedSpan, 
				morphSpeed: morphSpeed, 
				morphSpeedSpan: morphSpeedSpan
			}
			lights[id] = tmpLight;
		});
	});
	
	light = true;
	loadWorldXml();
}

function parseFabrics(xml)
{
	$(xml).find("Fabrics").each(function() {
		$(this).find("Rope").each(function() {
			var id, numJoints, lastPinned;
			var color = [];
			
			id = parseInt($(this).find("Id").text());
			numJoints = parseInt($(this).find("NumJoints").text());
			lastPinned = $(this).find("LastPinned").text() == "true" ? true : false;
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			tmpRopes[id] = {
				numJoints: numJoints,
				lastPinned: lastPinned, 
				color: color
			};
		});
		$(this).find("Cloth").each(function() {
			var id, spacing;
			var color = [], size = [];
			
			id = parseInt($(this).find("Id").text());
			$(this).find("Size").each(function() {
				size[0] = parseFloat($(this).find("X").text());
				size[1] = parseFloat($(this).find("Y").text());
			});
			spacing = parseInt($(this).find("Spacing").text());
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			tmpCloths[id] = {
				size: size,
				spacing: spacing, 
				color: color
			};
		});
	});

	fabricsBool = true;
	loadWorldXml();
}

function parseParticles(xml)
{
	$(xml).find("Particles").each(function() {
		$(this).find("Smoke").each(function() {
			var id, maxParticles, spawnInterval, diameter, lifeTime, lifeTimeSpan;
			var velocity = [], velocitySpan = [];
			
			id = parseInt($(this).find("Id").text());
			maxParticles = parseInt($(this).find("MaxParticles").text());
			spawnInterval = parseInt($(this).find("SpawnInterval").text());
			diameter = parseInt($(this).find("Diameter").text());
			lifeTime = parseInt($(this).find("LifeTime").text());
			lifeTimeSpan = parseInt($(this).find("LifeTimeSpan").text());
			$(this).find("Velocity").each(function() {
				velocity[0] = parseFloat($(this).find("X").text());
				velocity[1] = parseFloat($(this).find("Y").text());
			});
			$(this).find("VelocitySpan").each(function() {
				velocitySpan[0] = parseFloat($(this).find("X").text());
				velocitySpan[1] = parseFloat($(this).find("Y").text());
			});
			tmpParticles[id] = {
				type: "smoke", 
				maxParticles: maxParticles,
				spawnInterval: spawnInterval, 
				diameter: diameter, 
				velocity: velocity, 
				velocitySpan: velocitySpan, 
				lifeTime: lifeTime, 
				lifeTimeSpan: lifeTimeSpan
			};
		});
	});

	particleBool = true;
	loadWorldXml();
}

function parseWaters(xml)
{
	$(xml).find("Waters").each(function() {
		$(this).find("Water").each(function() {
			var id, columnCount, springHardness, springFriction, spreadFactor, updateInterval, bubbleCount, splashCount;
			var bottomColor = [], topColor = [];
			id = parseInt($(this).find("Id").text());
			columnCount = parseInt($(this).find("ColumnCount").text());
			springHardness = parseFloat($(this).find("SpringHardness").text());
			springFriction = parseFloat($(this).find("SpringFriction").text());
			spreadFactor = parseFloat($(this).find("SpreadFactor").text());
			updateInterval = parseInt($(this).find("UpdateInterval").text());
			bubbleCount = parseInt($(this).find("BubbleCount").text());
			splashCount = parseInt($(this).find("SplashCount").text());
			$(this).find("BottomColor").each(function() {
				bottomColor[0] = parseFloat($(this).find("R").text());
				bottomColor[1] = parseFloat($(this).find("G").text());
				bottomColor[2] = parseFloat($(this).find("B").text());
			});
			$(this).find("TopColor").each(function() {
				topColor[0] = parseFloat($(this).find("R").text());
				topColor[1] = parseFloat($(this).find("G").text());
				topColor[2] = parseFloat($(this).find("B").text());
			});
			tmpWaters[id] = {
				columnCount: columnCount, 
				springHardness: springHardness, 
				springFriction: springFriction, 
				spreadFactor: spreadFactor, 
				updateInterval: updateInterval, 
				bottomColor: bottomColor, 
				topColor: topColor,
				bubbleCount: bubbleCount, 
				splashCount: splashCount
			};
		});
	});
	waterBool = true;
	loadWorldXml();
}

function parseGpuParticles(xml)
{
	$(xml).find("GpuParticles").each(function() {
		$(this).find("Fluid").each(function() {
			var amount, collisionImage;
			var color = [], warpFrom = [], warpTo = [];
			amount = parseInt($(this).find("Amount").text());
			collisionImage = $(this).find("CollisionImage").text();
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			$(this).find("WarpFrom").each(function() {
				warpFrom[0] = parseFloat($(this).find("X").text());
				warpFrom[1] = parseFloat($(this).find("Y").text());
			});
			$(this).find("WarpTo").each(function() {
				warpTo[0] = parseFloat($(this).find("X").text());
				warpTo[1] = parseFloat($(this).find("Y").text());
			});
			tmpGpuFluid = {
				amount: amount, 
				color: color,
				collisionImage: collisionImage,
				warpFrom: warpFrom, 
				warpTo: warpTo
			};
		});
		$(this).find("Air").each(function() {
			var amount;
			var color = [];
			amount = parseInt($(this).find("Amount").text());
			$(this).find("Color").each(function() {
				color[0] = parseFloat($(this).find("R").text());
				color[1] = parseFloat($(this).find("G").text());
				color[2] = parseFloat($(this).find("B").text());
			});
			tmpGpuAir = {
				amount: amount, 
				color: color
			};
		});
	});
	gpuParticlesBool = true;
	loadWorldXml();
}