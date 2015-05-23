define(function(require, exports, module) {

  var $ = require('jquery');


  module.exports = {
    H: 480,
    R: 12,
    W: 736,
    RATE: 1000,
    F: 0.02,
    LOSS: 0.3,
    TOTALR: 15,
    speed: 15,
    setStyle: function() {
      if(arguments.length == 2 &&  typeof arguments[1] == "object") {
        for(var key in arguments[1]) {
          arguments[0].style[key] = arguments[1][key];
        }
      } else if (arguments.length > 2) {
        arguments[0].style[arguments[1]] = arguments[2];
      }
    },
    getBallPos: function(obj) {
      var pos = [];
      pos.push(obj.position().left - 17);
      pos.push(obj.position().top - 17);
      return pos;
    }
    ,
    setBallPos: function(ball, x, y, context) {
        if (ball.constructor == context) {
            //如果ball是Ball构造函数这个对象
            ball.x = x;
            ball.y = y;
            ball = ball.elem;
        }

        this.setPos(ball, x + 17, y + 17);
    },
    setPos: function(obj,x,y) {
      $(obj).css('left', x + "px");
      $(obj).css('top', y + "px");
    }
  };
});

