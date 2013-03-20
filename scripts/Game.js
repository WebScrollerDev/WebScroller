window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

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
	handleKeys();
	world.update();
	render.render();
}

function handleKeys() {
	if(isKeyDown('A'))
		cam.move([0.1, 0.0, 0.0]);
	if(isKeyDown('W'))
		cam.move([0.0, -0.1, 0.0]);
	if(isKeyDown('S'))
		cam.move([0.0, 0.1, 0.0]);
	if(isKeyDown('D'))
		cam.move([-0.1, 0.0, 0.0]);
}

function startGL() {
	var canvas = document.getElementById("canvas");
	initGL(canvas);
	cam.init(gl);
	render.init(gl, world, cam);
	//world.init();

	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	tick();
}
