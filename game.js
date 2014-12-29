var KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40 };
var GRID = 50;

;(function() {

	var Game = function(nodeId) {

		var self = this;
		var canvas = document.getElementById(nodeId);
		var ctx = canvas.getContext('2d');

		var config = {
			gravity: 3,
			step: 3,
			groundHeight: 50,
			gameSize: { x: canvas.width, y: canvas.height },
		};

		this.keyboarder = new Keyboarder();

		this.player = new Player( { x: 20, y: config.gameSize.y - config.groundHeight } );

		this.obstacleManager = new ObstacleManager( config.gameSize, config.groundHeight);


		//game loop
		var tick = function() {
			self.update(config);
			self.draw(ctx, config);
			requestAnimationFrame(tick);
		};
		tick();


	};

	Game.prototype.draw = function(ctx, config) {

		ctx.clearRect(0, 0, config.gameSize.x, config.gameSize.y);

		//sky
		ctx.fillStyle = "DeepSkyBlue";
		ctx.fillRect(0, 0, config.gameSize.x, config.gameSize.y);

		//ground
		ctx.fillStyle = "DarkGreen";
		ctx.fillRect(0, config.gameSize.y - config.groundHeight, config.gameSize.x, config.groundHeight);

		//boxes
		this.obstacleManager.draw(ctx);

		//player
		this.player.draw(ctx);

		//debug - grid
		ctx.fillStyle = "Red";
		for (var i=0; i<config.gameSize.x/GRID; i++) {
			for (var j=0; j<config.gameSize.y/GRID; j++) {
				ctx.fillRect(i*GRID, j*GRID, 2, 2);
				ctx.fillText(j, i*GRID, j*GRID);
			}
		}
	};

	Game.prototype.update = function(config) {

		var step = 0;
		var keys = this.keyboarder.getKeys();

		//player
		this.player.update(keys);


		//step
		if (keys[KEYS.RIGHT]) {
			step = config.step;
		}

		//obstacles
		for (var i=0; i<step; i++) {
			
			//obstacles
			this.obstacleManager.move(-1);

			//collisions with boxes
			var results = this.obstacleManager.checkCollision(this.player.getCollisionArea());
			if ( results.x != -1 ) {
				this.obstacleManager.move(1);
				break;
			}
		}
		this.obstacleManager.checkObstacleOffScreen();

		for (var i=0; i<config.gravity; i++) {
			
			//obstacles
			this.player.gravity(1);

			//collisions with boxes
			var results = this.obstacleManager.checkCollision(this.player.getCollisionArea());
			if ( results.y != -1 ) {
				this.player.gravity(-1);
				break;
			}
		}

		//collisions with ground
		if (this.player.getPos().y > config.gameSize.y - config.groundHeight) {
			this.player.setPos_y(config.gameSize.y - config.groundHeight);
		}

	};

	window.onload = function() {
		new Game("screen");
	};

	var Keyboarder = function() {
		var keyState = {};

		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		};
		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		};

		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		}
		this.getKeys = function() {
			return keyState;
		}
	};

})();