var Player = function(startPosition) {

	var self = this;

	this.img = new Image();
  	this.img.src = 'character.png';

  	this.size = { x: this.img.width, y: this.img.height };
  	this.img.onload = function() {
	  self.size = { x: self.img.width, y: self.img.height };
	};
  	
  	this.pos = startPosition;

  	this.config = {
  		jump: {
  			y: 120,
  			x: 30
  		}
  	};

  	this.states = { DEFAULT: 0, JUMP: 1 };
  	this.state = this.states.DEFAULT;

  	this.jump_counter = 0;
  	this.last_pos_y = 0;

  	this.jump_key_released = true;
  	this.standing = false;

};

Player.prototype.draw = function(ctx) {
	ctx.drawImage( this.img, this.pos.x, this.pos.y - this.size.y );
}
Player.prototype.update = function(keys) {

	switch (this.state) {

		case this.states.DEFAULT:

			if (keys[KEYS.SPACE] && this.standing && this.jump_key_released) {
				this.jump();
				this.jump_key_released = false;
			}
			if (!keys[KEYS.SPACE]) {
				this.jump_key_released = true;
			}

		break;

		case this.states.JUMP:

			this.jump_counter++;

			var new_move_y = -(this.config.jump.y * Math.sin( (this.jump_counter * Math.PI) / this.config.jump.x ) );
			this.pos.y = this.pos_y_before_jump + new_move_y;

			if ( this.jump_counter >= this.config.jump.x / 2) {
				this.state = this.states.DEFAULT;
			}
		break;
	}
}
//Custom methods
Player.prototype.jump = function() {
	this.state = this.states.JUMP;
	this.jump_counter = 0;
	this.pos_y_before_jump = this.pos.y;
}
Player.prototype.getPos = function() {
	return { x: this.pos.x, y: this.pos.y };
}
Player.prototype.getCollisionArea = function() {
	return { x: this.pos.x, y: this.pos.y, sx: 82, sy: this.size.y };
}
Player.prototype.gravity = function(value) {
	this.pos.y += value;
}
Player.prototype.getGrid = function(grid) {
	return { y: Math.floor(this.pos.y/grid) };
}
Player.prototype.setStanding = function(value) {
	this.standing = value;
}