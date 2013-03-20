World = function() {
	this.bg = [[0, 0],[1024, 256]];
	this.player = new EntityPlayer([2, 0, 0]);
}

World.prototype = {	
	update: function() {
		this.player.update();
	}
}
