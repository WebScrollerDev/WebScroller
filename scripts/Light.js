//----------------------------------------------------------------------------------------------------------//
//-------------------------BASELIGHT------------------------------------------------------------------------//

LightBase = function(pos, color, intensity) {
	
	this.pos = {
		x: pos[0], 
		y: pos[1],
		z: pos[2]
	};
	
	this.color = {	// NO DECIMAL!
		r: color[0], 
		g: color[1], 
		b: color[2]
	};
	
	this.intensity = intensity;
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
	}, 
	
	getIntensity: function() {
		return this.intensity;
	}, 
	
	setIntensity: function(newIntensity) {
		this.intensity = newIntensity;
	}
};
//-------------------------------------------------------------------------------------------------------------//
//-----------------------FLICKERING LIGHT----------------------------------------------------------------------//
//					      x,y,z  rgb	   float			float		  float >= 0		 float <= 1
LightFlickering = function(pos, color, flickerSpeed, flickerSpeedSpan, intensity) {
	LightFlickering.baseConstructor.call(this, pos, color, intensity[1]);
	
	this.flickerSpeed = flickerSpeed;
	this.flickerSpeedSpan = flickerSpeedSpan;
	
	this.intensityChangeDirection = {
		UP: 0,
		DOWN: 1,
		NONE: 2
	};
	this.intensityValues = {
		MIN: intensity[0],
		MAX: intensity[1]
	};
	
	if(this.intensityValues.MAX > this.intensityValues.MIN)
		this.intensityChangeStatus = this.intensityChangeDirection.DOWN;
	else
		this.intensityChangeStatus = this.intensityChangeDirection.NONE;
	
	this.updateInterval = 10;
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateIntensityInterval = setInterval(function(){_this.updateLightIntensity()}, _this.updateInterval );
};

InheritenceManager.extend(LightFlickering, LightBase);

//------------------------GET FUNCTIONS-------------------------//

LightFlickering.prototype.getintensityChangeStatus = function() {
	return this.intensityChangeStatus;
};

LightFlickering.prototype.getFlickerSpeed = function() {
	return this.flickerSpeed;
};

LightFlickering.prototype.getFlickerSpeedSpan = function() {
	return this.flickerSpeedSpan;
};

LightFlickering.prototype.getUpdateInterval = function() {
	return this.updateInterval;
};

//------------------------SET FUNCTIONS-------------------------//
LightFlickering.prototype.setFlickerSpeed = function(newSpeed) {
	this.flickerSpeed = newSpeed;
};

LightFlickering.prototype.setFlickerSpeedSpan = function(newSpan) {
	this.flickerSpeedSpan = newSpan;
};

LightFlickering.prototype.setintensityChangeStatus = function(newStatus) {
	if(this.intensityValues.MAX > this.intensityValues.MIN)	
		this.intensityChangeStatus = newStatus;
	else
		this.intensityChangeStatus = this.intensityChangeDirection.NONE;
};

LightFlickering.prototype.setUpdateInterval = function(newSpeed) { // requires resetUpdate to work
	this.updateInterval = newSpeed;
};

//--------------------START/STOP FLICKERING---------------------//
LightFlickering.prototype.stopUpdating = function() {
	clearinterval(this.UpdateIntensityInterval);
};

LightFlickering.prototype.startUpdating = function() {
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateIntensityInterval = setInterval(function(){_this.updateLightIntensity()}, _this.updateInterval );
};

LightFlickering.prototype.resetUpdating = function() {
	clearinterval(this.UpdateIntensityInterval);
	this.intensity = this.intensityValues.MAX;	// max 1 min 0
	
	if(this.intensityValues.MAX > this.intensityValues.MIN)
		this.intensityChangeStatus = this.intensityChangeDirection.DOWN;
	else
		this.intensityChangeStatus = this.intensityChangeDirection.NONE;
		
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateIntensityInterval = setInterval(function(){_this.updateLightIntensity()}, _this.updateInterval );
};

//----------------------UPDATE FUNCTION-----------------------//
LightFlickering.prototype.updateLightIntensity = function() {

	if(this.intensityChangeStatus == this.intensityChangeDirection.UP) {
		this.intensity += (this.flickerSpeed + (Math.random() * 2 * this.flickerSpeedSpan - this.flickerSpeedSpan));	// A little bit random
		if(this.intensity >= this.intensityValues.MAX)
			this.intensityChangeStatus = this.intensityChangeDirection.DOWN;
	}
	else if(this.intensityChangeStatus == this.intensityChangeDirection.DOWN) {
		this.intensity -= (this.flickerSpeed + (Math.random() * 2 * this.flickerSpeedSpan - this.flickerSpeedSpan));
		if(this.intensity <= this.intensityValues.MIN)
			this.intensityChangeStatus = this.intensityChangeDirection.UP;
	}
};
//-----------------------------------------------------------------------------------------------------------//
//-----------------------MORPHING LIGHT----------------------------------------------------------------------//
//					    x,y,z   []>1      float		    float			  float >= 0		 float <= 1		  float			float
LightMorphing = function(pos, colors, flickerSpeed, flickerSpeedSpan, intensity, morphSpeed, morphSpeedSpan) {
	LightMorphing.baseConstructor.call(this, pos, colors[0], flickerSpeed, flickerSpeedSpan, intensity);
	
	this.morphSpeed = morphSpeed;
	this.morphSpeedSpan = morphSpeedSpan;
	this.colors = colors;
	this.currColorPointer = 0;
	if(this.colors.length > 1)
		this.nextColorPointer = 1;
	else
		this.nextColorPointer = 0;
		
	this.currColor = {
		r: colors[this.currColorPointer][0],
		g: colors[this.currColorPointer][1],
		b: colors[this.currColorPointer][2]
	};
	this.nextColor = {
		r: colors[this.nextColorPointer][0], 
		g: colors[this.nextColorPointer][1], 
		b: colors[this.nextColorPointer][2]
	};
	this.colorChangeDirection = {
		UP: 0,
		DOWN: 1,
		NONE: 2
	};
	
	this.currColorChange = {};

	this.updateCurrColorChange();
	
	this.updateInterval = 10;
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateColorInterval = setInterval(function(){_this.updateLightColor()}, _this.updateInterval );
};

InheritenceManager.extend(LightMorphing, LightFlickering);

//------------------------GET FUNCTIONS-------------------------//
LightMorphing.prototype.getUpdateInterval = function() {
	return this.updateInterval;
};

LightMorphing.prototype.getMorphSpeed = function() {
	return this.morphSpeed;
};

LightMorphing.prototype.getMorphSpeedSpan = function() {
	return this.morphSpeedSpan;
};

LightMorphing.prototype.getColors = function() {
	return this.colors;
};

LightMorphing.prototype.getCurrColor = function() {
	return this.colors[this.currColorPointer];
};

//------------------------SET FUNCTIONS-------------------------//
LightMorphing.prototype.setUpdateInterval = function(newSpeed) { // requires resetUpdate to work
	this.updateInterval = newSpeed;
};

LightMorphing.prototype.setMorphSpeed = function(newSpeed) {
	this.morphSpeed = newSpeed;
};

LightMorphing.prototype.setMorphSpeedSpan = function(newSpeedSpan) {
	this.morphSpeedSpan = newSpeedSpan;
};

LightMorphing.prototype.setColors = function(newColors) {
	
	if(newColors.length <= 1)	// check if enough colors
		return;
	
	this.colors = newColors;
	
	this.currColorPointer = 0;
	if(this.colors.length > 1)
		this.nextColorPointer = 1;
	else
		this.nextColorPointer = 0;
		
	this.currColor.r = this.colors[this.currColorPointer][0];	// reset currColor
	this.currColor.g = this.colors[this.currColorPointer][1];
	this.currColor.b = this.colors[this.currColorPointer][2];
	
	this.nextColor.r = this.colors[this.nextColorPointer][0];	// reset nextColor
	this.nextColor.g = this.colors[this.nextColorPointer][1];
	this.nextColor.b = this.colors[this.nextColorPointer][2];
	
	this.updateCurrColorChange();
};

LightMorphing.prototype.setCurrColorPointer = function(newCurr) {
	if(newCurr < this.colors.length)
		this.currColorPointer = newCurr;
};

//---------------------UPDATE-HELP FUNCTIONS----------------------//
LightMorphing.prototype.updateCurrColorChange = function() {
	// R
	if(this.currColor.r < this.nextColor.r) {			// Do we need to increase
		this.currColorChange.r = this.colorChangeDirection.UP;
	}
	else if(this.currColor.r > this.nextColor.r) {		// Do we need to decrease
		this.currColorChange.r = this.colorChangeDirection.DOWN;
	}
	else {												// Do we need to stay
		this.currColorChange.r = this.colorChangeDirection.NONE;
	}
	// G
	if(this.currColor.g < this.nextColor.g) {
		this.currColorChange.g = this.colorChangeDirection.UP;
	}
	else if(this.currColor.g > this.nextColor.g) {
		this.currColorChange.g = this.colorChangeDirection.DOWN;
	}
	else {
		this.currColorChange.g = this.colorChangeDirection.NONE;
	}
	// B
	if(this.currColor.b < this.nextColor.b) {
		this.currColorChange.b = this.colorChangeDirection.UP;
	}
	else if(this.currColor.b > this.nextColor.b) {
		this.currColorChange.b = this.colorChangeDirection.DOWN;
	}
	else {
		this.currColorChange.b = this.colorChangeDirection.NONE;
	}
};

//---------------------START/STOP MORPHING----------------------//
LightMorphing.prototype.stopUpdating = function() {
	clearinterval(this.UpdateColorInterval);
};

LightMorphing.prototype.startUpdating = function() {
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateColorInterval = setInterval(function(){_this.updateLightColor()}, _this.updateInterval );
};

LightMorphing.prototype.resetUpdating = function() {
	clearinterval(this.UpdateColorInterval);
	
	this.currColorPointer = 0;
	if(this.colors.length > 1)
		this.nextColorPointer = 1;
	else
		this.nextColorPointer = 0;
	
	this.currColor.r = this.colors[this.currColorPointer][0];	// reset currColor
	this.currColor.g = this.colors[this.currColorPointer][1];
	this.currColor.b = this.colors[this.currColorPointer][2];
	
	this.nextColor.r = this.colors[this.nextColorPointer][0];	// reset nextColor
	this.nextColor.g = this.colors[this.nextColorPointer][1];
	this.nextColor.b = this.colors[this.nextColorPointer][2];
	
	this.updateCurrColorChange();
	
	var _this = this; //Needed in setInterval, for specifying the correct this
	this.UpdateColorInterval = setInterval(function(){_this.updateLightColor()}, _this.updateInterval );
};

//----------------------UPDATE FUNCTION-----------------------//
LightMorphing.prototype.updateLightColor = function() {
	
	var interval = this.morphSpeed + ( Math.random() * 2 * this.morphSpeedSpan - this.morphSpeedSpan);
	if(this.currColorChange.r == this.colorChangeDirection.UP) {	// R
		this.currColor.r += interval;
		if( (this.currColor.r + interval) >= this.nextColor.r && (this.currColor.r - interval ) <= this.nextColor.r) // if inside an interval
			this.currColorChange.r = this.colorChangeDirection.NONE;
	}
	else if(this.currColorChange.r == this.colorChangeDirection.DOWN) {
		this.currColor.r -= interval;
		if( (this.currColor.r + interval ) >= this.nextColor.r && (this.currColor.r - interval ) <= this.nextColor.r) // if inside an interval
			this.currColorChange.r = this.colorChangeDirection.NONE;
	}
	
	if(this.currColorChange.g == this.colorChangeDirection.UP) {	// G
		this.currColor.g += interval;
		if( (this.currColor.g + interval) >= this.nextColor.g && (this.currColor.g - interval ) <= this.nextColor.g) // if inside an interval
			this.currColorChange.g = this.colorChangeDirection.NONE;
	}
	else if(this.currColorChange.g == this.colorChangeDirection.DOWN) {
		this.currColor.g -= interval;
		if( (this.currColor.g + interval ) >= this.nextColor.g && (this.currColor.g - interval ) <= this.nextColor.g) // if inside an interval
			this.currColorChange.g = this.colorChangeDirection.NONE;
	}
	
	if(this.currColorChange.b == this.colorChangeDirection.UP) {	// B
		this.currColor.b += interval;
		if( (this.currColor.b + interval ) >= this.nextColor.b && (this.currColor.b - interval ) <= this.nextColor.b) // if inside an interval
			this.currColorChange.b = this.colorChangeDirection.NONE;
	}
	else if(this.currColorChange.b == this.colorChangeDirection.DOWN) {
		this.currColor.b -= interval;
		if( (this.currColor.b + interval ) >= this.nextColor.b && (this.currColor.b - interval ) <= this.nextColor.b) // if inside an interval
			this.currColorChange.b = this.colorChangeDirection.NONE;
	}
	
	if(this.currColorChange.r == this.colorChangeDirection.NONE &&	// if no more changing
	   this.currColorChange.g == this.colorChangeDirection.NONE && 
	   this.currColorChange.b == this.colorChangeDirection.NONE) {

		if(this.currColorPointer + 1 >= this.colors.length)
			this.currColorPointer = 0;
		else
			this.currColorPointer++;
			
		if(this.currColorPointer + 1 >= this.colors.length)
			this.nextColorPointer = 0;
		else
			this.nextColorPointer = this.currColorPointer + 1;
		
		this.nextColor.r = this.colors[this.nextColorPointer][0];	// nextColor
		this.nextColor.g = this.colors[this.nextColorPointer][1];
		this.nextColor.b = this.colors[this.nextColorPointer][2];
		
		this.updateCurrColorChange();
	}
	
	this.color.r = this.currColor.r;	// update the color
	this.color.g = this.currColor.g;
	this.color.b = this.currColor.b;
};
