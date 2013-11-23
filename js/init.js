define(function(require, exports, module) {
	
	var util = require('util');
	var Game = require('Game');
	var Ball = require('ball');
	
    var game = new Game("#table");

    // 把move方法放到init的目的是防止在ball里面require Game方法，解决循环
	Ball.prototype.move = function(balls, movingballs, callback) {
        var _this = this;
        if(this.showPredict) {
        	this.drawPredict(this.x, this.y);	
        }
        
        this.emmiter = window.setInterval(update, 1000 / util.RATE);
        function update() {
            var ball = _this;
            sin = Math.sin(ball.angle),
            cos = Math.cos(ball.angle);
            ball.v -= util.F; //ball.v母球的速度,F = 0.02, 摩擦力,每次执行roll()，速度减少0.02
            if (ball.v <= 0) { 
                ball.v = 0;
                for(var i = 0; i < movingballs.length; i++) {
                    if(movingballs[i] == ball) {
                        movingballs.remove(i);
                    }
                }
                window.clearInterval(_this.emmiter);

                if(movingballs.length <= 0) {
                	game.startShot();
                }
               
            }  

            var vx = ball.v * sin,
                vy = ball.v * cos; // y轴方向的速度
            ball.x += vx;
            ball.y += vy;
            
            // 左右墙壁
            if (ball.x < util.R || ball.x > util.W - util.R) { 
                ball.angle *= -1; 
                ball.angle %= Math.PI; 
                ball.v = ball.v * (1 - util.LOSS); 
                vx = ball.v * Math.sin(ball.angle);
                vy = ball.v * Math.cos(ball.angle);
                if (ball.x < util.R) ball.x = util.R; 
                if (ball.x > util.W - util.R) ball.x = util.W - util.R; 
                
            }

            // 上下墙壁
            if (ball.y < util.R || ball.y > util.H - util.R) { 
                ball.angle = ball.angle > 0 ? Math.PI - ball.angle: -Math.PI - ball.angle;
                
                ball.angle %= Math.PI;
                ball.v = ball.v * (1 - util.LOSS); //碰撞后速度损失
                vx = ball.v * Math.sin(ball.angle);
                vy = ball.v * Math.cos(ball.angle);
                if (ball.y < util.R) ball.y = util.R; 
                if (ball.y > util.H - util.R) ball.y = util.H - util.R;
            }  

            //小球碰撞
            for (var j = 0; j < balls.length; j++) { 
                var obj = balls[j];
                if (obj == ball) { 
                    continue;
                }
                var disX = obj.x - ball.x,
                disY = obj.y - ball.y,
                
                gap = 2 * util.R; // R是半径，gap则是直径
                
                if (disX <= gap && disY <= gap) {
                    var dis = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2)); 
                    if (dis <= gap) {
                        
                        // 下面部分是一系列的碰撞角度运算
                        
                        ball.x -= (gap - dis) * sin;
                        ball.y -= (gap - dis) * cos;
                        disX = obj.x - ball.x;
                        disY = obj.y - ball.y;

                        // 计算角度和正余弦值
                        var angle = Math.atan2(disY, disX),
                        hitsin = Math.sin(angle),
                        hitcos = Math.cos(angle),
                        objVx = obj.v * Math.sin(obj.angle),
                        objVy = obj.v * Math.cos(obj.angle);
                       
                        // 旋转坐标
                        var x1 = 0,
                        y1 = 0,
                        x2 = disX * hitcos + disY * hitsin,
                        y2 = disY * hitcos - disX * hitsin,
                        vx1 = vx * hitcos + vy * hitsin,
                        vy1 = vy * hitcos - vx * hitsin,
                        vx2 = objVx * hitcos + objVy * hitsin,
                        vy2 = objVy * hitcos - objVx * hitsin;

                        // 碰撞后的速度和位置
                        var plusVx = vx1 - vx2;
                        vx1 = vx2;
                        vx2 = plusVx + vx1;

                       
                        x1 += vx1;
                        x2 += vx2;

                        // 将位置旋转回来
                        var x1Final = x1 * hitcos - y1 * hitsin,
                        y1Final = y1 * hitcos + x1 * hitsin,
                        x2Final = x2 * hitcos - y2 * hitsin,
                        y2Final = y2 * hitcos + x2 * hitsin;
                        obj.x = ball.x + x2Final;
                        obj.y = ball.y + y2Final;
                        ball.x = ball.x + x1Final;
                        ball.y = ball.y + y1Final;

                        // 将速度旋转回来
                        vx = vx1 * hitcos - vy1 * hitsin;
                        vy = vy1 * hitcos + vx1 * hitsin;
                        objVx = vx2 * hitcos - vy2 * hitsin;
                        objVy = vy2 * hitcos + vx2 * hitsin;

                        //最终速度
                        ball.v = Math.sqrt(vx * vx + vy * vy) * (1 - 0);
                        obj.v = Math.sqrt(objVx * objVx + objVy * objVy) * (1 - 0);

                        // 计算角度
                        ball.angle = Math.atan2(vx, vy);
                        obj.angle = Math.atan2(objVx, objVy);
                        
                        util.setBallPos(obj, obj.x, obj.y, Ball); //每次setInterval后设置移动球的位置 

                        window.clearInterval(ball.emmiter);
                        window.clearInterval(obj.emmiter);
                        ball.move(balls, movingballs, callback);
                        obj.move(balls, movingballs, callback);
                        var exist = false;
                        for(var i in movingballs) {
                            if(movingballs[i] === obj) {
                                exist = true;
                            }
                        }
                        if(!exist) {
                            movingballs.push(obj);    
                        }
                        
                    }
                }
            }
            util.setBallPos(ball, ball.x, ball.y, Ball); 
        }
    }


	game.initTable();
	game.startGame();
});