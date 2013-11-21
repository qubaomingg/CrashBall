define(function(require, exports, module) {
	seajs.config({
		base: "../js",
		alias: {
		  "jquery": "jquery/jquery.js",
		}
	});

	var Game = require('game');
	Game.init();
});