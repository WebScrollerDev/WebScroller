var rainOn = true;
var rainMult = 1.0;


MainMenu = function() {
	this.windowType = {
		main: 0, 
		settings: 1
	}
	
	this.windows = [];
	this.setupWindows();
	
	this.currWindow = this.windows[this.windowType.main];
	
}

MainMenu.prototype = {
	setupWindows: function() {
		
		var this_ = this;
		
		var mainMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		
		for(var i = 0; i < 2; i++) {
			var tmpButton = new GuiButton(i, [50, 100 + i*50], [128, 32], "World " + (i + 1), "resources/gui/buttonInActive.png");
			tmpButton.onClick = function() {
				loadXml(this.id);
			}
			mainMenu.addButton(tmpButton);
		}
		var settingsButton = new GuiButton(i, [gl.viewportWidth - 170, 100], [128, 32], "Settings", "resources/gui/buttonInActive.png");
		settingsButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.settings];
		}
		mainMenu.addButton(settingsButton);
		this.windows[this.windowType.main] = mainMenu;
		
		var settingsMenu = new Window([0, 0], [gl.viewportWidth, gl.viewportHeight], "resources/gui/mainMenu.png");
		
		//--------------------------Settings widgets--------------------------------------//
		settingsMenu.addTextWidget(new GuiText([(gl.viewportWidth/2)-(128/2), 50], [128, 32], "Rain"));
		var rainLowButton = new GuiButton(0, [(gl.viewportWidth/2)-(128/2)-150, 150], [80, 32], "Low", "resources/gui/buttonInActive.png");
		rainLowButton.onClick = function() {
			rainMult = 0.5;
			this.changeTex("resources/gui/buttonActive.png");
			this.parentWindow.getButtons()[1].changeTex("resources/gui/buttonInActive.png");
			this.parentWindow.getButtons()[2].changeTex("resources/gui/buttonInActive.png");
		}
		var rainMediumButton = new GuiButton(1, [(gl.viewportWidth/2)-(128/2), 150], [100, 32], "Medium", "resources/gui/buttonActive.png");
		rainMediumButton.onClick = function() {
			rainMult = 1.0;
			this.changeTex("resources/gui/buttonActive.png");
			this.parentWindow.getButtons()[0].changeTex("resources/gui/buttonInActive.png");
			this.parentWindow.getButtons()[2].changeTex("resources/gui/buttonInActive.png");
		}
		var rainHighButton = new GuiButton(2, [(gl.viewportWidth/2)-(128/2)+150, 150], [80, 32], "High", "resources/gui/buttonInActive.png");
		rainHighButton.onClick = function() {
			rainMult = 2.0;
			this.changeTex("resources/gui/buttonActive.png");
			this.parentWindow.getButtons()[0].changeTex("resources/gui/buttonInActive.png");
			this.parentWindow.getButtons()[1].changeTex("resources/gui/buttonInActive.png");
		}
		
		var rainOnButton = new GuiButton(3, [(gl.viewportWidth/2)-(128/2)-50, 100], [50, 32], "On", "resources/gui/buttonActive.png");
		rainOnButton.onClick = function() {
			rainOn = true;
			rainLowButton.hide(false);
			rainMediumButton.hide(false);
			rainHighButton.hide(false);
			this.changeTex("resources/gui/buttonActive.png");
			this.parentWindow.getButtons()[4].changeTex("resources/gui/buttonInActive.png");
		}
		
		var rainOffButton = new GuiButton(4, [(gl.viewportWidth/2)-(128/2)+50, 100], [50, 32], "Off", "resources/gui/buttonInActive.png");
		rainOffButton.onClick = function() {
			rainOn = false;
			rainLowButton.hide(true);
			rainMediumButton.hide(true);
			rainHighButton.hide(true);
			this.changeTex("resources/gui/buttonActive.png");
			this.parentWindow.getButtons()[3].changeTex("resources/gui/buttonInActive.png");
		}	
		
		var backButton = new GuiButton(0, [50, gl.viewportHeight - 30], [128, 32], "Back", "resources/gui/buttonInActive.png");
		backButton.onClick = function() {
			this_.currWindow = this_.windows[this_.windowType.main];
		}
		
		settingsMenu.addButton(rainLowButton);
		settingsMenu.addButton(rainMediumButton);
		settingsMenu.addButton(rainHighButton);
		settingsMenu.addButton(rainOnButton);
		settingsMenu.addButton(rainOffButton);
		settingsMenu.addButton(backButton);
		this.windows[this.windowType.settings] = settingsMenu;
	},
	
	getCurrentWindow: function() {
		return this.currWindow;
	}, 
	
	mouseUp: function(event) {
		var buttons = this.currWindow.getButtons();
		for(var i = 0; i < buttons.length; i++) {
			if(!buttons[i].isHidden() && buttons[i].isPointInside([event.clientX, gl.viewportHeight - event.clientY]))
				if(buttons[i].onClick != null)
					buttons[i].onClick();
		}
	}
}