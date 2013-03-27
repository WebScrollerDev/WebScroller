window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var tilesMg = new Array();

function loadXml() {
	$.ajax({
    	type: "GET",
    	url: "config/mgTiles.xml",
    	dataType: "xml",
    	success: parseMgTiles
  	});
}

function loadWorldXml() {
	  	$.ajax({
    	type: "GET",
    	url: "config/worlds.xml",
    	dataType: "xml",
    	success: parseWorlds
  	});
}

function parseWorlds(xml) {
	$(xml).find("Worlds").each(function() {
		$(this).find("World").each(function() {
			var tilesPlaceable = new Array();
			$(this).find("Tiles").each(function() {
				$(this).find("Tile").each(function() {
					var id = parseInt($(this).find("Id").text());
					var pos;
					$(this).find("Pos").each(function() {
						pos = [parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())];
					});
					var tilePlaceable = new TilePlaceable(tilesMg[id], pos);
					tilesPlaceable.push(tilePlaceable);
				});
			});
			world.setTiles(tilesPlaceable);
		});
	});
}

function parseMgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile(gl, $(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			if($(this).find("BoundingType").text() == "box") {
				var minX, maxX, minY, maxY;
				$(this).find("BoundingBox").each(function() {
					
					$(this).find("Min").each(function() {
						minX = parseInt($(this).find("X").text());
						minY = parseInt($(this).find("Y").text());
					});
					
					$(this).find("Max").each(function() {
						maxX = parseInt($(this).find("X").text());
						maxY = parseInt($(this).find("Y").text());
					});
				
				});
				
				tile.addBoundingBox([minX, minY], [maxX, maxY]);
			}
			if($(this).find("BoundingType").text() == "circle") {
				var radius, posX, posY;
				$(this).find("BoundingCircle").each(function() {
					
					radius = parseInt($(this).find("Radius").text());
					
					$(this).find("Pos").each(function() {
						posX = parseInt($(this).find("X").text());
						posY = parseInt($(this).find("Y").text());
					});
				
				});
				
				tile.addBoundingCircle(radius, [posX, posY]);
			}
			
			$(this).find("Size").each(function() {
				var size = {
					x: parseInt($(this).find("X").text()), 
					y: parseInt($(this).find("Y").text())
				}
				
				tile.setSize(size);
			});
			
			
			//console.log("Adding tile to tiles");
			tilesMg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	loadWorldXml();
}

var gl;
var cam = new Camera();
var render = new RenderManager();
var world = new World();

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function tick() {
	requestAnimFrame(tick);
	world.update();
	cam.update();
	render.render();
}

function startGL() {
	var canvas = document.getElementById("canvas");
	initGL(canvas);
	cam.init(gl, world);
	render.init(gl, world, cam);
	world.init(gl);
	
	loadXml();

	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	tick();
}
