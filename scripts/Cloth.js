
var physics_accuracy = 5,
player_influence     = 20, 
player_cur           = 6,
gravity              = -900, 
cloth_height         = 3,
cloth_width          = 5,
spacing              = 7,
tear_distance        = 60;


var	cloth;

Cloth = function(clothPosX, clothPosY, clothW, clothH) {
	this.bounds = {
		x: clothW,
		y: clothH
	}
	this.pos = {
		x: clothPosX,
		y: clothPosY
	}
	this.updateTime = 10;
	this.points = [];

	for(var y = 0; y <= cloth_height; y++) {

		for(var x = 0; x <= cloth_width; x++) {

			var p = new Point(this.pos.x + x * spacing, this.pos.y + y * spacing, this.bounds);

			y == 0 && p.pin(p.x, p.y);
			y != 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)]);
			x != 0 && p.attach(this.points[this.points.length - 1]);

			this.points.push(p);
		}
	}

	var _this = this; //Needed in setInterval, for specifying the correct this
	this.updateInterval = setInterval(function(){_this.update()}, _this.updateTime);
};

Cloth.prototype.stopUpdating = function() {
	clearInterval(this.updateInterval);
};

Cloth.prototype.getPoints = function() {
	return this.points;
};

Cloth.prototype.getNumPoints = function() {
	return this.points.length;
};

Cloth.prototype.getPosition = function() {
	return this.pos;
};

Cloth.prototype.update = function() {

	var i = physics_accuracy;

	while(i--) {
		var p = this.points.length;
		while(p--) this.points[p].resolve_constraints();
	}

	i = this.points.length;
	while(i--) this.points[i].update(.016);
};

//-------------------------POINT-------------------------//
var Point = function(x, y, bounds) {
	this.bounds = bounds;
	this.x = x;
	this.y = y;
	this.px = x;
	this.py = y;
	this.vx = 0;
	this.vy = 0;
	this.pin_x = null;
	this.pin_y = null;
	this.constraints = [];
};

Point.prototype.update = function(delta) {

	var diff_x	 = this.x - world.player.getPosition().x,
	diff_y		 = this.y - world.player.getPosition().y,
	dist  		 = Math.sqrt(diff_x * diff_x + diff_y * diff_y);	// distance from player to point

	if(dist < player_influence) {
		this.px = this.x - (world.player.getPosition().x - world.player.getPrevPosition().x) * 1.8;
		this.py = this.y - (world.player.getPosition().y - world.player.getPrevPosition().x) * 1.8;
	}

	this.add_force(0, gravity);

	delta *= delta;
	nx = this.x + ((this.x - this.px) * .99) + ((this.vx / 2) * delta);
	ny = this.y + ((this.y - this.py) * .99) + ((this.vy / 2) * delta);

	this.px = this.x;
	this.py = this.y;

	this.x = nx;
	this.y = ny;

	this.vy = this.vx = 0
};

Point.prototype.resolve_constraints = function() {

	if (this.pin_x != null && this.pin_y != null) {
	
		this.x = this.pin_x;
		this.y = this.pin_y;
		return;
	}

	var i = this.constraints.length;
	while(i--) this.constraints[i].resolve();

	this.x > this.bounds.x ? this.x = 2 * this.bounds.x - this.x : 1 > this.x && (this.x = 2 - this.x);
	this.y < 1 ? this.y = 2 - this.y : this.y > this.bounds.y && (this.y = 2 * this.bounds.y - this.y);
};

Point.prototype.attach = function(point) {

	this.constraints.push(
		new Constraint(this, point)
	);
};

Point.prototype.remove_constraint = function(lnk) {

	var i = this.constraints.length;
	while(i--) if(this.constraints[i] == lnk) this.constraints.splice(i, 1);
};

Point.prototype.add_force = function(x, y )  {

	this.vx += x;
	this.vy += y;
};

Point.prototype.pin = function(pinx, piny) {
	this.pin_x = pinx;
	this.pin_y = piny;
};

//-------------------------CONSTRAINT-------------------------//
var Constraint = function(p1, p2) {

	this.p1 = p1;
	this.p2 = p2;
	this.length = spacing;
};

Constraint.prototype.resolve = function() {

	var diff_x = this.p1.x - this.p2.x,
		diff_y = this.p1.y - this.p2.y,
		dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
		diff = (this.length - dist) / dist;

	if (dist > tear_distance) this.p1.remove_constraint(this);

	var px = diff_x * diff * 0.5;
	var py = diff_y * diff * 0.5;

	this.p1.x += px;
	this.p1.y += py;
	this.p2.x -= px;
	this.p2.y -= py;
};

Constraint.prototype.getPoints = function() {
	var tmpPoints = [];
	tmpPoints.push(this.p1.x, this.p1.y, 0.0, this.p2.x, this.p2.y, 0.0);
	return tmpPoints;
};

Constraint.prototype.draw = function() { // FLYTTA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//	gl.moveTo(this.p1.x, this.p1.y);
	//gl.lineTo(this.p2.x, this.p2.y);
};


