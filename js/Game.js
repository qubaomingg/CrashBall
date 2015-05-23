define(function(require, exports, module) {
    Array.prototype.remove = function(dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0,
        n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1;
    }

    var $ = require('jquery');
    var Ball = require('ball');
    var util = require('util');

    function Game(parent) {
        this.dotWrap = null; // 参考线
        this.guideBall = null; // 参考球
        this.table = $(parent);
        this.balls = []; // 存放所有的小球。
        this.movingballs = [];
        this.cueBall = null; // 母球
        this.timer = 0;
    }
    module.exports = Game;
    Game.prototype = {

        initTable: function() {
            var dotWrapDiv = document.createElement("div"),
                guideBallDiv = document.createElement("div");
            dotWrapDiv.id = "dotWrap"; // 球运动区域
            guideBallDiv.className = "guide ball"; // 瞄准的虚线球
            util.setStyle(guideBallDiv, "display", "none");
            this.dotWrap = $(dotWrapDiv).appendTo(this.table);

            this.guideBall = $(guideBallDiv).appendTo(this.table);
        },

        startGame: function() {
            var _this = this;
            this.initBall();
            $(this.table).bind("mousemove", dragCueBall);
            $(this.table).bind("mouseup", setCueBall);

            function dragCueBall(e) {
                var toX, toY;
                e = e || event;
                toX = e.clientX - _this.table.position().left,
                toY = e.clientY - _this.table.position().top;

                toX = toX >= util.R ? toX: util.R;
                toX = toX <= 170 ? toX: 170;
                toY = toY >= util.R ? toY: util.R;
                toY = toY <= util.H - util.R ? toY: util.H - util.R;
                _this.setBallPos(_this.cueBall, toX, toY);
            }
            function setCueBall() {
                _this.table.unbind("mousemove", dragCueBall);
                _this.table.unbind("mouseup", arguments.callee);
                _this.startShot();
            }
        },

        initBall: function() {
            // 添加母球
            this.cueBall = new Ball("cue", 170, util.H / 2, '#table');
            this.balls.push(this.cueBall);

            for (var i = 0; i < 5; i++) {
                for (var j = 0; j <= i; j++) {
                    var ball = new Ball("target", 520 + i * 2 * util.R, util.H / 2 - util.R * i + j * 2 * util.R, '#table');
                    this.balls.push(ball);
                }
            }
        },

        setBallPos: function(ball, x, y) {
            if (ball.constructor == Ball) {
                ball.x = x;
                ball.y = y;
                ball = ball.elem;
            }
            util.setPos(ball, x + util.TOTALR, y + util.TOTALR);
        },
        startShot: function() {
            var _this = this;
            this.movingballs = [];
            $(this.cueBall.elem).show();
            this.table.bind("mousemove", showGuide);
            this.table.bind("mouseup", shotCueBall);
            function showGuide(e) {
                $('#predict').empty();

                var fromX, fromY, toX, toY;
                e = e || event;
                toX = e.clientX - _this.table.position().left,
                toY = e.clientY - _this.table.position().top;
                //鼠标在table上面的坐标
                util.setBallPos(_this.guideBall, toX, toY);
                $(_this.dotWrap).show();
                $(_this.guideBall).show();

                drawLine(); //画参考线

                function drawLine() {
                    var dotNum = 16,
                    //数字越大，参考线约密集
                    pos = util.getBallPos(_this.cueBall.elem);

                    $(_this.dotWrap).empty();
                    fromX = pos[0];
                    fromY = pos[1]; //fromX和fromY是母球的坐标
                    var partX = (toX - fromX) / dotNum,

                    partY = (toY - fromY) / dotNum;
                    for (var i = 1; i < dotNum; i++) {
                        var x = fromX + partX * i,
                        y = fromY + partY * i;
                        _this.drawDot(_this.dotWrap, x, y);
                    }
                }
            }

            function shotCueBall() {
                _this.table.unbind("mousemove",showGuide);
                _this.table.unbind("mouseup",shotCueBall);
                var formPos = util.getBallPos(_this.cueBall.elem),

                toPos = util.getBallPos(_this.guideBall),

                angle = Math.atan2(toPos[0] - formPos[0], toPos[1] - formPos[1]);

                $(_this.dotWrap).hide();
                _this.cueBall.v = util.speed;
                _this.cueBall.angle = angle;
                _this.movingballs.push(_this.cueBall);
                $(_this.guideBall).hide();
                _this.cueBall.move(_this.balls, _this.movingballs, _this.startShot);
            }
        },
        drawDot: function(wrap, x, y) {
            var elem = document.createElement("div");
            util.setStyle(elem, {
                position: "absolute",
                width: "1px",
                height: "1px",
                fontSize: "1px",
                background: "white"
            });
            util.setPos(elem, x, y);
            wrap.append(elem);
        }
    }


});