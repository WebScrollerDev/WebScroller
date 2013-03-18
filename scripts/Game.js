var gl;
var cam = new Camera();
var render = new RenderManager();

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


function startGL() {
	var canvas = document.getElementById("canvas");
	initGL(canvas);
	cam.init(gl);
	render.init(gl, cam);
	//initShaders();
	//initBuffers();

	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	render.render(gl);
	//drawScene();
}
