/*

	Game Server
	
	This is used to keep track of high scores.  Its very basic, 
	and has no preventions against hacking of any kind, but it 
	works damnit, it works…
		
	This is built for Node.js and can be started using 
	the following command:

		nohup node server.js >/dev/null &

*/

var server_url = "medisite.ca";				// update to your own server url
var game_url = 	"http://ninja.medisite.ca";	// update to your own game url
var port = 8000;							// update to your own needed port number

var util = require('util');
var url = require('url');
var fs = require('fs');
var path = require('path');
var server = require('./node-router').getServer();

// create high scores file if it does not exist
if (!path.existsSync('high_scores.json')) {
  	util.puts('creating high scores file…');
  	
  	var data = {
  		high_scores : [{
  			initials:	'___',
  			score:		0
  		},
  		{
  			initials:	'___',
  			score:		0
  		},
  		{
  			initials:	'___',
  			score:		0
  		}]
  	}
  	
  	fs.writeFileSync('high_scores.json', JSON.stringify(data));
};

server.get("/", function (request, response) {
  	
  	// get current high scores
  	var data = JSON.parse(fs.readFileSync('high_scores.json'));
  	var high_scores = data.high_scores
  	
  	var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
  	
  	// get initials and score
  	var initials = query.initials;
  	var score = query.score;
	
	// input new high score
	for (var i = 0; i < high_scores.length; i++) {
		if (parseInt(high_scores[i].score) == 0 || parseInt(score) > parseInt(high_scores[i].score)) {
  			var new_score_record = {
  				initials: 	initials,
  				score:		parseInt(score)
  			};
  			high_scores.splice(i, 0, new_score_record);
  			high_scores.splice(high_scores.length - 1, 1);
  			break;
  		}
  	}
	
	// write data back to the file
	data.high_scores = high_scores
	fs.writeFileSync('high_scores.json', JSON.stringify(data));
	
	// return high scores
	response.writeHead(200, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : game_url
	});
	response.write(JSON.stringify(high_scores));
	response.end();
});

server.listen(port, server_url);