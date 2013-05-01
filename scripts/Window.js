Window = function(pos, size, image) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, image, this.tex);
	this.buttons = [];
	this.pos = {
		x: pos[0], 
		y: pos[1]
	}
	
	this.size = {
		x: size[0], 
		y: size[1]
	}
}

Window.prototype.addButton = function(button) {
	button.setParentWindow(this);
	this.buttons.push(button);
}

Window.prototype.getButtons = function() {
	return this.buttons;
}

Window.prototype.getPos = function() {
	return this.pos;
}

Window.prototype.getSize = function() {
	return this.size;
}

Window.prototype.getTex = function() {
	return this.tex;
}
