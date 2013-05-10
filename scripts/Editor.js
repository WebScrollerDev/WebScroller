Editor = function() {
	this.windowType = {
		main: 0, 
		createWorld: 1, 
		selectWorld: 2, 
		tile: 3
	}
	
	this.windows = [];
	this.setupWindows();
	
	this.currWindow = this.windows[this.windowType.main];
	
}

Editor.prototype = {
	setupWindows: function() {
		
		var this_ = this;
		
		var backButton = new GuiButton(0, [100, 100], [128, 32], "Back To Menu", "resources/gui/buttonInActive.png");
		backButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.main];
		}
		
		var mainMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		var createWorldButton = new GuiButton(1, [50, 400], [128, 32], "Create World", "resources/gui/buttonInActive.png");
		createWorldButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.createWorld];
		}
		mainMenu.addButton(createWorldButton);
		var selectWorldButton = new GuiButton(2, [50, 350], [128, 32], "Select World", "resources/gui/buttonInActive.png");
		selectWorldButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.selectWorld];
		}
		mainMenu.addButton(selectWorldButton);
		var TileButton = new GuiButton(3, [50, 300], [128, 32], "See Tiles", "resources/gui/buttonInActive.png");
		TileButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.tile];
		}
		mainMenu.addButton(TileButton);
		
		this.windows[this.windowType.main] = mainMenu;
		
		var createWorldMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		createWorldMenu.addButton(backButton);
		this.windows[this.windowType.createWorld] = createWorldMenu;
		
		var selectWorldMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		selectWorldMenu.addButton(backButton);
		this.windows[this.windowType.selectWorld] = selectWorldMenu;
		
		var tileMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		tileMenu.addButton(backButton);
		this.windows[this.windowType.tile] = tileMenu;
	},
	
	getCurrentWindow: function() {
		return this.currWindow;
	}, 
	
	mouseUp: function(event) {
		var buttons = this.currWindow.getButtons();
		for(var i = 0; i < buttons.length; i++) {
			if(!buttons[i].isHidden && buttons[i].isPointInside([event.clientX, gl.viewportHeight - event.clientY]))
				if(buttons[i].onClick != null)
					buttons[i].onClick();
		}
	}
}
