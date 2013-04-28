
Shadow = function(PointOne, PointTwo) {	// OBS only one side cast shadows, allways go clockwise
	this.anchorPointOne = PointOne;
	this.anchorPointTwo = PointTwo;

	this.changingPointOne = PointOne;
	this.changingPointTwo = PointTwo;
	
	this.active = true;
};

Shadow.prototype = {
	setActive: function(newStatus) {
		this.active = newStatus;
	},
	getActive: function() {
		return this.active;
	},
//------------------------------CHANGINGPOINTS-------------------------//
	setChangingPoints: function(PointOne, PointTwo) {
		this.changingPointOne = pointOne;
		this.changingPointTwo = PointTwo;
	},
	//---------------------SET ONE-----------------------//
	setChangingPointOne: function(newPoint) {
		this.changingPointOne = newPoint;
	},
	setChangingPointOneX: function(newX) {
		this.changingPointOne.x = newX;
	},
	setChangingPointOneY: function(newY) {
		this.changingPointOne.y = newY;
	},
	//---------------------SET TWO-----------------------//
	setChangingPointTwo: function(newPoint) {
		this.changingPointTwo = newPoint;	
	},
	setChangingPointTwoX: function(newX) {
		this.changingPointTwo.x = newX;
	},
	setChangingPointTwoY: function(newY) {
		this.changingPointTwo.y = newY;
	},
	//---------------------GET ONE-----------------------//
	getChangingPointOne: function() {
		return this.changingPointOne;
	},
	getChangingPointOneX: function() {
		return this.changingPointOne.x;
	},
	getChangingPointOneY: function() {
		return this.changingPointOne.y;
	},
	//---------------------GET TWO-----------------------//
	getChangingPointTwo: function() {
		return this.changingPointTwo;
	},
	getChangingPointTwoX: function() {
		return this.changingPointTwo.x;
	},
	getChangingPointTwoY: function() {
		return this.changingPointTwo.y;
	},
//------------------------------ANCHORPOINTS-------------------------//	
	setAnchorPoints: function(PointOne, PointTwo) {
		this.anchorPointOne = pointOne;
		this.anchorPointTwo = PointTwo;		
	},
	//---------------------SET ONE-----------------------//
	setAnchorPointOne: function(newPoint) {
		this.anchorPointOne = newPoint;
	},
	setAnchorPointOneX: function(newX) {
		this.anchorPointOne.x = newX;
	},
	setAnchorPointOneY: function(newY) {
		this.anchorPointOne.y = newY;
	},
	//---------------------SET TWO-----------------------//
	setAnchorPointTwo: function(newPoint) {
		this.anchorPointTwo = newPoint;	
	},
	setAnchorPointTwoX: function(newX) {
		this.anchorPointTwo.x = newX;	
	},
	setAnchorPointTwoY: function(newY) {
		this.anchorPointTwo.y = newY;	
	},
	//---------------------GET ONE-----------------------//
	getAnchorPointOne: function() {
		return this.anchorPointOne;
	},
	getAnchorPointOneX: function() {
		return this.anchorPointOne.x;
	},
	getAnchorPointOneY: function() {
		return this.anchorPointOne.y;
	},
	//---------------------GET TWO-----------------------//
	getAnchorPointTwo: function() {
		return this.anchorPointTwo;
	},
	getAnchorPointTwoX: function() {
		return this.anchorPointTwo.x;
	},
	getAnchorPointTwoY: function() {
		return this.anchorPointTwo.y;
	}
};
