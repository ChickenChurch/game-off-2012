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

// entrypoint
testgame.start = function(){
	// initialize variables
	var director = new lime.Director(document.body,1024,768);
	var characterSpriteSheet = new lime.SpriteSheet('assets/character.png',lime.ASSETS.character.json,lime.parser.JSON);
	var scene = new lime.Scene();
	var layer = new lime.Layer().setPosition(512,384);	
	var enemy = null;
	
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
		if (enemy == null) {
			// determine starting position of enemy
			var starting_position = parseInt(Math.random() * 4);
			if (starting_position == 0) { // left
				enemy = new lime.Sprite().setPosition(300,-100);
				enemy.setFill('assets/enemy_left.png');
				enemy.direction = 'left';
				layer.appendChild(enemy);
			}
		} else {
			
		}
	});
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('testgame.start', testgame.start);
