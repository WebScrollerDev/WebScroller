var tmpTilesBg = new Array();
var tmpTilesMg = new Array();
var tmpTilesFg = new Array();

var obbs = new Array();
var lights = new Array();

var bg = false;
var mg = false;
var fg = false;
var light = false;
var doneLoading = false;
function loadXml() {
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
}

function loadWorldXml() {
	
	if(bg && mg && fg && light) {
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
			$(this).find("TilesBg").each(function() {
				var tilesPlaceable = new Array();
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
				var tilesPlaceable = new Array();
				$(this).find("Tile").each(function() {
					var id = parseInt($(this).find("Id").text());
					var pos;
					$(this).find("Pos").each(function() {
						pos = [parseFloat($(this).find("X").text()), parseFloat($(this).find("Y").text()), parseFloat($(this).find("Z").text())];
					});
					var tilePlaceable = new TilePlaceable(tmpTilesMg[id], pos);;
					if(obbs[id] != null) {
						for(var i = 0; i < obbs[id].length; i++) {
							var tmpObb = new OBB(pos, obbs[id][i].center, obbs[id][i].size, obbs[id][i].angle);
							tilePlaceable.addBoundingBox(tmpObb);
							world.shadowHandler.addShadowPair(tmpObb.corner[3], tmpObb.corner[2], tmpObb.corner[1], tmpObb.corner[0]);
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
				world.setTilesMg(tilesPlaceable);
			});
			
			$(this).find("TilesFg").each(function() {
				var tilesPlaceable = new Array();
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
		});
	});
	doneLoading = true;
}

function parseMgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			if($(this).find("BoundingBoxes")) {
				//var minX, maxX, minY, maxY;
				var tmpBbs = new Array();
				$(this).find("BoundingBox").each(function() {
					var bbCenter = [];
					var bbSize = [];
					var bbAngle;
					$(this).find("Size").each(function() {
						bbSize[0] = parseInt($(this).find("X").text());
						bbSize[1] = parseInt($(this).find("Y").text());
					});
					
					$(this).find("Center").each(function() {
						bbCenter[0] = parseInt($(this).find("X").text());
						bbCenter[1] = parseInt($(this).find("Y").text());
					});
					
					bbAngle = (parseInt($(this).find("Angle").text())*3.14)/180;
					var obbTmp = {
						center: bbCenter, 
						size: bbSize, 
						angle: bbAngle
					}
					tmpBbs.push(obbTmp);
				});
				
				obbs[id] = tmpBbs;
				//tile.addBoundingBox(new OBB(bbCenter, bbSize, bbAngle));
			}
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});
			
			
			//console.log("Adding tile to tiles");
			tmpTilesMg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	mg = true;
	loadWorldXml();
}

function parseBgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});
			
			
			//console.log("Adding tile to tiles");
			tmpTilesBg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	bg = true;
	loadWorldXml();
}

function parseFgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				tile.setSize([parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())]);
			});
			
			
			//console.log("Adding tile to tiles");
			tmpTilesFg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	fg = true;
	loadWorldXml();
}

function parseLights(xml)
{
	//var tiles = new Array();
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
			var colors = new Array();
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
	//world.setTiles(tiles);
	light = true;
	loadWorldXml();
}
