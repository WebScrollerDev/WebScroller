GuiButton = function(pos, size, text) {
	this.pos = {
		x: pos[0], 
		y: pos[1]
	}
	
	this.size = {
		x: size[0], 
		y: size[1]
	}
	
	this.text = text;
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


