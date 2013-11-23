define(function(require, exports, module) {
    var $ = require('jquery');
    var util = require('util');

    function Ball(type, x, y, parent) {
        var div = document.createElement("div");
        div.className = type + " ball";
        this.elem = $(div).appendTo($(parent));,
        this.type = type;
        this.x = x; //位置
        this.y = y;
        this.angle = 0; //角度
        this.v = 0; //速度(不包含方向)
        util.setBallPos(this.elem,x,y, this);//为球设置坐标
        return this;
    }
    module.exports = Ball;
});