//Obstacles

ObstacleManager = function(gameSize, groundHeight, arr) {

	var self = this;
	var add = gameSize.x / 2;

	this.gameSize = gameSize;

	this.boxes = [];
	for (var i=0; i<arr.length; i++) {
		var box = arr[i];
		this.boxes.push(new Box(add + (box.pos_x * GRID), box.pos_y, box.type));
	}
}

ObstacleManager.prototype.move = function(step) {
	for (var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].move(step);
	}
}
ObstacleManager.prototype.draw = function(ctx) {
	for (var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].draw(ctx);
	}
}

//Custom methods

ObstacleManager.prototype.checkObstacleOffScreen = function() {
	if (this.boxes[this.boxes.length-1].pos.x + this.boxes[this.boxes.length-1].size.x < 0 ) {
		for (var i = 0; i < this.boxes.length; i++) {
			// delete this.boxes[i];
		}
	}
}

ObstacleManager.prototype.checkCollision = function(player) {
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

Box = function(offset, grid_from, type) {
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
Box.prototype.move = function(step) {
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