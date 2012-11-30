/*
	
					FORCE NINJA

Copyright (c) 2012 Shawn Daichendt <shawn.daichendt@gmail.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

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
var server_url = "http://medisite.ca:8000"

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

var highScoreScene;
var highScoreLayer;
var initials;

var life_count = 4;
var score = 0;
var enemy_score_amount = 1;
var extra_life_score_amount = 5;
var extra_life_full_score_amount = 20;

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

var hit_padding = -100;

var pull_speed = 5;

var enemy_start_speed = 300;
var enemy_push_speed = 600;
var enemy_start_create_interval = 100;
var enemy_rotation = 720;
var enemy_change_mod = 10;
var enemy_speed_increase = 25;
var enemy_create_decrease = 10;
var enemy_create_limit = 70;
var enemy_kill_count = 0;
var enemy_speed = 0;
var enemy_create_interval = 0;
var previous_starting_position = -1;

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
		if (game.director.getCurrentScene() == gameOverScene) {
			// RESTART THE GAME
		}
	});

*/

game.loadControls = function() {
	goog.events.listen(player,['mousedown','touchstart'],function(e){
    	push_down = true;
    	push_left = false;
    	push_right = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_down));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	push_down = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(left_touch_zone,['mousedown','touchstart'],function(e){
    	push_left = true;
    	push_down = false;
    	push_right = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_left));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	push_left = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(right_touch_zone,['mousedown','touchstart'],function(e){
    	push_right = true;
    	push_left = false;
    	push_down = false;
    	push_up = false;
    	player.setFill(playerSS.getFrame(player_right));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
        	push_right = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
    
    goog.events.listen(up_touch_zone,['mousedown','touchstart'],function(e){
    	push_up = true;
    	push_left = false;
    	push_right = false;
    	push_down = false;
    	player.setFill(playerSS.getFrame(player_up));
    	
    	e.swallow(['mouseup','touchend','touchcancel'],function(){
    		push_up = false;
        	player.setFill(playerSS.getFrame(player_normal));
        });
    });
}

game.over = function(){
	// setup game over scene
	gameOverScene = new lime.Scene();
	gameOverLayer = new lime.Layer().setPosition(screen_width/2, screen_height/2);
	
	background = new lime.Sprite().setFill('game/assets/background.png');
    gameOverLayer.appendChild(background);
	
	gameOverText = new lime.Label().setText('GAME OVER')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(80)
		.setSize(500, 150)
		.setPosition(0, -(screen_height/2 - 100));
    gameOverLayer.appendChild(gameOverText);
	
	final_score_label = new lime.Label().setText('FINAL SCORE: ' + score)
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setSize(500, 150)
		.setPosition(0, -(screen_height/2 - 200));
    gameOverLayer.appendChild(final_score_label);
	
	var high_scores_title = new lime.Label().setText('HIGH SCORES')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(60)
		.setSize(500, 150)
		.setPosition(0, -(screen_height/2 - 310));
    gameOverLayer.appendChild(high_scores_title);
    
    // get high scores
	var position = 100;
    var rank = 1;
	$.getJSON(server_url + '/?initials=' + initials + '&score=' + score, function(data) {
		console.log(data);
  		$.each(data, function(key, val) {
  			console.log(key);
    		var rank_text = new lime.Label().setText(rank + '.')
				.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
				.setFontSize(60)
				.setSize(500, 100)
				.setAnchorPoint(1,1)
				.setPosition(30, position);
    		gameOverLayer.appendChild(rank_text);
    		
    		var initials_text = new lime.Label().setText(val.initials)
				.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
				.setFontSize(60)
				.setSize(500, 100)
				.setAnchorPoint(1,1)
				.setPosition(140, position);
    		gameOverLayer.appendChild(initials_text);
    		
    		var score_text = new lime.Label().setText(val.score)
				.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
				.setFontSize(60)
				.setSize(700, 100)
				.setAnchorPoint(1,1)
				.setPosition(550, position);
    		gameOverLayer.appendChild(score_text);
    		
    		position += 120;
    		rank += 1;
 		});
	});
	
	gameOverScene.appendChild(gameOverLayer);
	
	game.director.replaceScene(gameOverScene);
	lime.scheduleManager.unschedule(game.run);
	
	// list for the user to touch the screen
	lime.scheduleManager.callAfter(function(){
		goog.events.listen(background,['mousedown','touchstart'],function(e){
    		// restart the game
    		game.restart();
    	});
	}, game.director, 1000);
};

game.highScore = function() {
	// setup high score scene
	
	highScoreScene = new lime.Scene();
	highScoreLayer = new lime.Layer().setPosition(screen_width/2, screen_height/2);
	
	background = new lime.Sprite().setFill('game/assets/background.png');
    highScoreLayer.appendChild(background);
	
	var enter_name_label = new lime.Label().setText('PLEASE ENTER YOUR INITIALS')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(30)
		.setSize(800, 150)
		.setPosition(0, -(screen_height/2 - 190));
    highScoreLayer.appendChild(enter_name_label);
    
    // add blank initials
    var initial_1_entered = false;
    var initial_2_entered = false;
    var initial_3_entered = false;
    
    var initial_1 = new lime.Label().setText('_')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(70)
		.setSize(500, 150)
		.setPosition(-80, -(screen_height/2 - 260));
    highScoreLayer.appendChild(initial_1);
	
	var initial_2 = new lime.Label().setText('_')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(70)
		.setSize(500, 150)
		.setPosition(0, -(screen_height/2 - 260));
    highScoreLayer.appendChild(initial_2);
    
    var initial_3 = new lime.Label().setText('_')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(70)
		.setSize(500, 150)
		.setPosition(80, -(screen_height/2 - 260));
    highScoreLayer.appendChild(initial_3);
    
    // add letters
    var A = new lime.Label().setText('A')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*1)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(A); 
	
	goog.events.listen(A,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('A');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('A');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('A');
    		initial_3_entered = true;
    	}
    });
	
	var B = new lime.Label().setText('B')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*2)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(B);
	
	goog.events.listen(B,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('B');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('B');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('B');
    		initial_3_entered = true;
    	}
    });
	
	var C = new lime.Label().setText('C')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*3)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(C);
    
    goog.events.listen(C,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('C');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('C');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('C');
    		initial_3_entered = true;
    	}
    });
    
    var D = new lime.Label().setText('D')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*4)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(D);
	
	goog.events.listen(D,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('D');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('D');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('D');
    		initial_3_entered = true;
    	}
    });
	
	var E = new lime.Label().setText('E')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*5)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(E);
	
	goog.events.listen(E,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('E');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('E');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('E');
    		initial_3_entered = true;
    	}
    });
	
	var F = new lime.Label().setText('F')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*6)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(F);
	
	goog.events.listen(F,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('F');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('F');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('F');
    		initial_3_entered = true;
    	}
    });
	
	var G = new lime.Label().setText('G')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*7)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(G);
	
	goog.events.listen(G,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('G');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('G');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('G');
    		initial_3_entered = true;
    	}
    });
	
	var H = new lime.Label().setText('H')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*8)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(H);
	
	goog.events.listen(H,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('H');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('H');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('H');
    		initial_3_entered = true;
    	}
    });
	
	var I = new lime.Label().setText('I')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*9)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(I);
	
	goog.events.listen(I,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('I');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('I');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('I');
    		initial_3_entered = true;
    	}
    });
	
	var J = new lime.Label().setText('J')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*10)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(J);
	
	goog.events.listen(J,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('J');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('J');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('J');
    		initial_3_entered = true;
    	}
    });
	
	var K = new lime.Label().setText('K')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*11)), -(screen_height/2 - 350));
    highScoreLayer.appendChild(K);
	
	goog.events.listen(K,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('K');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('K');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('K');
    		initial_3_entered = true;
    	}
    });
	
	var L = new lime.Label().setText('L')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*1)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(L); 
	
	goog.events.listen(L,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('L');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('L');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('L');
    		initial_3_entered = true;
    	}
    });
	
	var M = new lime.Label().setText('M')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*2)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(M);
	
	goog.events.listen(M,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('M');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('M');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('M');
    		initial_3_entered = true;
    	}
    });
	
	var N = new lime.Label().setText('N')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*3)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(N);
    
    goog.events.listen(N,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('N');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('N');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('N');
    		initial_3_entered = true;
    	}
    });
    
    var O = new lime.Label().setText('O')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*4)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(O);
	
	goog.events.listen(O,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('O');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('O');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('O');
    		initial_3_entered = true;
    	}
    });
	
	var P = new lime.Label().setText('P')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*5)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(P);
	
	goog.events.listen(P,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('P');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('P');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('P');
    		initial_3_entered = true;
    	}
    });
	
	var Q = new lime.Label().setText('Q')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*6)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(Q);
	
	goog.events.listen(Q,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('Q');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('Q');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('Q');
    		initial_3_entered = true;
    	}
    });
	
	var R = new lime.Label().setText('R')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*7)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(R);
	
	goog.events.listen(R,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('R');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('R');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('R');
    		initial_3_entered = true;
    	}
    });
	
	var S = new lime.Label().setText('S')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*8)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(S);
	
	goog.events.listen(S,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('S');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('S');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('S');
    		initial_3_entered = true;
    	}
    });
	
	var T = new lime.Label().setText('T')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*9)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(T);
	
	goog.events.listen(T,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('T');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('T');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('T');
    		initial_3_entered = true;
    	}
    });
	
	var U = new lime.Label().setText('U')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*10)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(U);
	
	goog.events.listen(U,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('U');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('U');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('U');
    		initial_3_entered = true;
    	}
    });
	
	var V = new lime.Label().setText('V')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*11)), -(screen_height/2 - 450));
    highScoreLayer.appendChild(V);
	
	goog.events.listen(V,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('V');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('V');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('V');
    		initial_3_entered = true;
    	}
    });
	
	var W = new lime.Label().setText('W')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*1)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(W); 
	
	goog.events.listen(W,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('W');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('W');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('W');
    		initial_3_entered = true;
    	}
    });
	
	var X = new lime.Label().setText('X')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*2)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(X);
	
	goog.events.listen(X,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('X');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('X');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('X');
    		initial_3_entered = true;
    	}
    });
	
	var Y = new lime.Label().setText('Y')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*3)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(Y);
    
    goog.events.listen(Y,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('Y');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('Y');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('Y');
    		initial_3_entered = true;
    	}
    });
    
    var Z = new lime.Label().setText('Z')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(60, 60)
		.setPosition(-(screen_width/2 - (80*4)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(Z);
	
	goog.events.listen(Z,['mousedown','touchstart'],function(e){
    	if (initial_1_entered == false) {
    		initial_1.setText('Z');
    		initial_1_entered = true;
    	} else if (initial_2_entered == false) {
    		initial_2.setText('Z');
    		initial_2_entered = true;
    	} else if (initial_3_entered == false) {
    		initial_3.setText('Z');
    		initial_3_entered = true;
    	}
    });
	
	 var clearButton = new lime.Label().setText('CLEAR')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(200, 60)
		.setPosition(-(screen_width/2 - (80*6)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(clearButton);
	
	goog.events.listen(clearButton,['mousedown','touchstart'],function(e){
    	// clear the high score name
    	initial_1.setText('_');
    	initial_1_entered = false;
    	initial_2.setText('_');
    	initial_2_entered = false;
    	initial_3.setText('_');
    	initial_3_entered = false;
    });
	
	var enterButton = new lime.Label().setText('ENTER')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(50)
		.setSize(200, 60)
		.setPosition(-(screen_width/2 - (80*9)), -(screen_height/2 - 550));
    highScoreLayer.appendChild(enterButton);
	
	goog.events.listen(enterButton,['mousedown','touchstart'],function(e){
		// save initials
		initials = initial_1.getText() + initial_2.getText() + initial_3.getText(); 
	
    	// load game over screen
    	game.over();
    });
	
	highScoreScene.appendChild(highScoreLayer);
	
	game.director.replaceScene(highScoreScene);
	lime.scheduleManager.unschedule(game.run);
};

game.restart = function(){
	// setup the game
	game.setup();
	
	// make the game scene active
	game.director.replaceScene(gameScene);
	
	// run the game
	lime.scheduleManager.schedule(game.run);
	
	
}

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
			
			// increase the player's score
			if (life_count == 4) {
				score += extra_life_full_score_amount;
			} else {
				score += extra_life_score_amount;
			}
			
			// update the score label
			score_label.setText(score);
			
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
		}
	} 
		
	// check to see if a new emery should be created
	enemy_create_time++;
	if (enemy_create_time > enemy_create_interval) {
		enemy_create_time = 0;
			
		// create a new enemy at one of four random positions (left, right, up, down)
		var starting_position = parseInt(Math.random() * 3);
		// make sure this isn't the same direction as the last enemy
		while (starting_position == previous_starting_position) {
			starting_position = parseInt(Math.random() * 3);
		}
		previous_starting_position = starting_position;
		
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
				// GAME OVER - enter your initials
				game.highScore();
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
			
			// every time the player kills a certain number of enemies, update the enemy speed and spawn rate
			if (enemy_kill_count % enemy_change_mod == 0) {
				
				enemy_speed += enemy_speed_increase;
				
				enemy_create_interval -= enemy_create_decrease;
				if (enemy_create_interval < enemy_create_limit) {
					enemy_create_interval = enemy_create_limit;
				}
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
	// initialize starting variables
	enemy_speed = enemy_start_speed;
	enemy_create_interval = enemy_start_create_interval;
	enemy_kill_count = 0;
	previous_starting_position = -1;
	life_count = 4;
	extra_life_create_timer = 0;
	enemy_create_time = 0;
	
	// reset life
	life_1.setFill('game/assets/life_full.png');
	life_2.setFill('game/assets/life_full.png');
	life_3.setFill('game/assets/life_full.png');
	
	// reset score
	score = 0;
	score_label.setText(score);
	
	// reset enemies
	if (enemies != null) {
		for (var i = 0; i < enemies.length; i++) {
			mainLayer.removeChild(enemies[i]);
			enemies = new Array();
		}
	}
	
	// reset extra life
	if (extra_life_container != null) {
		mainLayer.removeChild(extra_life_container);
		mainLayer.removeChild(extra_life);
		extra_life_container = null;
		extra_life = null;
	}
}

game.start = function(){
	// initialize director
	game.director = new lime.Director(document.getElementById('stage'), screen_width, screen_height);
	game.director.setDisplayFPS(false);
	
	// initialize other variables
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
	
	life_1 = new lime.Sprite().setPosition(-(screen_width/2 - 40), -(screen_height/2 - 100));
	mainLayer.appendChild(life_1);
	
	life_2 = new lime.Sprite().setPosition(-(screen_width/2 - 90), -(screen_height/2 - 100));
	mainLayer.appendChild(life_2);
	
	life_3 = new lime.Sprite().setPosition(-(screen_width/2 - 140), -(screen_height/2 - 100));
	mainLayer.appendChild(life_3);
	
	// setup score bar
	score_title_label = new lime.Label().setText('SCORE')
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setPosition((screen_width/2 - 90), -(screen_height/2 - 45));
    mainLayer.appendChild(score_title_label);
    
	score_label = new lime.Label()
		.setFontFamily('Comic Sans MS').setFontColor('#fff').setFontWeight('bold')
		.setFontSize(40)
		.setAnchorPoint(1,1)
		.setPosition((screen_width/2 - 25), -(screen_height/2 - 115));
    mainLayer.appendChild(score_label);
	
	// setup the game
	game.setup();
	
	// load controls
	game.loadControls();
	
	// make the game scene active
	gameScene.appendChild(mainLayer);
	game.director.replaceScene(gameScene);
	
	// run the game
	lime.scheduleManager.schedule(game.run);
}



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
