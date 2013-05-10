MainMenu = function() {
	this.windowType = {
		main: 0
	}
	
	this.windows = [];
	this.setupWindows();
	
	this.currWindow = this.windows[this.windowType.main];
	
}

MainMenu.prototype = {
	setupWindows: function() {
		
		var this_ = this;
		
		var mainMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/editor/mainMenu.png");
		
		for(var i = 0; i < 2; i++) {
			var tmpButton = new GuiButton(i, [50, 100 + i*50], [128, 32], "World " + (i + 1), "resources/editor/button1.png");
			tmpButton.onClick = function() {
				loadXml(this.id);
			}
			mainMenu.addButton(tmpButton);
		}
		this.windows[this.windowType.main] = mainMenu;
	},
	
	getCurrentWindow: function() {
		return this.currWindow;
	}, 
	
	mouseUp: function(event) {
		var buttons = this.currWindow.getButtons();
		for(var i = 0; i < buttons.length; i++) {
			if(buttons[i].isPointInside([event.clientX, gl.viewportHeight - event.clientY]))
				if(buttons[i].onClick != null)
					buttons[i].onClick();
		}
	}
}