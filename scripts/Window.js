Window = function(pos, size, image) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, image, this.tex);
	this.buttons = [];
	this.textWidgets = [];
	this.pos = {
		x: pos[0], 
		y: pos[1]
	}
	
	this.size = {
		x: size[0], 
		y: size[1]
	}
}

Window.prototype = {
	addButton: function(button) {
		button.setParentWindow(this);
		this.buttons.push(button);
	}, 
	
	getButtons: function() {
		return this.buttons;
	}, 
	
	addTextWidget: function(textWidget) {
		textWidget.setParentWindow(this);
		this.textWidgets.push(textWidget);
	}, 
	
	getTextWidgets: function() {
		return this.textWidgets;
	}, 

	getPos: function() {
		return this.pos;
	}, 

	getSize: function() {
		return this.size;
	}, 
	
	getTex: function() {
		return this.tex;
	}
}
