window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var debug;
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
	keyInput();
}

function keyInput() {
	if(isKeyDown('J'))
		debug = !debug;
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
