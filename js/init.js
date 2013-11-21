define(function(require, exports, module) {
	seajs.config({
		base: "../js",
		alias: {
		  "jquery": "jquery/jquery.js",
		}
	});
	var Game = require('game');
	var game = new Game();
	game.initTable()
	game.startGame();
});