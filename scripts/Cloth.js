
var physics_accuracy = 2,
player_influence     = 20, 
player_cut           = 6,
gravity              = -900,
spacing              = 14,
tear_distance        = 60;


Cloth = function(clothPosX, clothPosY, clothW, clothH) {
	this.size = {
		x: clothW,
		y: clothH
	}
	this.pos = {
		x: clothPosX,
		y: clothPosY
	}
	this.updateTime = 10;
	this.points = [];

	for(var y = 0; y <= this.size.y; y++) {

		for(var x = 0; x <= this.size.x; x++) {

			var p = new Point(this.pos.x + x * spacing, this.pos.y + y * spacing, this.size);


			if(y == 0) {
				p.pin(p.x, p.y);
			} else {
				p.attach(this.points[x + (y - 1) * (this.size.x + 1)]);
			}
			if(x != 0){
				p.attach(this.points[this.points.length - 1]);
			}
			this.points.push(p);
		}
	}
	//console.log(this.points.length);

	var _this = this; //Needed in setInterval, for specifying the correct this
	this.updateInterval = setInterval(function(){_this.update()}, _this.updateTime);
};

Cloth.prototype = {
	
	stopUpdating: function() {
		clearInterval(this.updateInterval);
	},
	
	getPoints: function() {
		return this.points;
	},
	
	getNumPoints: function() {
		return this.points.length;
	}, 
	
	getPosition: function() {
		return this.pos;
	},
	
	update: function() {

		var i = physics_accuracy;
		
		while(i--) {
			//console.log(i);
			var p = this.points.length;
			while(p--) this.points[p].resolve_constraints();
		}
	
		i = this.points.length;
		while(i--) this.points[i].update(.016);
	}
	
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

Point.prototype = {
	update: function(delta) {
	
		var diff_x	 = this.x - world.player.getPosition().x,
		diff_y		 = this.y - world.player.getPosition().y,
		dist  		 = Math.sqrt(diff_x * diff_x + diff_y * diff_y);	// distance from player to point
		
	
		if(dist < player_influence) {
			this.px = this.x - (world.player.getPosition().x - world.player.getPrevPosition().x) * 1.8;
			this.py = this.y - (world.player.getPosition().y - world.player.getPrevPosition().y) * 1.8;
		}
		
		if ((Math.abs(world.player.getVelocity()[0]) > 1 || Math.abs(world.player.getVelocity()[1]) > 2) && dist < player_cut) this.constraints = [];
		
		
	
		this.add_force(0, gravity);
	
		delta *= delta;
		var nx = this.x + ((this.x - this.px) * .99) + ((this.vx / 2) * delta);
		var ny = this.y + ((this.y - this.py) * .99) + ((this.vy / 2) * delta);
	
		this.px = this.x;
		this.py = this.y;
	
		this.x = nx;
		this.y = ny;
	
		this.vy = this.vx = 0
	},
	
	resolve_constraints: function() {
	
		if (this.pin_x != null && this.pin_y != null) {
		
			this.x = this.pin_x;
			this.y = this.pin_y;
			return;
		}
	
		var i = this.constraints.length;
		while(i--) this.constraints[i].resolve();
	}, 
	
	attach: function(point) {
	
		this.constraints.push(
			new Constraint(this, point)
		);
	}, 
	
	remove_constraint: function(lnk) {
	
		var i = this.constraints.length;
		while(i--) if(this.constraints[i] == lnk) this.constraints.splice(i, 1);
	}, 
	
	add_force: function(x, y)  {
	
		this.vx += x;
		this.vy += y;
	}, 
	
	pin: function(pinx, piny) {
		this.pin_x = pinx;
		this.pin_y = piny;
	}
};

//-------------------------CONSTRAINT-------------------------//
var Constraint = function(p1, p2) {

	this.p1 = p1;
	this.p2 = p2;
	this.length = spacing;
};

Constraint.prototype = {
	resolve: function() {

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
	}, 
	
	getPoints: function() {
		var tmpPoints = [];
		tmpPoints.push(this.p1.x, this.p1.y, 0.0, this.p2.x, this.p2.y, 0.0);
		return tmpPoints;
	}
};