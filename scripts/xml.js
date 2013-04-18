var tilesBg = new Array();
var tilesMg = new Array();
var tilesFg = new Array();

var obbs = new Array();

var bg = false;
var mg = false;
var fg = false;
var doneLoading = false;
function loadXml() {
	$.ajax({
    	type: "GET",
    	url: "config/mgTiles.xml",
    	dataType: "xml",
    	success: parseMgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/bgTiles.xml",
    	dataType: "xml",
    	success: parseBgTiles
  	});
  	
  	$.ajax({
    	type: "GET",
    	url: "config/fgTiles.xml",
    	dataType: "xml",
    	success: parseFgTiles
  	});
}

function loadWorldXml() {
	
	if(bg && mg && fg) {
		$.ajax({
	    	type: "GET",
	    	url: "config/worlds.xml",
	    	dataType: "xml",
	    	success: parseWorlds
	  	});
	}
}

function parseWorlds(xml) {
	$(xml).find("Worlds").each(function() {
		$(this).find("World").each(function() {
			$(this).find("TilesBg").each(function() {
				var tilesPlaceable = new Array();
				$(this).find("Tile").each(function() {
					var id = parseInt($(this).find("Id").text());
					var pos;
					$(this).find("Pos").each(function() {
						pos = [parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())];
					});
					var tilePlaceable = new TilePlaceable(tilesBg[id], pos);
					tilesPlaceable.push(tilePlaceable);
				});
				world.setTilesBg(tilesPlaceable);
			});
			
			$(this).find("TilesMg").each(function() {
				var tilesPlaceable = new Array();
				$(this).find("Tile").each(function() {
					var id = parseInt($(this).find("Id").text());
					var pos;
					$(this).find("Pos").each(function() {
						pos = [parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())];
					});
					var tilePlaceable;
					if(obbs[id] != null) {
						tilePlaceable = new TilePlaceable(tilesMg[id], pos);
						tilePlaceable.addBoundingBox(new OBB(pos, obbs[id].center, obbs[id].size, obbs[id].angle));
					} else
						tilePlaceable = new TilePlaceable(tilesMg[id], pos);
					tilesPlaceable.push(tilePlaceable);
				});
				world.setTilesMg(tilesPlaceable);
			});
			
			$(this).find("TilesFg").each(function() {
				var tilesPlaceable = new Array();
				$(this).find("Tile").each(function() {
					var id = parseInt($(this).find("Id").text());
					var pos;
					$(this).find("Pos").each(function() {
						pos = [parseInt($(this).find("X").text()), parseInt($(this).find("Y").text())];
					});
					var tilePlaceable = new TilePlaceable(tilesFg[id], pos);
					tilesPlaceable.push(tilePlaceable);
				});
				world.setTilesFg(tilesPlaceable);
			});
		});
	});
	doneLoading = true;
}

function parseMgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile(gl, $(this).find("Url").text());
			var id = parseInt($(this).find("Id").text());
			var sizeX, sizeY;
			if($(this).find("BoundingType").text() == "obb") {
				//var minX, maxX, minY, maxY;
				var bbCenter = [];
				var bbSize = [];
				var bbAngle;
				$(this).find("BoundingBox").each(function() {
					
					$(this).find("Size").each(function() {
						bbSize[0] = parseInt($(this).find("X").text());
						bbSize[1] = parseInt($(this).find("Y").text());
					});
					
					$(this).find("Center").each(function() {
						bbCenter[0] = parseInt($(this).find("X").text());
						bbCenter[1] = parseInt($(this).find("Y").text());
					});
					
					bbAngle = (parseInt($(this).find("Angle").text())*3.14)/180;
				});
				var obbTmp = {
					center: bbCenter, 
					size: bbSize, 
					angle: bbAngle
				}
				obbs[id] = obbTmp;
				//tile.addBoundingBox(new OBB(bbCenter, bbSize, bbAngle));
			}
			
			$(this).find("Size").each(function() {
				var size = {
					x: parseInt($(this).find("X").text()), 
					y: parseInt($(this).find("Y").text())
				}
				
				tile.setSize(size);
			});
			
			
			//console.log("Adding tile to tiles");
			tilesMg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	mg = true;
	loadWorldXml();
}

function parseBgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile(gl, $(this).find("Url").text());
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
			tilesBg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	bg = true;
	loadWorldXml();
}

function parseFgTiles(xml)
{
	//var tiles = new Array();
	$(xml).find("Tiles").each(function() {
		$(this).find("Tile").each(function() {
			var tile = new Tile(gl, $(this).find("Url").text());
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
			tilesFg[id] = tile;
		});
	});
	//world.setTiles(tiles);
	fg = true;
	loadWorldXml();
}
