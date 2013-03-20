InheritenceManager = {};

InheritenceManager.extend = function(subClass, baseClass) {
	function inheritence() { }
	inheritence.prototype = baseClass.prototype;
	subClass.prototype = new inheritence();
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
};