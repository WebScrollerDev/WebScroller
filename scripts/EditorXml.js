var worlds = new Array();
var bgTiles = new Array();
var mgTiles = new Array();
var fgTiles = new Array();

var bgLoaded = false;
var mgLoaded = false;
var fgLoaded = false;

function loadTiles() {
	$.ajax({
    	type: "GET",
    	url: "config/bgTiles.xml",
    	dataType: "xml",
    	success: loadBgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/mgTiles.xml",
    	dataType: "xml",
    	success: loadMgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/fgTiles.xml",
    	dataType: "xml",
    	success: loadFgTiles
  	});
}

function loadBgTiles(xml) {
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				var size = {
					x: parseInt($(this).find("X").text()), 
					y: parseInt($(this).find("Y").text())
				}
				
				tile.setSize(size);
			});
			//console.log("Adding tile to tiles");
			bgTiles[id] = tile;
		});
	});
	//world.setTiles(tiles);
	bgLoaded = true;
	//loadWorldsXml();
}

function loadMgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			$(this).find("Size").each(function() {
				var size = {
					x: parseInt($(this).find("X").text()), 
					y: parseInt($(this).find("Y").text())
				}
				
				tile.setSize(size);
			});
			
			
			//console.log("Adding tile to tiles");
			mgTiles[id] = tile;
		});
	});
	//world.setTiles(tiles);
	mgLoaded = true;
	//loadWorldsXml();
}

function loadFgTiles(xml) {
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile($(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			
			$(this).find("Size").each(function() {
				var size = {
					x: parseInt($(this).find("X").text()), 
					y: parseInt($(this).find("Y").text())
				}
				
				tile.setSize(size);
			});
			
			
			//console.log("Adding tile to tiles");
			fgTiles[id] = tile;
		});
	});
	//world.setTiles(tiles);
	fgLoaded = true;
	//loadWorldsXml();
}

