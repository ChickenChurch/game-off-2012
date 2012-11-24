//set main namespace
goog.provide('game');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.player.json');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');

// initialize variables
var screen_width = 1024;
var screen_height = 700;

var player_normal = 2;
var player_down = 0;
var player_left = 1;
var player_right = 3;
var player_up = 4;

var push_left, push_right, push_up, push_down = false;

var enemy_create_interval = 100;

// entrypoint
game.start = function(){
	// initialize variables
	var director = new lime.Director(document.body,screen_width, screen_height);
	var playerSS = new lime.SpriteSheet('assets/player.png',lime.ASSETS.player.json,lime.parser.JSON);
	var scene = new lime.Scene();
	var layer = new lime.Layer().setPosition(screen_width/2, screen_height/2).setRenderer(lime.Renderer.CANVAS);	
	var enemies = new Array();
	var enemy_create_time = enemy_create_interval;
	
	// setup background
	var background = new lime.Sprite().setFill('assets/background.png');
    layer.appendChild(background);
	
	// create the character sprite
	var player = new lime.Sprite().setPosition(0,50);
	player.setFill(playerSS.getFrame(player_normal));
	layer.appendChild(player);

	// set current scene active
	scene.appendChild(layer);
	director.replaceScene(scene);
	
	// pressing 'left' action
	KeyboardJS.on('a', 
		function(){
			if (push_left == false) {
				push_left = true;
				player.setFill(playerSS.getFrame(player_left));	
			}
		}, 
		function(){
			push_left = false;
			if (KeyboardJS.activeKeys().length == 0) {
				player.setFill(playerSS.getFrame(player_normal));
			}
		}
	);
	
	// pressing 'right' action
	KeyboardJS.on('d', 
		function(){
			if (push_right == false) {
				push_right = true;
				player.setFill(playerSS.getFrame(player_right));
			}
		}, 
		function(){
			push_right = false;
			if (KeyboardJS.activeKeys().length == 0) {
				player.setFill(playerSS.getFrame(player_normal));
			}
		}
	);
	
	// pressing 'up' action
	KeyboardJS.on('w', 
		function(){
			if (push_up == false) {
				push_up = true;
				player.setFill(playerSS.getFrame(player_up));	
			}
		}, 
		function(){
			push_up = false;
			if (KeyboardJS.activeKeys().length == 0) {
				player.setFill(playerSS.getFrame(player_normal));
			}
		}
	);
	
	// pressing 'down' action
	KeyboardJS.on('s', 
		function(){
			if (push_down == false) {
				push_down = true;
				player.setFill(playerSS.getFrame(player_down));	
			}
		}, 
		function(){
			push_down = false;
			if (KeyboardJS.activeKeys().length == 0) {
				player.setFill(playerSS.getFrame(player_normal));
			}
		}
	);
	
	lime.scheduleManager.schedule(function(){
		// check to see if a new emery should be created
		enemy_create_time++;
		if (enemy_create_time > enemy_create_interval) {
			enemy_create_time = 0;
			
			// create a new enemy at one of four random positions (left, right, up, down)
			var starting_position = parseInt(Math.random() * 3);
			if (starting_position == 0) { // left
				var new_enemy = new lime.Sprite().setPosition(screen_width/2,50);
				new_enemy.setFill('assets/shiruken.png');
				new_enemy.direction = 'left';
				layer.appendChild(new_enemy);
			} else if (starting_position == 1) { // right
				new_enemy = new lime.Sprite().setPosition(-(screen_width/2),50);
				new_enemy.setFill('assets/shiruken.png');
				new_enemy.direction = 'right';
				layer.appendChild(new_enemy);
			} else if (starting_position == 2) { // down
				new_enemy = new lime.Sprite().setPosition(0,-(screen_height/2));
				new_enemy.setFill('assets/shiruken.png');
				new_enemy.direction = 'down';
				layer.appendChild(new_enemy);
			}
			
			// rotate the enemy
			var spin = new lime.animation.Loop(new lime.animation.RotateBy(720));
			spin.setEasing(lime.animation.Easing.LINEAR);
			new_enemy.runAction(spin);
			
			// push enemy to enemies array
			enemies.push(new_enemy);
		}
	
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i];
		
			// destroy the enemy if it out of the bound of the view
			var x = Math.abs(enemy.getPosition().x);
			console.log(x);
			var y = Math.abs(enemy.getPosition().y);
			console.log(y);
			
			if (x > screen_width/2 || y > screen_height/2) {
				layer.removeChild(enemy);
				enemies.splice(i, 1);
				return;
			}
			
			// push the enemy in the opposite direction if the player is pushing it
			var move;
			if (enemy.direction == 'down' && push_up == true) {
				move = new lime.animation.MoveBy(0,-500);
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
goog.exportSymbol('game.start', game.start);
