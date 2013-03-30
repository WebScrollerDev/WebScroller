
function addBgTile() {
	console.log("Adding BackgroundTile");
	//TODO parse input field and add to bg Xml
}

function addMgTile() {
	console.log("Adding MiddlegroundTile");
	//TODO parse input field and add to mg Xml
}

function addFgTile() {
	console.log("Adding ForegroundTile");
	//TODO parse input field and add to fg Xml
}

var gl;

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

function startEditor() {
	//console.log("Started Editor");
	var canvas = document.getElementById("canvas");
	initGL(canvas);
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
