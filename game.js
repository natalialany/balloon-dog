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

		loadJSON(function(response) {
	  		// Parse JSON string into object
			var actual_JSON = JSON.parse(response);
			var arr = Object.keys(actual_JSON).map(function(k) { return actual_JSON[k] });

			self.keyboarder = new Keyboarder();

			self.player = new Player( { x: 20, y: config.gameSize.y - config.groundHeight } );

			self.obstacleManager = new ObstacleManager( config.gameSize, config.groundHeight, arr);

			//game loop
			var tick = function() {
				self.update(config);
				self.draw(ctx, config);
				requestAnimationFrame(tick);
			};
			tick();
		});
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
		var gravity = 1;
		var keys = this.keyboarder.getKeys();
		var player_standing = false;

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
			if ( results.y != -1 || this.player.getPos().y > config.gameSize.y - config.groundHeight) {
				this.player.gravity(-1);
				player_standing = true;
				break;
			}
		}

		this.player.setStanding(player_standing);
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


 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
	xobj.open('GET', 'levels/level_01.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
        	// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
 }