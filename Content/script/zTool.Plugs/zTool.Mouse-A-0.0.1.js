//zTool.Mouse - alpha 0.0.1
//廖力编写@2012
//鼠标控制器，基于zTool.Core
//-----------------------------------------

var _zMouse = function () {
    //页面载入
    zZ(document).ready(function () {
        //获取鼠标的上个测点
        zZ.zMouse.FindMouseLastPosition();
    });

    //当前鼠标所在坐标 x,y
    this.NowMousePosition = [0, 0];

    //鼠标的上个测点
    this.MouseLastTimePosition = [0, 0];

    //鼠标的移动速度
    this.MouseSpeed = [0, 0];

    //鼠标的移动方向,上:u,下d,左l,右r,无:n
    this.MouseMoveDirection = ['n', 'n'];

    //鼠标测点的平滑度
    this.MPointTime = 20;

    //[{ 'funcName': 'goodJob', 'Func': function () { alert('aa'); } }, { 'funcName': 'nice', 'Func': function () { alert('bb'); } }];
    //鼠标移动的预设方法
    this.MMReserveFunction = [];


    //鼠标左键弹上的预设方法
    this.MUReserveFunction = [];

    //当鼠标移动（任意时候）
    zZ(document).mousemove(function (e) {
        //设置鼠标当前所在坐标
        zZ.zMouse.NowMousePosition = [e.pageX || e.x, e.pageY || e.y]

        //运行预设方法
        if (zZ.zMouse.MMReserveFunction.length != 0) {
            for (var i = 0; i < zZ.zMouse.MMReserveFunction.length; i++) {
                zZ.zMouse.MMReserveFunction[i].Func.apply();
            }
        }
    });

    //当鼠标左键弹上时
    zZ(document).mouseup(function () {
        //运行预设方法
        if (zZ.zMouse.MUReserveFunction.length != 0) {
            for (var i = 0; i < zZ.zMouse.MUReserveFunction.length; i++) {
                var functionPro = zZ.zMouse.MUReserveFunction[i];
                functionPro.Func.apply();
            }
        }
    });

}

_zMouse.prototype = {
    //获取鼠标的上个测点
    FindMouseLastPosition: function () {
        //鼠标测点
        this.TimeMouse();
        //启动测点器，检测鼠标的移动
        setInterval(function () {
            //鼠标测点
            zZ.zMouse.TimeMouse();
        }, this.MPointTime);
    }
,   //向鼠标移动事件数组中注册一个事件
    AddMouseMoveFunc: function (name, CallBack) {
        this.MMReserveFunction.push({ 'funcName': name, 'Func': CallBack });
    }
,   //向鼠标弹起事件数组中注册一个事件
    AddMouseUpFunc: function (name, CallBack) {
        this.MUReserveFunction.push({ 'funcName': name, 'Func': CallBack });
    }
,   //移除鼠标移动事件数组中的某个方法
    removeMMRFunc: function (name) {
        var tempArr = [];
        for (var i = 0; i < this.MMReserveFunction.length; i++) {
            var functionPro = this.MMReserveFunction[i];
            if (functionPro.funcName != name) {
                tempArr.push(functionPro);
            }
        }
        this.MMReserveFunction = [];
        this.MMReserveFunction = tempArr;
    }
,   //移除鼠标弹起事件数组中的某个方法
    removeMURFunc: function (name) {
        var tempArr = [];
        for (var i = 0; i < this.MUReserveFunction.length; i++) {
            var functionPro = this.MUReserveFunction[i];
            if (functionPro.funcName != name) {
                tempArr.push(functionPro);
            }
        }
        this.MUReserveFunction = [];
        this.MUReserveFunction = tempArr;
    }
,   //鼠标测点使用的方法
    TimeMouse: function () {
        //计算鼠标的X速度
        this.MouseSpeed[0] = this.MouseLastTimePosition[0] - this.NowMousePosition[0];
        //计算鼠标的Y速度
        this.MouseSpeed[1] = this.MouseLastTimePosition[1] - this.NowMousePosition[1];
        //    //计算鼠标移动方向
        //    if (MouseSpeed[0] > 0) {
        //        //如果鼠标X速度大于零视为往左移动
        //        MouseMoveDirection[0] = 'l';
        //    }
        //    if (MouseSpeed[0] < 0) {
        //        //如果鼠标X速度小于零视为往右移动
        //        MouseMoveDirection[0] = 'r';
        //    }
        //    if (MouseSpeed[0] == 0) {
        //        //否则就是没有移动方向
        //        MouseMoveDirection[0] = 'n';
        //    }

        //    if (MouseSpeed[1] > 0) {
        //        //如果鼠标Y速度大于零视为往上移动
        //        MouseMoveDirection[1] = 'u';
        //    }
        //    if (MouseSpeed[1] < 0) {
        //        //如果鼠标Y速度小于零视为往下移动
        //        MouseMoveDirection[1] = 'd';
        //    }
        //    if (MouseSpeed[1] == 0) {
        //        //否则就是没有移动方向
        //        MouseMoveDirection[1] = 'n';
        //    }

        //在此之前视为上次的移动位置有效
        this.MouseLastTimePosition = this.NowMousePosition;
    }
,   //绑定移动层
    BindMouseMoveLayer: function (ClickId, MoveID) {

        var ClickObj = document.getElementById(ClickId);
        var MoveObj = document.getElementById(MoveID);


        zZ(ClickObj).unbind('mousedown');
        zZ(ClickObj).mousedown(function () {
            zZ.zMouse.removeMMRFunc(MoveID + 'MM');
            zZ.zMouse.removeMURFunc(MoveID + 'MU');
            var xl = parseInt(zZ.zMouse.NowMousePosition[0] - parseInt(zZ(MoveObj).css('left').replace('px')));
            var yl = parseInt(zZ.zMouse.NowMousePosition[1] - parseInt(zZ(MoveObj).css('top').replace('px')));
            zZ.zMouse.AddMouseMoveFunc(MoveID + 'MM', function () {
                zZ(MoveObj).css('left', zZ.zMouse.NowMousePosition[0] - xl + "px");
                zZ(MoveObj).css('top', zZ.zMouse.NowMousePosition[1] - yl + "px");

            });
            zZ.zMouse.AddMouseUpFunc(MoveID + 'MU', function () {
                if (parseInt(zZ(MoveObj).css('left').replace('px')) < 0) {
                    zZ(MoveObj).css('left', '0px');
                }

                if (parseInt(zZ(MoveObj).css('top').replace('px')) < 0) {
                    zZ(MoveObj).css('top', '0px');
                }

                if (parseInt(zZ(MoveObj).css('left').replace('px')) + zZ(MoveObj).width() > zZ.fn.bodySize.width()) {
                    zZ(MoveObj).css('left', zZ.fn.bodySize.width() - zZ(MoveObj).width() + 'px');
                }

                if (parseInt(zZ(MoveObj).css('top').replace('px')) + zZ(MoveObj).height() > zZ.fn.bodySize.height()) {
                    zZ(MoveObj).css('top', zZ.fn.bodySize.height() - zZ(MoveObj).height() + 'px');
                }

                zZ.zMouse.removeMMRFunc(MoveID + 'MM');
                zZ.zMouse.removeMURFunc(MoveID + 'MU');
            });
        });
    }
, //取消绑定移动层
    unBindMouseMoveLayer: function (ClickId, MoveID) {
        var ClickObj = document.getElementById(ClickId);
        var MoveObj = document.getElementById(MoveID);
        zZ(ClickObj).unbind('mousedown');
        removeMMRFunc(MoveID + 'MM');
        removeMURFunc(MoveID + 'MU');
    }
}

zZ.zMouse = new _zMouse();