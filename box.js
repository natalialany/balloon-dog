//Obstacles

Obstacle = function(gameSize, groundHeight) {
	this.movement = 0;
	this.gameSize = gameSize;

	this.boxes = [];
	this.boxes.push(new Box(gameSize, gameSize.x + 50, 8, 0));
	this.boxes.push(new Box(gameSize, gameSize.x + 100, 8, 0));
	this.boxes.push(new Box(gameSize, gameSize.x + 150, 8, 0));

	this.boxes.push(new Box(gameSize, gameSize.x + 50, 5, 1));
	this.boxes.push(new Box(gameSize, gameSize.x + 100, 5, 1));
	this.boxes.push(new Box(gameSize, gameSize.x + 150, 5, 1));
}

Obstacle.prototype.move = function(step) {
	this.movement += step;

	for (var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].update(step);
	}
}
Obstacle.prototype.draw = function(ctx) {
	for (var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].draw(ctx, this.movement);
	}
}

//Custom methods

Obstacle.prototype.checkObstacleOffScreen = function() {
	if (this.boxes[this.boxes.length-1].pos.x + this.boxes[this.boxes.length-1].size.x < 0 ) {
		this.movement = 0;
		for (var i = 0; i < this.boxes.length; i++) {
			this.boxes[i].resetPosition();
		}
	}
}

Obstacle.prototype.checkCollision = function(player) {
	var results = { x: -1, y: -1};

	var player_grid = { from: ( ( player.y - player.sy ) / GRID ), to: ( ( player.y ) / GRID ) };

	for (var i = 0; i < this.boxes.length; i++) {

		var box = this.boxes[i].getPos();
		var box_grid = this.boxes[i].getGrid();
		var type = this.boxes[i].getType();

		// console.log('player ' + player_grid.from + ' - ', player_grid.to + ' box ' + box_grid.from + ' - ', box_grid.to);

		if (type==0) {

			// X left
			if ( player.x + player.sx > box.x ) {

				//X right
				if ( player.x <= box.x + this.boxes[i].size.x ) {
					//Y top & bottom
					if (player_grid.to > box_grid.from && player_grid.from < box_grid.to) {
						results.x = box.x;
					}
				}
			}

			// X left
			if ( player.x + player.sx > box.x ) {
				
				//X right
				if ( player.x <= box.x + this.boxes[i].size.x ) {
					// Y
					// if (player_grid.to > box_grid.from && player_grid.from < box_grid.to && player.y >= results.y) {
					if (player_grid.to === box_grid.from && player.y >= results.y) {
						results.y = box_grid.from * GRID;
					}
				}
			}

		} else if (type==1) {

			// X left
			if ( player.x + player.sx > box.x ) {
				
				//X right
				if ( player.x <= box.x + this.boxes[i].size.x ) {
					// Y
					// if (player_grid.to > box_grid.from && player_grid.from < box_grid.to && player.y >= results.y) {
					if (player_grid.to === box_grid.from && player.y >= results.y) {
						results.y = box_grid.from * GRID;
					}
				}
			}

		}


	}

	return results;
}


//Boxes

Box = function(gameSize, offset, grid_from, type) {
	this.gameSize = gameSize;
	this.size = {x: 50, y: 50};
	this.grid = { from: grid_from, to: grid_from + 1 };
	this.pos = { x: offset, y: this.grid.from * GRID };
	this.type = type;
}

Box.prototype.draw = function(ctx) {

	var color = "Red";

	switch (this.type) {
		case 0: color = "Black"; break;
		case 1: color = "Blue"; break;
	}

	ctx.fillStyle = color;
	ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
}
Box.prototype.update = function(step) {
	this.pos.x += step;
}

//Custom
Box.prototype.getPos = function() {
	return { x: this.pos.x, y: this.pos.y };
}
Box.prototype.getGrid = function() {
	return this.grid;
}
Box.prototype.getType = function() {
	return this.type;
}

Box.prototype.resetPosition = function() {
	this.pos.x += this.gameSize.x * 1.2;
}