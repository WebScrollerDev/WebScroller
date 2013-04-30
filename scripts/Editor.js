Editor = function() {
	this.windowType = {
		main: 0, 
		tile: 1
	}
	
	this.windows = [];
	this.setupWindows();
	
	this.prevWindow = this.windows[this.windowType.main];
	this.currWindow = this.windows[this.windowType.main];
	
}

Editor.prototype = {
	setupWindows: function() {
		var mainMenu = new Window("resources/editor/mainMenu.png");
		mainMenu.addButton(new GuiButton([100, 100], [50, 20], "KNAPP"));
		this.windows[this.windowType.main] = mainMenu;
	},
	
	getCurrentWindow: function() {
		return this.currWindow;
	}
}
