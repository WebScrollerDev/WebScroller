window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var currTileState = 0;
var TILESTATE = {
	BACKGROUND: 0, 
	MIDDLEGROUND: 1,
	FOREGROUND: 2
}
var cam;
var editor;
var renderer;
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

function tmpMouseUp(event) {
	editor.mouseUp(event);
}

function startEditor() {
	//console.log("Started Editor");
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 40;
	initGL(canvas);
	editor = new Editor();
	cam = new Camera();
	renderer = new Renderer();
	renderer.init();
	loadTiles();
	
	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	document.onmousedown = mouseDown;
    document.onmouseup = tmpMouseUp;
    document.onmousemove = mouseMove;
	
	tick();
}
