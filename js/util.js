define(function(require, exports, module) {

  var $ = require('jquery');


  module.exports = {
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
    /*getElemPos: function (target,reference) {
      // 目标元素在reference中的相对位置
      reference = reference || document; // 默认值为document
      var left = 0,top = 0;
      return getPos(target);
      function getPos(target) {
        if(target != reference) {
          left += target.offsetLeft;
          top += target.offsetTop;
          return getPos(target.parentNode);
        } else {
          return [left,top];
        }
      }
    },*/
    ,
    setBallPos: function(ball, x, y, context) {
        if (ball.constructor == context) { //如果ball是Ball构造函数这个对象
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

