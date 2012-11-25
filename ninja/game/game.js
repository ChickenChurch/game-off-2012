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

// declare variables
var director;
var player;
var playerSS;
var gameScene;
var mainLayer;
var enemies;
var enemy_create_time;
var background;
var life_label;
var life_1;
var life_2;
var life_3;
var score_title_label;
var score_label;

var life_count = 4;
var score = 0;

var screen_width = 1024;
var screen_height = 700;

var player_normal = 2;
var player_down = 0;
var player_left = 1;
var player_right = 3;
var player_up = 4;

var push_left = false;
var push_right = false;
var push_up = false;
var push_down = false;

var hit_padding = -90;

var enemy_normal_speed = 200;
var enemy_push_speed = 500;
var enemy_create_interval = 100;
var enemy_rotation = 720;

// entrypoint
game.start = function(){
	// initialize variables
	director = new lime.Director(document.body,screen_width, screen_height);
	playerSS = new lime.SpriteSheet('assets/player.png',lime.ASSETS.player.json,lime.parser.JSON);
	gameScene = new lime.Scene();
	mainLayer = new lime.Layer().setPosition(screen_width/2, screen_height/2).setRenderer(lime.Renderer.CANVAS);	
	enemies = new Array();
	enemy_create_time = enemy_create_interval;
	
	// setup background
	background = new lime.Sprite().setFill('assets/background.png');
    mainLayer.appendChild(background);
	
	// setup the character sprite
	player = new lime.Sprite().setPosition(0,50);
	player.setFill(playerSS.getFrame(player_normal));
	mainLayer.appendChild(player);
	
	// setup life bar
	life_label = new lime.Label().setText('LIFE')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setPosition(-(screen_width/2 - 70), -(screen_height/2 - 25));
    mainLayer.appendChild(life_label);
	
	life_1 = new lime.Sprite().setFill('assets/life_full.png')
		.setPosition(-(screen_width/2 - 40), -(screen_height/2 - 80));
	mainLayer.appendChild(life_1);
	
	life_2 = new lime.Sprite().setFill('assets/life_full.png')
		.setPosition(-(screen_width/2 - 90), -(screen_height/2 - 80));
	mainLayer.appendChild(life_2);
	
	life_3 = new lime.Sprite().setFill('assets/life_full.png')
		.setPosition(-(screen_width/2 - 140), -(screen_height/2 - 80));
	mainLayer.appendChild(life_3);
	
	// setup score bar
	score_title_label = new lime.Label().setText('SCORE')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setPosition((screen_width/2 - 90), -(screen_height/2 - 25));
    mainLayer.appendChild(score_title_label);
    
	score_label = new lime.Label().setText(score)
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setAnchorPoint(1,1)
		.setPosition((screen_width/2 - 25), -(screen_height/2 - 95));
    mainLayer.appendChild(score_label);
	
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
	
	// pressing 'space' action
	KeyboardJS.on('space', 
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
				mainLayer.appendChild(new_enemy);
			} else if (starting_position == 1) { // right
				new_enemy = new lime.Sprite().setPosition(-(screen_width/2),50);
				new_enemy.setFill('assets/shiruken.png');
				new_enemy.direction = 'right';
				mainLayer.appendChild(new_enemy);
			} else if (starting_position == 2) { // down
				new_enemy = new lime.Sprite().setPosition(0,-(screen_height/2));
				new_enemy.setFill('assets/shiruken.png');
				new_enemy.direction = 'down';
				mainLayer.appendChild(new_enemy);
			}
			
			// rotate the enemy
			var spin = new lime.animation.Loop(new lime.animation.RotateBy(enemy_rotation));
			spin.setEasing(lime.animation.Easing.LINEAR);
			new_enemy.runAction(spin);
			
			// push enemy to enemies array
			enemies.push(new_enemy);
		}
	
		// checks for every active enemy
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i];
			
			// destroy the enemy if it is touching the player
			if (goog.math.Box.intersectsWithPadding(player.getBoundingBox(),enemy.getBoundingBox(), hit_padding)) {
				mainLayer.removeChild(enemy);
				enemies.splice(i, 1);
				
				// the player loses a life
				life_count -= 1;
				if (life_count == 0) {
					// GAME OVER
					return;
				} else if (life_count == 3) {
					life_3.setFill('assets/life_empty.png');
				} else if (life_count == 2) {
					life_2.setFill('assets/life_empty.png');
				} else {
					life_1.setFill('assets/life_empty.png');
				}
				return;
			}
		
			// destroy the enemy if it out of the bound of the view
			var x = Math.abs(enemy.getPosition().x);
			var y = Math.abs(enemy.getPosition().y);
			
			if (x > screen_width/2 || y > screen_height/2) {
				mainLayer.removeChild(enemy);
				enemies.splice(i, 1);
				
				// increase the player's score
				score += 1;
				//console.log(score);
				
				// update the score label
				score_label.setText(score);
				
				return;
			}
			
			// push the enemy in the opposite direction if the player is pushing it
			var move;
			if (enemy.direction == 'down' && push_up == true) {
				move = new lime.animation.MoveBy(0,-(enemy_push_speed));
			} else if (enemy.direction == 'left' && push_right == true) {
				move = new lime.animation.MoveBy(enemy_push_speed,0);
			} else if (enemy.direction == 'right' && push_left == true) {
				move = new lime.animation.MoveBy(-(enemy_push_speed),0);
			} else {
				// move the enemy forward along its directions
				if (enemy.direction == 'left'){
					move = new lime.animation.MoveBy(-(enemy_normal_speed),0);
				} else if (enemy.direction == 'right'){
					move = new lime.animation.MoveBy(enemy_normal_speed, 0);
				} else if (enemy.direction == 'up'){
					move = new lime.animation.MoveBy(0,-(enemy_normal_speed));
				} else if (enemy.direction == 'down'){
					move = new lime.animation.MoveBy(0,enemy_normal_speed);
				}
			}
			
			// make the enemy movement linear
			move.setEasing(lime.animation.Easing.LINEAR);
			enemy.runAction(move);
		}
	});
	
	// make the game scene active
	gameScene.appendChild(mainLayer);
	director.replaceScene(gameScene);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
