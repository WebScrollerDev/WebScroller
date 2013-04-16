
//-------------------------BASELIGHT--------------------------//

LightBase = function(pos, color) {
	
	this.pos = {
		x: pos[0], 
		y: pos[1],
		z: pos[2]
	}
	
	this.color = {
		r: color[0], 
		g: color[1], 
		b: color[2]
	}
};

LightBase.prototype = {
	getPosition: function() {
		return this.pos;
	}, 
	
	getColor: function() {
		return this.color;
	},

	setPosition: function(newPos) {
		this.pos = newPos;
	}, 
	
	setColor: function(newColor) {
		this.color = newColor;
	}
};

//-----------------------FLICKERING LIGHT------------------------//
//					        x,y  rgb		ms				ms			  float <= 1		 float >= 0
LightFlickering = function(pos, color, flickerSpeed, flickerSpeedSpan, intensityMaxValue, intensityMinValue) {
	LightFlickering.baseConstructor.call(this, pos, color);
	
	this.flickerSpeed = flickerSpeed;
	this.flickerSpeedSpan = flickerSpeedSpan;
	
	this.intensityChange = {
		UP: 0,
		DOWN: 1
	};
	this.intensityValues = {
		MAX: intensityMaxValue,
		MIN: intensityMinValue
	};
	
	this.currentIntensity = this.intensityValues.MAX;	// max 1 min 0
	this.intensityChangeStatus = this.intensityChange.DOWN;
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateInterval = setInterval(function(){_this.updateLight()}, (_this.flickerSpeed + (Math.random()*2 -1)*_this.flickerSpeedSpan) );
};

InheritenceManager.extend(LightFlickering, LightBase);

//------------------------GET FUNCTIONS-------------------------//
LightFlickering.prototype.getCurrentIntensity = function() {
	return this.currentIntensity;
};

LightFlickering.prototype.getintensityChangeStatus = function() {
	return this.intensityChangeStatus;
};

LightFlickering.prototype.getFlickerSpeed = function() {
	return this.flickerSpeed;
};

LightFlickering.prototype.getFlickerSpeedSpan = function() {
	return this.flickerSpeedSpan;
};

//------------------------SET FUNCTIONS-------------------------//
LightFlickering.prototype.setCurrentIntensity = function(newIntensity) {
	this.currentIntensity = newIntensity;
};

LightFlickering.prototype.setintensityChangeStatus = function(newStatus) {
	this.intensityChangeStatus = newStatus;
};

LightFlickering.prototype.setFlickerSpeed = function(newSpeed) { // requires resetFlicering to work
	this.flickerSpeed = newSpeed;
};

LightFlickering.prototype.setFlickerSpeedSpan = function(newSpeedSpan) {  // requires resetFlicering to work
	this.flickerSpeedSpan = newSpeedSpan;
};

//--------------------START/STOP FLICKERING---------------------//
LightFlickering.prototype.stopFlickering = function() {
	clearinterval(this.UpdateInterval);
};

LightFlickering.prototype.startFlickering = function() {
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateInterval = setInterval(function(){_this.updateLight()}, (_this.flickerSpeed + (Math.random()*2 -1)*_this.flickerSpeedSpan) );
};

LightFlickering.prototype.resetFlickering = function() {
	this.currentIntensity = this.intensityValues.MAX;	// max 1 min 0
	this.intensityChangeStatus = this.intensityChange.DOWN;
	clearinterval(this.UpdateInterval);
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateInterval = setInterval(function(){_this.updateLight()}, (_this.flickerSpeed + (Math.random()*2 -1)*_this.flickerSpeedSpan) );
};

//----------------------UPDATE FUNCTION-----------------------//
LightFlickering.prototype.updateLight = function() {
	
	if(this.intensityChangeStatus == UP) {
		this.currentIntensity += 0.01;
		if(this.currentIntensity >= this.intensityValues.MAX)
			this.intensityChangeStatus = this.intensityChange.DOWN;
	}
	else if(this.intensityChangeStatus == DOWN) {
		this.currentIntensity -= 0.01;
		if(this.currentIntensity <= this.intensityValues.MIN)
			this.intensityChangeStatus = this.intensityChange.UP;
	}
};