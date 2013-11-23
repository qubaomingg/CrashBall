define(function(require, exports, module) {
	
	console.log('init');

	var Game = require('Game');
	var game = new Game("#table");
	game.initTable();
	game.startGame();
});