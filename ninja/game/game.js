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

// declare variables
var player;
var left_touch_zone;
var right_touch_zone;
var up_touch_zone;
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
var extra_life_container;
var extra_life;
var score_title_label;
var score_label;
var final_score_label;

var gameOverScene;
var gameOverLayer;
var gameOverText;

var life_count = 4;
var score = 0;
var enemy_score_amount = 1;
var extra_life_score_amount = 5;

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

var pull_speed = 5;

var enemy_start_speed = 300;
var enemy_push_speed = 500;
var enemy_create_interval = 100;
var enemy_rotation = 720;
var enemy_kill_mod = 10;
var enemy_speed_increase = 50;
var enemy_kill_count = 0;
var enemy_speed = 0;

var extra_life_container_diameter = 800;
var extra_life_rotation_speed = 90;
var extra_life_create_interval = 500;
var extra_life_create_timer = 0;

/*
 *
 * Keyboard Controls
 *
 */
/*
// A - push left

KeyboardJS.on('a', 
	function(){
		player.setFill(playerSS.getFrame(player_left));	
		if (push_left == false) {// && KeyboardJS.activeKeys().length == 1) {
			push_left = true;
		}
	}, 
	function(){
		push_left = false;
		if (KeyboardJS.activeKeys().length == 0) {
			player.setFill(playerSS.getFrame(player_normal));
		}
	}
);
	
// D - push right

KeyboardJS.on('d', 
	function(){
		player.setFill(playerSS.getFrame(player_right));
		if (push_right == false) {// && KeyboardJS.activeKeys().length == 1) {
			push_right = true;
		}
	}, 
	function(){
		push_right = false;
		if (KeyboardJS.activeKeys().length == 0) {
			player.setFill(playerSS.getFrame(player_normal));
		}
	}
);
	
// W - push up
KeyboardJS.on('w', 
	function(){
		player.setFill(playerSS.getFrame(player_up));
		if (push_up == false) {// && KeyboardJS.activeKeys().length == 1) {
			push_up = true;	
		}
	}, 
	function(){
		push_up = false;
		if (KeyboardJS.activeKeys().length == 0) {
			player.setFill(playerSS.getFrame(player_normal));
		}
	}
);
	
// SPACE - pull

KeyboardJS.on('space', 
	function(){
		player.setFill(playerSS.getFrame(player_down));
		if (push_down == false) {// && KeyboardJS.activeKeys().length == 2) {
			push_down = true;	
		}
	}, 
	function(){
		push_down = false;
		if (KeyboardJS.activeKeys().length == 0) {
			player.setFill(playerSS.getFrame(player_normal));
		}
	}
);

// ENTER - restart the game

KeyboardJS.on('enter', 
	function(){
		// restart the game if it is on the game over scene
		console.log(game.director.getCurrentScene());
		if (game.director.getCurrentScene() == gameOverScene) {
			console.log('restart the game!');
		}
	});

*/

game.loadControls = function() {
	goog.events.listen(player,['mousedown','touchstart'],function(e){
    	console.log('touching player!');
    	push_down = true;
    	push_left = false;
    	push_right = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_down));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	console.log('not touching player!');
        	push_down = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(left_touch_zone,['mousedown','touchstart'],function(e){
    	console.log('touching left!');
    	push_left = true;
    	push_down = false;
    	push_right = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_left));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	console.log('not touching left!');
        	push_left = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(right_touch_zone,['mousedown','touchstart'],function(e){
    	console.log('touching right!');
    	push_right = true;
    	push_left = false;
    	push_down = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_right));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	console.log('not touching right!');
        	push_right = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(up_touch_zone,['mousedown','touchstart'],function(e){
    	console.log('touching up!');
    	push_up = true;
    	push_left = false;
    	push_right = false;
    	push_down = false;
    	player.setFill(playerSS.getFrame(player_up));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
    		push_up = false;
        	console.log('not touching up!');
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
}

game.pause = function(){
	lime.scheduleManager.unschedule(game.run);
};

game.over = function(){
	// setup game over scene
	gameOverScene = new lime.Scene();
	gameOverLayer = new lime.Layer().setPosition(screen_width/2, screen_height/2);
	
	background = new lime.Sprite().setFill('game/assets/background.png');
    gameOverLayer.appendChild(background);
	
	gameOverText = new lime.Label().setText('GAME OVER')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(80)
		.setSize(500, 150);
    gameOverLayer.appendChild(gameOverText);
	
	final_score_label = new lime.Label().setText('FINAL SCORE: ' + score)
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setSize(500, 150)
		.setPosition(0, 100);
    gameOverLayer.appendChild(final_score_label);
	
	gameOverScene.appendChild(gameOverLayer);
	
	game.director.replaceScene(gameOverScene);
	lime.scheduleManager.unschedule(game.run);
}

/*
game.restart = function(){

}
*/

game.run = function(){
	// check to see if a new extra life object should be created
	if (extra_life == null) {
		if (extra_life_create_timer < extra_life_create_interval) {
			extra_life_create_timer++;
		} else {
			extra_life_container = new lime.Sprite().setSize(extra_life_container_diameter, extra_life_container_diameter);
			mainLayer.appendChild(extra_life_container);
	
			extra_life = new lime.Sprite().setFill('game/assets/life.png').setPosition(0, (extra_life_container.getSize().height)/2);
			extra_life_container.appendChild(extra_life);
				
			// reset the extra life create timer
			extra_life_create_timer = 0;
		}	
	} else {
		// spin the life object
		var rotate = new lime.animation.RotateBy(extra_life_rotation_speed);
		rotate.setEasing(lime.animation.Easing.LINEAR);
		extra_life_container.runAction(rotate);
		
		// shrink the life object's rotation radius is the player is pulling it
		if (push_down == true) {
			extra_life.setPosition(extra_life.getPosition().x, extra_life.getPosition().y - pull_speed);
		}
		
		// if the life object makes contact with the player, destroy it
		if (goog.math.Box.intersectsWithPadding(player.getBoundingBox(),extra_life.getBoundingBox(), hit_padding)) {
			mainLayer.removeChild(extra_life_container);
			extra_life_container = null;
			extra_life = null;
				
		// the player gains a life (if they already aren't at max life)
			if (life_count < 4) {
				life_count += 1;
			}
				
			if (life_count > 1) {
				life_1.setFill('game/assets/life_full.png');
			}
			if (life_count > 2) {
				life_2.setFill('game/assets/life_full.png');
			}
			if (life_count > 3) {
				life_3.setFill('game/assets/life_full.png');
			}
				
			// increase the player's score
			score += extra_life_score_amount;
				
			// update the score label
			score_label.setText(score);
		}
	} 
		
	// check to see if a new emery should be created
	enemy_create_time++;
	if (enemy_create_time > enemy_create_interval) {
		enemy_create_time = 0;
			
		// create a new enemy at one of four random positions (left, right, up, down)
		var starting_position = parseInt(Math.random() * 3);
		if (starting_position == 0) { // left
			var new_enemy = new lime.Sprite().setPosition(screen_width/2,50);
			new_enemy.setFill('game/assets/shiruken.png');
			new_enemy.direction = 'left';
			mainLayer.appendChild(new_enemy);
		} else if (starting_position == 1) { // right
			new_enemy = new lime.Sprite().setPosition(-(screen_width/2),50);
			new_enemy.setFill('game/assets/shiruken.png');
			new_enemy.direction = 'right';
			mainLayer.appendChild(new_enemy);
		} else if (starting_position == 2) { // down
			new_enemy = new lime.Sprite().setPosition(0,-(screen_height/2));
			new_enemy.setFill('game/assets/shiruken.png');
			new_enemy.direction = 'down';
			mainLayer.appendChild(new_enemy);
		}
			
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
				game.over();
				return;
			} else if (life_count == 3) {
				life_3.setFill('game/assets/life_empty.png');
			} else if (life_count == 2) {
				life_2.setFill('game/assets/life_empty.png');
			} else {
				life_1.setFill('game/assets/life_empty.png');
			}
		}
		
		// destroy the enemy if it out of the bound of the view
		var x = Math.abs(enemy.getPosition().x);
		var y = Math.abs(enemy.getPosition().y);
			
		if (x > screen_width/2 || y > screen_height/2) {
			mainLayer.removeChild(enemy);
			enemies.splice(i, 1);
				
			// increase the player's score
			score += enemy_score_amount;
				
			// update the score label
			score_label.setText(score);
			
			// update the enemy kill count
			enemy_kill_count++;
			
			// every time the player kills a certain number of enemies, update the enemy speed
			if (enemy_kill_count % enemy_kill_mod == 0) {
				console.log('increase enemy speed!');
				enemy_speed += enemy_speed_increase;
			}
				
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
				move = new lime.animation.MoveBy(-(enemy_speed),0);
			} else if (enemy.direction == 'right'){
				move = new lime.animation.MoveBy(enemy_speed, 0);
			} else if (enemy.direction == 'up'){
				move = new lime.animation.MoveBy(0,-(enemy_speed));
			} else if (enemy.direction == 'down'){
				move = new lime.animation.MoveBy(0,enemy_speed);
			}
		}
			
		// make the enemy movement linear
		move.setEasing(lime.animation.Easing.LINEAR);
		enemy.runAction(move);
			
		// spin the enemy
		var spin = new lime.animation.RotateBy(enemy_rotation);
		spin.setEasing(lime.animation.Easing.LINEAR);
		enemy.runAction(spin);
	}
};

game.setup = function(){
	enemy_speed = enemy_start_speed;
	enemy_kill_count = 0;
}

game.start = function(){
	// initialize variables
	game.director = new lime.Director(document.getElementById('stage'), screen_width, screen_height);
	playerSS = new lime.SpriteSheet('game/assets/player.png',lime.ASSETS.player.json,lime.parser.JSON);
	gameScene = new lime.Scene();
	mainLayer = new lime.Layer().setPosition(screen_width/2, screen_height/2);	
	enemies = new Array();
	enemy_create_time = enemy_create_interval;
	extra_life_container = null;
	extra_life = null;
	
	// setup background
	background = new lime.Sprite().setFill('game/assets/background.png');
    mainLayer.appendChild(background);
	
	// setup the character sprite
	player = new lime.Sprite().setPosition(10,50);
	player.setFill(playerSS.getFrame(player_normal));
	mainLayer.appendChild(player);
	
	left_touch_zone = new lime.Sprite().setPosition(-(screen_width/4 + 75),100).setSize(400,300);//.setFill('#aaa');
	mainLayer.appendChild(left_touch_zone);
	
	right_touch_zone = new lime.Sprite().setPosition((screen_width/4 + 100),100).setSize(400,300);//.setFill('#fff');
	mainLayer.appendChild(right_touch_zone);
	
	up_touch_zone = new lime.Sprite().setPosition(0,-(screen_height/4) - 40).setSize(400,270);//.setFill('#000');
	mainLayer.appendChild(up_touch_zone);
	
	// setup life bar
	life_label = new lime.Label().setText('LIFE')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setPosition(-(screen_width/2 - 70), -(screen_height/2 - 45));
    mainLayer.appendChild(life_label);
	
	life_1 = new lime.Sprite().setFill('game/assets/life_full.png')
		.setPosition(-(screen_width/2 - 40), -(screen_height/2 - 100));
	mainLayer.appendChild(life_1);
	
	life_2 = new lime.Sprite().setFill('game/assets/life_full.png')
		.setPosition(-(screen_width/2 - 90), -(screen_height/2 - 100));
	mainLayer.appendChild(life_2);
	
	life_3 = new lime.Sprite().setFill('game/assets/life_full.png')
		.setPosition(-(screen_width/2 - 140), -(screen_height/2 - 100));
	mainLayer.appendChild(life_3);
	
	// setup score bar
	score_title_label = new lime.Label().setText('SCORE')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setPosition((screen_width/2 - 90), -(screen_height/2 - 45));
    mainLayer.appendChild(score_title_label);
    
	score_label = new lime.Label().setText(score)
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setAnchorPoint(1,1)
		.setPosition((screen_width/2 - 25), -(screen_height/2 - 110));
    mainLayer.appendChild(score_label);
	
	// make the game scene active
	gameScene.appendChild(mainLayer);
	game.director.replaceScene(gameScene);
	
	// setup the game
	game.setup();
	
	// load controls
	game.loadControls();
	
	// run the game
	lime.scheduleManager.schedule(game.run);
}



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
