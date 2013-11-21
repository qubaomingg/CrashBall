define(function(require, exports, module) {
  Array.prototype.remove=function(dx) {
        if(isNaN(dx) || dx > this.length){ 
          return false;
        }
        for(var i = 0, n = 0;i < this.length; i++){
           if(this[i] != this[dx]){
              this[n++]=this[i]
            }
        }
        this.length-=1
  }

  var $ = require('jquery');
  var util = require('util');
  var H = 480, // 容器宽
      THICKNESS =  32, // 边缘厚度
      R = 12,
      W = 736,
      RATE = 100, //刷新频率
      F = 0.02, //摩擦力
      LOSS = 0.3, // 碰撞速度损失
      speed = 15;


  var Game = function {
    this.dotWrap = null; // 参考线
    this.guideBall = null; // 参考球
    this.table = null;
    this.balls = [];
    this.rollRight = 0;
    this.rollUp = 0;
    this.movingBalls = [];
    this.cueBall = null;
    this.timer = 0;
  };
  Game.prototype = {
    
    initTable: function() {
      this.table = $("#table");
      var dotWrapDiv = document.createElement("div"),
          guideBallDiv = document.createElement("div");
      dotWrapDiv.id = "dotWrap";// 球运动区域
      guideBallDiv.className = "guide ball"; // 瞄准的虚线球
      util.setStyle(guideBallDiv,"display","none");// 瞄准球添加样式
      this.dotWrap = this.table.appendChild(dotWrapDiv);//将创建的dom添加到页面中,并且返回新的子节点
      this.guideBall = this.table.appendChild(guideBallDiv);    
    },
    startGame: function() {
      this.initBall();// 初始化所有的球
      this.table.bind("mousemove",this.dragCueBall);//绑定鼠标移动事件，给球设置坐标
      this.table.bind("mouseup",this.setCueBall);//移除table上绑定事件并且开始执行startShot()函数
    },
    // 初始化母球和目标球，并且放入数组并且显示在桌面上
    initBall: function() {
      // 添加母球
      this.cueBall = new Ball("cue",170,H/2);

      this.balls.push(this.cueBall); 
      
      for(var i = 0; i < 5; i++) {
        for(var j = 0; j <= i; j++) {
          var ball = new Ball("target",520 + i*2*R, H/2 - R*i + j*2*R);
          this.balls.push(ball);
        }
      }
    },
    dragCueBall: function(e) {
      var toX, toY;
      e = e || event;
      toX = e.clientX - this.table.offsetLeft - THICKNESS,
      toY = e.clientY - this.table.offsetTop - THICKNESS;
      //toX,toY在桌面上的坐标
      toX = toX >= R ? toX : R;//x坐标小于球的半径，则球靠近左边台子
      toX = toX <= 170 ? toX : 170;//x坐标不能超过球线
      toY = toY >= R ? toY : R;//y坐标小于半径，则靠近上边台子
      toY = toY <= H - R ? toY : H - R;//坐标超出下面台子，则球靠近下边台子
      this.setBallPos(this.cueBall,toX,toY);//给目球设置坐标
    },
    setBallPos: function(ball, x, y) {
       if(ball.constructor == Ball) {//如果ball是Ball构造函数这个对象
          ball.x = x;
          ball.y = y;
          ball = ball.elem;
        }
        util.setPos(ball,x + THICKNESS - TOTALR,y + THICKNESS - TOTALR); 
    },
    setCueBall: function () {
      this.table.unbind("mousemove",this.dragCueBall);
      this.table.unbind("mouseup",this.setCueBall);
      this.startShot();
    },
    startShot: function() {
      $(cueBall.elem).show();//显示母球
      this.table.bind("mousemove",this.showGuide);//移动是添加事件，显示瞄准球和参考线
      this.table.bind("mouseup",this.shotCueBall);//放开鼠标绑定事件
    },
    showGuide: function(e) {
      var fromX,fromY,toX,toY;
      e = e || event;
      toX = e.clientX - this.table.offsetLeft - THICKNESS,
      toY = e.clientY - this.table.offsetTop - THICKNESS;
      //鼠标在table上面的坐标
      util.setBallPos(this.guideBall,toX,toY);//显示瞄准求的位置
      $(this.dotWrap).show();//显示球运动区域,在css中将#dotWrap设置一个背景色background:pink;会很好看的这个运动区域的作用
      $(this.guideBall).show();//显示瞄准球
      drawLine();//画参考线
      var _this = this;
      //参考线
      function drawLine() {
        var dotNum = 16,//数字越大，参考线约密集
            pos = util.getBallPos(this.cueBall.elem);//获得母球在table上面的坐标
        this.dotWrap.innerHTML = "";
        fromX = pos[0];
        fromY = pos[1];//fromX和fromY是母球的坐标
        var partX = (toX - fromX) / dotNum,//（鼠标的横坐标-母球的横坐标）/16
            partY = (toY - fromY) / dotNum;//（鼠标的纵坐标-母球的纵坐标）/16
        for(var i = 1; i < dotNum; i++) {//设置构成参考线的小点
          var x = fromX + partX * i,
            y = fromY + partY * i;
          _this.drawDot(this.dotWrap, x, y);//绘制参考点到球运动区域
        }   
      }
    },
    drawDot: function(wrap,x,y) {
      var elem = document.createElement("div");
      util.setStyle(elem,{
        position: "absolute",
        width: "1px",
        height: "1px",
        fontSize: "1px",
        background: "white"
      });
      util.setPos(elem,x,y);//为新创建的对象添加坐标
      wrap.appendChild(elem);
    },

    shotCueBall: function() {
      var dotDisX = 0,//圆盘中小蓝点在圆盘中的x轴距离-22
          dotDisY =0,//小蓝点y轴-22
        dotDis = Math.sqrt(dotDisX*dotDisX + dotDisY*dotDisY),//开根号，dotDis举例圆盘中心的举例
        dotAngle = Math.atan2(dotDisX,dotDisY);//算出角度
      this.rollRight = Math.round(dotDis*Math.sin(dotAngle))/5;//舍入为最接近的整数
      this.rollUp = -Math.round(dotDis*Math.cos(dotAngle))/5;

      var formPos = util.getBallPos(this.cueBall.elem),//母球在table上的坐标
          toPos = util.getBallPos(this.guideBall),//瞄准球在table上的坐标
          angle = Math.atan2(toPos[0] - formPos[0],toPos[1] - formPos[1]);

      $(this.dotWrap).hide();//隐藏球运动区域，区域上面的参考线同时隐藏
      $(this.guideBall).hide();//隐藏瞄准球
      this.cueBall.v = speed;//设置母球的速度
      this.cueBall.angle = angle;//设置母球的运动角度
      this.movingBalls.push(this.cueBall);//将母球添加到移动球数组

      this.timer = window.setInterval(this.roll, 1000 / RATE);
    },
    roll: function () {
      //处理球停止运动的情况
      if(this.movingBalls.length <= 0) {//如果movingBalls数组中没有球，球都停止移动了
        window.clearInterval(this.timer);//停止运行不断运行的roll函数
      }
      //处理移动中的球
      for(var i = 0; i < this.movingBalls.length; i++) {
        //记录移动中的球的sin和cos
        var ball = this.movingBalls[i],
          sin = Math.sin(ball.angle),
          cos = Math.cos(ball.angle);
        //速度在每次setInterval中不断递减
        ball.v -= F;//ball.v母球的速度,F = 0.02, 摩擦力,每次执行roll()，速度减少0.02
        //移除静止的小球
        if(Math.round(ball.v) === 0) {//如果速度接近0
          ball.v = 0;
          this.movingBalls.remove(i);//将停止的球移除移动球数组
          continue; //从新执行循环
        }
        //运动的球每次刷新后的坐标
        var vx = ball.v * sin,//x轴方向的 速度
          vy = ball.v * cos;//y轴方向的速度
        ball.x += vx;
        //vx速度在10毫秒的刷新频率下，转化为每次刷新的举例，并且随着时间，vx速度递减，每次刷新运动的举例也递减
        ball.y += vy; 
        //入袋后的处理
        
        if(ball.x < R || ball.x > W - R) {//R = 12球真实半径,W = 736 案宽,球移动到左边缘或者右边缘
          ball.angle *= -1;//角度相反
          ball.angle %= Math.PI;//Math.PI圆周率，这一步没有改变ball.angle的值
          ball.v = ball.v * (1 - LOSS);//LOSS = 0.3 碰撞速度损失
          vx = ball.v * Math.sin(ball.angle);//碰撞后每次刷新运动的x轴运动的距离
          vy = ball.v * Math.cos(ball.angle);
          if(ball.x < R) ball.x = R;//如果坐标小于半径，则贴着左边缘
          if(ball.x > W - R) ball.x = W - R;//贴着右边缘
          //母球加塞（这里我还特意查了什么叫加塞，个人通俗的理解，加塞就是打的旋球，这里处理的情况就是母球选择碰到边缘后不仅会角度反向，而且反向后会有一个弧度）
          if(ball.type == "cue"){//如果碰撞的球是母球
            if(ball.angle > 0){
              vy -= this.rollRight;//小蓝点在中心的话，rollRight==0
            }else{
              vy += this.rollRight;//会改变y轴每次刷新移动的距离
            }
            vx += this.rollUp;//改变x轴每次刷新移动的距离
            this.rollUp *= 0.2;//每一次碰撞加塞的rollUp，rollRight会衰减
            this.rollRight *= 0.2;
            ball.v = Math.sqrt(vx*vx + vy*vy);//ball.v移动的速度
            ball.angle = Math.atan2(vx,vy);//移动的角度
          }       
        }
        if(ball.y < R || ball.y > H - R) {//碰撞上边缘或者下边缘
          ball.angle = ball.angle > 0 ? Math.PI - ball.angle : - Math.PI - ball.angle ;
          //改版碰撞后的角度，和x轴算法不同
          ball.angle %= Math.PI;
          ball.v = ball.v * (1 - LOSS);//碰撞后速度损失
          vx = ball.v * Math.sin(ball.angle);
          vy = ball.v * Math.cos(ball.angle);
          if(ball.y < R) ball.y = R;//贴着下边缘
          if(ball.y > H - R) ball.y = H - R;//贴着上边缘 
          //母球加塞
          if(ball.type == "cue"){
            if(Math.abs(ball.angle) < Math.PI/2){
              vx += this.rollRight;//这里加塞后对x轴产生影响
            }else{
              vx -= this.rollRight;
            } 
            vy += this.rollUp;
            this.rollUp *= 0.2;//碰撞衰减
            this.rollRight *= 0.2;
            ball.v = Math.sqrt(vx*vx + vy*vy);
            ball.angle = Math.atan2(vx,vy);
          }         
        }
        //小球碰撞
        for(var j = 0; j < this.balls.length; j++) {//进入袋中的球从balls中已经删除，这里遍历存在的球
          var obj = this.balls[j];
          if(obj == ball){//如果这个球是自身，则tui出当前循环再次继续遍历
            continue;
          }
          var disX = obj.x - ball.x,
            disY = obj.y - ball.y,//disX，两球见x轴距离，disY，两球间y轴距离
            gap = 2 * R;//R是半径，gap则是直径
          //运动的这个球和其他所有球比较，如果disX，disY同时小于直径，则可以说明两球可能发生碰撞
          if(disX <= gap && disY <= gap) {
            var dis = Math.sqrt(Math.pow(disX,2)+Math.pow(disY,2));//两球间的距离
            if(dis <= gap) {
              //如果被撞击的球是静止的，则添加到数组movingBalls
              if(Math.round(obj.v) == 0){
                this.movingBalls.push(obj);
              }

              //-------------------下面部分是一系列复制的碰撞角度运算-----------------原来代码中注释

              //将坐标旋转到x轴进行碰撞计算
              // 计算角度和正余弦值 - 精确值
              //var c = (obj.x*ball.y - obj.y*ball.x)/(2*R),
              //  d = Math.sqrt(ball.x*ball.x + ball.y*ball.y),
              //  angle = Math.asin(ball.y/d) - Math.asin(c/d) - ball.angle%(Math.PI/2),
              //angle =  Math.asin(oy / (2 * R)),
              
              //还原两球相切状态 - 近似值
              ball.x -= (gap - dis)*sin;
              ball.y -= (gap - dis)*cos;
              disX = obj.x - ball.x;
              disY = obj.y - ball.y;
              
              // 计算角度和正余弦值
              var angle = Math.atan2(disY, disX),
                hitsin = Math.sin(angle),
                hitcos = Math.cos(angle),
                objVx = obj.v * Math.sin(obj.angle),
                objVy = obj.v * Math.cos(obj.angle);
                //trace(angle*180/Math.PI);
                
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
              
              //母球加塞
              if(ball.type == "cue")  {
                vx1 += this.rollUp;
                this.rollUp *= 0.2;
              }       
              
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
              ball.v = Math.sqrt(vx*vx + vy*vy) * (1 - 0);
              obj.v = Math.sqrt(objVx*objVx + objVy*objVy) * (1 - 0);
              
              // 计算角度
              ball.angle = Math.atan2(vx , vy);
              obj.angle = Math.atan2(objVx , objVy);
              //break;
              //------------------------------------复杂的计算结束---- 
            }
          }
        }
        util.setBallPos(ball,ball.x,ball.y);//每次setInterval后设置移动球的位置
    }
  }
  module.exports = Game;

});