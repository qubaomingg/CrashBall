define(function(require, exports, module) {

  var $ = require('jquery/jquery');
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
    getElemPos: function (target,reference) {
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
    },
    setPos: function(obj,x,y) {
      obj.style.left = x + "px";
      obj.style.top = y + "px";
    }
  };
});

