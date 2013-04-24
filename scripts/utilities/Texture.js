Texture = {};

Texture.loadImage = function(gl, path, tex) {
		
	var image = new Image();
	image.onload = function() {
		Texture.handleImage(gl, tex, image);
	}
	image.src = path;
};
	
Texture.handleImage = function(gl, tex, image) {
	
	tex.width = image.width;
	tex.height = image.height;
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	
	// Set the tex-parameters so we can render images with any size by clamping to edges
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	//gl.generateMipmap(gl.TEXTURE_2D);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
};


TextureData = function() { //Class for handling imagedata loading
};

TextureData.prototype = {
	
	loadImage: function(path) {
		var image = new Image();
		this.loaded = false;
		this.data = [];
		var this_ = this;
		image.onload = function() {
			this_.handleImage(image);
		}
		image.src = path;
	},
	
	handleImage: function(image) {
		
		var myCanvas = document.createElement("canvas");
		myCanvas.width = image.width; 
		myCanvas.height = image.height;
		var myCanvasContext = myCanvas.getContext("2d"); // Get canvas 2d context
		myCanvasContext.drawImage(image, 0, 0); // Draw the texture
		this.data = myCanvasContext.getImageData(0,0, myCanvas.width, myCanvas.height); // Read the texels/pixels back
		this.data.width = image.width;
		this.data.height = image.height;
		this.loaded = true;
	},
	
	isLoaded: function() {
		return this.loaded;
	}, 
	
	getData: function() {
		if(this.data.length == 0)
			return 0;
		return this.data;
	}
};
