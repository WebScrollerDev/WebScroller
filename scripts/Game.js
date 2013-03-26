window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

function loadXml() {
	$.ajax({
    	type: "GET",
    	url: "config/mgTiles.xml",
    	dataType: "xml",
    	success: parseMgTiles
  	});
}

function parseMgTiles(xml)
{
	var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile(gl, $(this).find("Url").text());
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
			tiles.push(tile);
		});
	});
	world.setTiles(tiles);
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
	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	tick();
}
