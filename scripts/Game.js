window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var keyCooldown = 10;
var debug = true;
var shadow = false;
var gl;
var cam;
var render;
var world;
var mainMenu;
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
	if(initialized) {
		gameState = 1;
	}
	switch(gameState) {
		case 0:
			render.render();
			break;
		case 1:
			world.update();
			cam.update();
			render.render();
			keyInput();
			break;
	}
}

function keyInput() {
	if(keyCooldown <= 0) {
		if(isKeyDown('J')) {
			debug = !debug;
			keyCooldown = 10;
		}
		if(isKeyDown('K')) {
			shadow = !shadow;
			keyCooldown = 10;
		}
	}
	else
		keyCooldown--;
}

function tmpMouseUp(event) {
	mouseUp(event);
	mainMenu.mouseUp(event);
}

var initialized = false;
function startGL() {
	gameState = 0;
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 50;
	initGL(canvas);
	cam = new Camera();
	world = new World();
	mainMenu = new MainMenu();
	render = new MenuRenderer();
		
	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	canvas.onmousedown = mouseDown;
    document.onmouseup = tmpMouseUp;
    document.onmousemove = mouseMove;
    var interVal = setInterval(function(){
			if(doneLoading) {
				clearInterval(interVal);
				render = new RenderManager();
				
				world.initArrays();
				render.init();
				initialized = true;
			}
		}, 
		10
	);
	
	tick();
}
