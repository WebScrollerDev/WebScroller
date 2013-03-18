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