World = function() {
	this.bg = [[0, 0],[1024, 256]];
}

World.prototype = {	
	
	init: function(gl) {
		this.player = new EntityPlayer([gl.viewportWidth/12.5, 0, 0]);
	},
	
	update: function() {
		this.player.update();
	}
}
