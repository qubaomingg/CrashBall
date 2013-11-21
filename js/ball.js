define(function(require, exports, module) {

  var $ = require('jquery');

  var CANVAS_HEIGHT = 500;
  var CANVAS_WIDTH = 900;

  var BALL_WIDTH = 60;
  var BALL_HEIGHT = 60;
  var LUCKY_BALL_WIDTH = 200;
  var LUCKY_BALL_HEIGHT = 200;
  var MAX_ZINDEX = 100;

  var DURATION_MIN = 100;
  var DURATION_MAX = 500;
  var ZOOM_DURATION = 500;


  function Ball(name, options) {
    this.name = name;
    this.options = options || {};

    this.el = null;
    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;
    this.x = 0;
    this.y = 0;

    this.moving = false;
    this.lucky = false;

    this.createEl();
    this.move();
  }

  module.exports = Ball;

  User.prototype.init = function() {
    
  }
});

