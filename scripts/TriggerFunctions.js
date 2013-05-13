function playerBounceFunc(owner) {
	world.player.setVelocityY(30);
	owner.changeStatus(1);
};

function waveFunc(owner) {
	
	//console.log(owner.waterColumns);
	
	
	var playerPos = world.getPlayerPos();
	var playerSize = world.getPlayerSize();
	var playerCenterPos = {
		x: playerPos.x + playerSize.x/2,
		y: playerPos.y + playerSize.y/2
	}
	console.log("owner: " + owner.getPosition().x);
	console.log("playerPos: " + playerPos.x);
	console.log("Spacing: " + owner.getWaterColumnSpacing());
	var waterColumnIndex = Math.round( (playerCenterPos.x - owner.getPosition().x)/owner.getWaterColumnSpacing() );
	console.log("index: " + waterColumnIndex);
	if(waterColumnIndex > 0 && waterColumnIndex < owner.waterColumns.length) {
		var diff = Math.abs( (owner.getPosition().y + owner.getWaterColumnOnIndex(waterColumnIndex).getCurrHeight()) - playerCenterPos.y );
		if(diff < 20) {
			var playerVel = world.getPlayerVel()[1];
			owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel);
		}
	}
};