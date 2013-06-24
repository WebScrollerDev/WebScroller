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
	var waterColumnIndex = Math.round( (playerCenterPos.x - owner.getPosition().x)/owner.getWaterColumnSpacing() );
	if(waterColumnIndex > 0 && waterColumnIndex < owner.waterColumns.length) {
		var diff = Math.abs( (owner.getPosition().y + owner.getWaterColumnOnIndex(waterColumnIndex).getCurrHeight()) - playerCenterPos.y );
		if(diff < 10) {
			var playerVel = world.getPlayerVel()[1];
			if(playerVel < 0) {	// if player is falling down
				owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel);
				if(owner.getSplashColdown() < 0) {
					owner.createSplashAtColumn(waterColumnIndex);
					owner.setSplashColdown(500.);	
				}
			} else	// if player is jumping up
				owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel/2);
		}
	}
};

function waveFunc2(owner) {	
	var playerPos = world.getPlayerPos();
	var playerSize = world.getPlayerSize();
	var playerCenterPos = {
		x: playerPos.x + playerSize.x/2,
		y: playerPos.y + playerSize.y/2
	}
	var waterColumnIndex = Math.round( (playerCenterPos.x - owner.getPosition().x)/owner.getWaterColumnSpacing() );
	if(waterColumnIndex > 0 && waterColumnIndex < owner.waterColumns.length) {
		var diff = Math.abs( (owner.getPosition().y + owner.getWaterColumnOnIndex(waterColumnIndex).getCurrHeight()) - playerCenterPos.y );
		if(diff < 10) {
			var playerVel = world.getPlayerVel()[1];
			if(playerVel < 0) {	// if player is falling down
				owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel);
				world.player.setVelocityY(10);
				if(owner.getSplashColdown() < 0) {
					owner.createSplashAtColumn(waterColumnIndex);
					owner.setSplashColdown(500.);	
				}
			} else	// if player is jumping up
				owner.getWaterColumnOnIndex(waterColumnIndex).increaseVelocityWithValue(playerVel/2);
		}
	}
};