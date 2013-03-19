ModelBase = function() {
	this.vertexArray = new Array();
	this.normalArray = new Array();
	this.indexArray = new Array();
	this.texCoordArray = new Array();
	this.colorArray = new Array();

}

ModelBase.prototype = {
	
	getVertexArray: function() {
		if(this.vertexArray.length != 0)
			return this.vertexArray;
		else
			return 0;
	},
	
	getNormalArray: function() {
		if(this.normalArray.length != 0)
			return this.normalArray;
		else
			return 0;
	}, 
	
	getIndexArray: function() {
		if(this.indexArray.length != 0)
			return this.indexArray;
		else
			return 0;
	}, 
	
	getTexCoordArray: function() {
		if(this.texCoordArray.length != 0)
			return this.texCoordArray;
		else
			return 0;
	}, 
	
	getColorArray: function() {
		if(this.colorArray.length != 0)
			return this.colorArray;
		else
			return 0;
	}, 
	
	getNumIndices: function() {
		return this.indexArray.length * 3;
	}, 
	
	getNumVertices: function() {
		return this.vertexArray.length / 3;	
	}
};

InheritenceManager = {};

InheritenceManager.extend = function(subClass, baseClass) {
	function inheritence() { }
	inheritence.prototype = baseClass.prototype;
	subClass.prototype = new inheritence();
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
}

ModelSquare = function(){
	ModelSquare.baseConstructor.call(this);
	
	this.vertexArray = [	0.0, 0.0, 0.0, 
							0.0, 1.0, 0.0, 
							1.0, 0.0, 0.0,  
							1.0, 1.0, 0.0	];
						
	this.texCoordArray = [	0.0, 1.0, 
						   	0.0, 0.0,
							1.0, 1.0,
							1.0, 0.0 ];
							
	this.normalArray = [	0.0, 0.0, 1.0,
							0.0, 0.0, 1.0,
							0.0, 0.0, 1.0,
							0.0, 0.0, 1.0 ];
			
}

InheritenceManager.extend(ModelSquare, ModelBase);


