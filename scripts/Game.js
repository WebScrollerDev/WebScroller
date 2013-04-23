window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var debug = false;
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
	if(doneLoading) {
		world.update();
		cam.update();
		render.render();
		keyInput();
	}
}

function keyInput() {
	if(isKeyDown('J')) {
		debug = !debug;
	}
		
		
}

function startGL() {
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 50;
	initGL(canvas);
	cam.init();
	world.init();
	render.init();	
	loadXml();

	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	canvas.onmousedown = mouseDown;
    document.onmouseup = mouseUp;
    document.onmousemove = mouseMove;
    
	tick();
}
