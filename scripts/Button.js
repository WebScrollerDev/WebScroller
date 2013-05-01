GuiButton = function(pos, size, text, image) {
	this.tex = gl.createTexture();
	Texture.loadImage(gl, image, this.tex);
	this.pos = {
		x: pos[0], 
		y: pos[1]
	}
	
	this.size = {
		x: size[0], 
		y: size[1]
	}
	
	this.text = text;
	this.textTex = gl.createTexture();
	this.initTextTex();
}

GuiButton.prototype.getPos = function() {
	return this.pos;
}

GuiButton.prototype.getSize = function() {
	return this.size;
}

GuiButton.prototype.getText = function() {
	return this.text;
}

GuiButton.prototype.getTextTex = function() {
	return this.textTex;
}

GuiButton.prototype.getTex = function() {
	return this.tex;
}

GuiButton.prototype.isPointInside = function(pos) {
	var posButton = {
		x: this.parentWindow.getPos().x + this.pos.x, 
		y: this.parentWindow.getPos().y + this.pos.y 
	}
	if(pos[0] > posButton.x && pos[0] < posButton.x + this.size.x && pos[1] > posButton.y && pos[1] < posButton.y + this.size.y)
		return true;
	return false;
}

GuiButton.prototype.initTextTex = function() {
	var c = document.createElement("canvas");
	c.width = 256;
	c.height = 64;
	var ctx = c.getContext("2d"); 
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font="40px Arial";
	ctx.fillText(this.text, 10, 50);
	gl.bindTexture(gl.TEXTURE_2D, this.textTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

GuiButton.prototype.setParentWindow = function(guiWindow) {
	this.parentWindow = guiWindow;
}

GuiButton.prototype.getParentWindow = function() {
	return this.parentWindow;
}

