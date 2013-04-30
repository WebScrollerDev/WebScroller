Window = function(image) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, image, this.tex);
	this.buttons = [];
}

Window.prototype.addButton = function(button) {
	this.buttons.push(button);
}

Window.prototype.getButtons = function() {
	return this.buttons;
}
