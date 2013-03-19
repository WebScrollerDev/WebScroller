function Texture() {
	
}

Texture.prototype = {
	
	loadImage: function(gl, path, tex) {
		var image = new Image();
		image.onload = function() {
			handleImage(tex, image);
		}
		image.src = path;
	}, 
	
	handleImage: function(tex, image) {
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
