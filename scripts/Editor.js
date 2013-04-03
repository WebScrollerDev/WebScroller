
function addBgTile() {
	console.log("Adding BackgroundTile");
	//TODO parse input field and add to bg Xml
}

function addMgTile() {
	console.log("Adding MiddlegroundTile");
	//TODO parse input field and add to mg Xml
}
function addFgTile() {
	var inId = fgTiles.length;
	var inUrl = document.getElementById("fgImage").value;
	inUrl = inUrl.replace("C:\\fakepath\\", "");
	var inSizeX = document.getElementById("fgSizeX").value;
	var inSizeY = document.getElementById("fgSizeY").value;
	
	
	
	console.log("Adding ForegroundTile");
	var newTile = document.createElement("Tile");
	var id = document.createElement("Id");
	id.appendChild(document.createTextNode(inId));
	var url = document.createElement("Url");
	url.appendChild(document.createTextNode("resources/tiles/fg/" + inUrl));
	var size = document.createElement("Size");
	var sizeX = document.createElement("X");
	sizeX.appendChild(document.createTextNode(inSizeX));
	var sizeY = document.createElement("Y");
	sizeY.appendChild(document.createTextNode(inSizeY));
	size.appendChild(sizeX);
	size.appendChild(sizeY);
	newTile.appendChild(id);
	newTile.appendChild(url);
	newTile.appendChild(size);
	
	$.ajax({
    	type: "GET",
    	url: "config/fgTiles.xml",
    	dataType: "xml",
    	success: function(xml) {
    		$(xml).find("Tiles").append(newTile);
    	}
  	});
	//TODO parse input field and add to fg Xml
}

var renderer = new EditorRenderer();
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var gl;
var currTileState = 0;
var TILESTATE = {
	BACKGROUND: 0, 
	MIDDLEGROUND: 1,
	FOREGROUND: 2
}
var cam = new Camera();

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
	renderer.render();
	keyInput();
}

function keyInput() {
	if(isKeyDown('1'))
		currTileState = TILESTATE.BACKGROUND;
	if(isKeyDown('2'))
		currTileState = TILESTATE.MIDDLEGROUND;
	if(isKeyDown('3'))
		currTileState = TILESTATE.FOREGROUND;
}

function startEditor() {
	//console.log("Started Editor");
	var canvas = document.getElementById("canvas");
	initGL(canvas);
	cam.init(gl);
	renderer.init(gl, cam);
	
	loadTiles();
	
	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	tick();
}
