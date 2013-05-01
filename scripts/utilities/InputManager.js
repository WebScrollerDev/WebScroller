var keyArray = {};

function keyDown(event) {
	keyArray[event.keyCode] = true;
}

function keyUp(event) {
	keyArray[event.keyCode] = false;
}

function isKeyDown(key) {
	var keyCode = key.charCodeAt(0);
	return keyArray[keyCode];
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function mouseDown(event) {
	console.log("mouse down");
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function mouseUp(event) {
	console.log("mouse up");
	mouseDown = false;
}

function mouseMove(event) {
	if(!mouseDown)
		return;
	
	var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var maxVel = 5.0;
    var speed = 0.5;
    if(deltaX > 0) {
    	if(world.player.velocity[0] < maxVel)
			world.player.velocity[0] += speed;
    }else if(deltaX < 0) {
    	if(world.player.velocity[0] > -maxVel)
			world.player.velocity[0] -= speed;
    }
    
}