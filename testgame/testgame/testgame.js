//set main namespace
goog.provide('testgame');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.character.json');
goog.require('lime.animation.MoveBy');

// entrypoint
testgame.start = function(){
	// initialize variables
	var director = new lime.Director(document.body,1024,768);
	var characterSpriteSheet = new lime.SpriteSheet('assets/character.png',lime.ASSETS.character.json,lime.parser.JSON);
	var scene = new lime.Scene();
	var layer = new lime.Layer().setPosition(512,384).setRenderer(lime.Renderer.CANVAS);	
	var enemies = new Array();
	var enemyCreateInvertal = 150;
	
	// create the log sprite
	var log = new lime.Sprite();
	log.setFill('assets/log.png');
	layer.appendChild(log);
	
	// create the character sprite
	var character = new lime.Sprite().setPosition(0,-100);
	character.setFill(characterSpriteSheet.getFrame('normal.png'));
	layer.appendChild(character);

	// set current scene active
	scene.appendChild(layer);
	director.replaceScene(scene);
	
	var push_left, push_right, push_up, push_down = false;
	// pressing 'left' action
	KeyboardJS.on('a', 
		function(){
			if (push_left == false) {
				push_left = true;
				character.setFill(characterSpriteSheet.getFrame('left.png'));	
			}
		}, 
		function(){
			push_left = false;
			if (KeyboardJS.activeKeys().length == 0) {
				character.setFill(characterSpriteSheet.getFrame('normal.png'));
			}
		}
	);
	
	// pressing 'right' action
	KeyboardJS.on('d', 
		function(){
			if (push_right == false) {
				push_right = true;
				character.setFill(characterSpriteSheet.getFrame('right.png'));
			}
		}, 
		function(){
			push_right = false;
			if (KeyboardJS.activeKeys().length == 0) {
				character.setFill(characterSpriteSheet.getFrame('normal.png'));
			}
		}
	);
	
	// pressing 'up' action
	KeyboardJS.on('w', 
		function(){
			if (push_up == false) {
				push_up = true;
				character.setFill(characterSpriteSheet.getFrame('up.png'));	
			}
		}, 
		function(){
			push_up = false;
			if (KeyboardJS.activeKeys().length == 0) {
				character.setFill(characterSpriteSheet.getFrame('normal.png'));
			}
		}
	);
	
	// pressing 'down' action
	KeyboardJS.on('s', 
		function(){
			if (push_down == false) {
				push_down = true;
				character.setFill(characterSpriteSheet.getFrame('down.png'));	
			}
		}, 
		function(){
			push_down = false;
			if (KeyboardJS.activeKeys().length == 0) {
				character.setFill(characterSpriteSheet.getFrame('normal.png'));
			}
		}
	);
	
	
	
	lime.scheduleManager.schedule(function(){
		// check to see if a new emery should be created
		enemyCreateInvertal++;
		if (enemyCreateInvertal > 150) {
			enemyCreateInvertal = 0;
			
			// create a new enemy at one of four random positions (left, right, up, down)
			var starting_position = parseInt(Math.random() * 4);
			if (starting_position == 0) { // left
				var new_enemy = new lime.Sprite().setPosition(300,-100);
				new_enemy.setFill('assets/enemy_left.png');
				new_enemy.direction = 'left';
				layer.appendChild(new_enemy);
			} else if (starting_position == 1) { // right
				new_enemy = new lime.Sprite().setPosition(-300,-100);
				new_enemy.setFill('assets/enemy_right.png');
				new_enemy.direction = 'right';
				layer.appendChild(new_enemy);
			} else if (starting_position == 2) { // up
				new_enemy = new lime.Sprite().setPosition(0,300);
				new_enemy.setFill('assets/enemy_up.png');
				new_enemy.direction = 'up';
				layer.appendChild(new_enemy);
			} else if (starting_position == 3) { // down
				new_enemy = new lime.Sprite().setPosition(0,-300);
				new_enemy.setFill('assets/enemy_down.png');
				new_enemy.direction = 'down';
				layer.appendChild(new_enemy);
			}
			
			// push enemy to enemies array
			enemies.push(new_enemy);
		}
	
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i];
		
			// destroy the enemy if it out of the bound of the view
			var x = Math.abs(enemy.getPosition().x);
			var y = Math.abs(enemy.getPosition().y);
			
			if (x > 1024 || y > 768) {
				layer.removeChild(enemy);
				enemies.splice(i, 1);
				return;
			}
			
			// push the enemy in the opposite direction if the player is pushing it
			var move;
			if (enemy.direction == 'down' && push_up == true) {
				move = new lime.animation.MoveBy(0,-500);
			} else if (enemy.direction == 'up' && push_down == true) {
				move = new lime.animation.MoveBy(0,500);
			} else if (enemy.direction == 'left' && push_right == true) {
				move = new lime.animation.MoveBy(500,0);;
			} else if (enemy.direction == 'right' && push_left == true) {
				move = new lime.animation.MoveBy(-500,0);
			} else {
				// move the enemy forward along its directions
				if (enemy.direction == 'left'){
					move = new lime.animation.MoveBy(-200,0);
				} else if (enemy.direction == 'right'){
					move = new lime.animation.MoveBy(200, 0);
				} else if (enemy.direction == 'up'){
					move = new lime.animation.MoveBy(0,-200);
				} else if (enemy.direction == 'down'){
					move = new lime.animation.MoveBy(0,200);
				}
			}
			
			// make the enemy movement linear
			move.setEasing(lime.animation.Easing.LINEAR);
			enemy.runAction(move);
		}
	});
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('testgame.start', testgame.start);
