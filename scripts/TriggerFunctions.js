function playerBounceFunc(owner) {
	world.player.setVelocityY(30);
	owner.changeStatus(1);
};

function waveFunc(owner) {
	var playerPos = world.getPlayerPos();
	var playerSize = world.getPlayerSize();
	var playerCenterPos = {
		x: playerPos.x + playerSize.x/2,
		y: playerPos.y + playerSize.y/2
	}
	var waterColumnIndex = Math.round( (playerPos.x - owner.getPosition().x)/owner.getWaterColumnSpacing() );
	var diff = Math.abs( (owner.getPosition().y + owner.getWaterColumnOnIndex(waterColumnIndex).getCurrHeight()) - playerCenterPos.y );
	if(diff < 20) {
		var playerVel = world.getPlayerVel()[1];
		owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel);
	}
};
	