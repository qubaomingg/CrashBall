define(function(require, exports, module) {
    var $ = require('jquery');
    var util = require('util');

    function Ball(type, x, y, parent) {
        var div = document.createElement("div");
        div.className = type + " ball";
        this.elem = $(div).appendTo($(parent));
        this.type = type;
        this.x = x;
        this.y = y;
        this.angle = 0; 
        this.v = 0; // 不包含方向
        this.emmiter = 0;
        this.showPredict = true;
        util.setBallPos(this.elem,x,y, this);
        return this;
    }
    // @param 初始
    Ball.prototype.drawPredict = function(x, y) {

        var v = this.v,
            angle = this.angle;
        var ball = {
            x: x,
            y: y,
            v: v,
            angle: angle
        };

        while(ball.v > 0){
            var sin = Math.sin(ball.angle);
            var cos = Math.cos(ball.angle);

            ball.v -= util.F; 
            var vx = ball.v * sin, // x轴方向的 速度
                vy = ball.v * cos; // y轴方向的速度
            ball.x += vx;
            ball.y += vy;
            // 碰到左右边缘
            if (ball.x < util.R || ball.x > util.W - util.R) { 
                ball.angle *= -1; 
                ball.angle %= Math.PI; 
                ball.v = ball.v * (1 - util.LOSS); 
                vx = ball.v * Math.sin(ball.angle);
                vy = ball.v * Math.cos(ball.angle);
                if (ball.x < util.R) {
                    ball.x = util.R;    
                }
                if (ball.x > util.W - util.R) {
                    ball.x = util.W - util.R;    
                }
            }
            // 上下边缘
            if (ball.y < util.R || ball.y > util.H - util.R) { 
                ball.angle = ball.angle > 0 ? Math.PI - ball.angle: -Math.PI - ball.angle;
                //改版碰撞后的角度，和x轴算法不同
                ball.angle %= Math.PI;
                ball.v = ball.v * (1 - util.LOSS); 
                vx = ball.v * Math.sin(ball.angle);
                vy = ball.v * Math.cos(ball.angle);
                if (ball.y < util.R) {
                    ball.y = util.R;    
                }
                if (ball.y > util.H - util.R) {
                    ball.y = util.H - util.R;   
                }
            }   
            drawDot($('#predict'), ball.x, ball.y);   
        }
    }
    module.exports = Ball;

    // helper
    function drawDot(wrap, x, y) {
        x += 32;
        y += 32;
        var elem = document.createElement("div");
        util.setStyle(elem, {
            position: "absolute",
            width: "2px",
            height: "2px",
            background: "yellow"
        });
        util.setPos(elem, x, y); 
        wrap.append(elem);
    }
});