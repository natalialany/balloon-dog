//Obstacles

ObstacleManager = function(gameSize, groundHeight, arr) {

	var add = gameSize.x - GRID;

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

ObstacleManager.prototype.checkCollision = function(player) {
	var results = { x: -1, y: -1};

	var player_grid = { from: ( ( player.y - player.sy ) / GRID ), to: ( ( player.y ) / GRID ) };

	for (var i = 0; i < this.boxes.length; i++) {

		var box = this.boxes[i].getPos();
		var box_grid = this.boxes[i].getGrid();
		var type = this.boxes[i].getType();

		// console.log('player ' + player_grid.from + ' - ', player_grid.to + ' box ' + box_grid.from + ' - ', box_grid.to);


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

	return results;
}

ObstacleManager.prototype.isCollisionX = function(player) {

	var player_grid = { from: ( ( player.y - player.sy ) / GRID ), to: ( ( player.y ) / GRID ) };

	for (var i = 0; i < this.boxes.length; i++) {

		var b = this.boxes[i].getCollisionArea();

		// X left & X right
		if ( player.x + player.sx > b.x && player.x <= b.dx) {

			//Y top & bottom
			if ( (player_grid.to > b.y) && (player_grid.from < b.dy) && (b.dy !== b.y) ) {
				return true;
			}
		}
	}
	return false;
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
Box.prototype.getCollisionArea = function() {
	var area = { x: this.pos.x, y: this.grid.from, dx: this.pos.x + this.size.x, dy: this.grid.to };
	switch (this.type) {
		case 0: break;
		case 1: area.dy = area.y; break;
	}
	return area;
}