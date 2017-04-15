//zChart图标插件 试制版
zZ(document).ready(function () {
    //静态方法类
    zZ.Zstatic.zChart = {
        xmlns: 'http://www.w3.org/2000/svg'
        ,
        //获得内容容器的大小
        //传入options,Cointer(目标容器对象)
        //返回options
        getCotainerSize: function (options, container) {
            if (!options.box.width || options.box.width == 'auto') {
                options.box.width = zZ(container).width();
            }
            if (!options.box.height || options.box.width == 'auto') {
                options.box.height = zZ(container).height();
            }
            return options;
        }
        , //创建Svg容器
        //传入options,Cointer(目标容器对象)
        createSvgCotainer: function (options, container) {
            zZ(container).append('<svg version="1.1" xmlns="' + zZ.Zstatic.zChart.xmlns + '" width="' + options.box.width + '" height="' + options.box.height + '" id="' + options.box.id + '" ></svg>');
        }
        ,
        //构建图表
        createChart: {
            //饼状图
            pie: {
                //计算数值的百分比
                getPreOfData: function (data) {
                    //计算数值的百分比
                    var sum = 0;
                    for (var item in data) {
                        sum = data[item].data + sum;
                    }

                    for (var i in data) {
                        data[i]['prePie'] = data[i].data / sum * 360;
                        data[i]['pre'] = data[i].data / sum * 100;
                    }
                    return data;
                }
                , //计算位置参数
                computThePositionOption: function (options) {
                    //创建返回值
                    var result = { r: 0, centerPoint: { x: 0, y: 0 }, startPoint: { x: 0, y: 0} };
                    //获得最短的维度
                    var width = options.box.width;
                    var height = options.box.height;
                    var shotLength = 0;
                    var rRre = 0;
                    //看width和height里谁最短取谁
                    var wich = '';
                    if (width >= height) { shotLength = height; wich = 'h'; } else { shotLength = width; wich = 'w'; }
                    //计算半径//取最短值的百分之八十作为直径，除以二获得半径
                    if (wich == 'h') { rRre = 60; } else { rRre = 40; }
                    result.r = (shotLength / 100 * rRre) / 2;
                    //计算圆心坐标
                    result.centerPoint.x = width / 2;
                    result.centerPoint.y = height / 2;
                    //计算弧的开始坐标
                    result.startPoint.x = result.centerPoint.x;
                    result.startPoint.y = result.centerPoint.y - result.r;
                    //将结果返回
                    return result;
                }
                ,
                //创建饼状图中的所有扇形
                createFans: function (options) {
                    var data = options.chart.data;
                    //获得初始的坐标参数
                    //r:半径
                    //centerPoint:圆心坐标
                    //startPoint:弧的开始点坐标
                    var initPosition = zZ.Zstatic.zChart.createChart.pie.computThePositionOption(options);

                    //半径
                    var r = initPosition.r;
                    //圆心坐标
                    var centerPoint = initPosition.centerPoint;
                    //弧的开始坐标
                    var startPoint = initPosition.startPoint;
                    //角度
                    var t = -90;
                    //上一个总角度
                    var lastAngl = -90;
                    //动画时间
                    var aTime = 1000;
                    //循环构建扇形
                    for (var item in data) {
                        //创建一个扇形对象,传入初始值
                        var fan = zZ.Zstatic.zChart.createItem.fan({ startPoint: startPoint, r: r, brs: 0, endPoint: { x: 0, y: 0 }, centerPoint: centerPoint });

                        //获得角度
                        t = data[item].prePie + t;
                        //自动计算弧度并应用扇形
                        //传入大角和小角
                        var endPoint = fan.autoBow(t, data[item].prePie);

                        //获取鼠标浮动时的推点
                        var centerAngel = data[item].prePie / 2 + lastAngl;
                        //算出推点
                        fan.attributes["tran"] = fan.getPointAnyAngleAnyRadiu(centerAngel, r / 14, { x: 0, y: 0 });
                        //保存该弧度的中点角
                        fan.attributes["centerAngel"] = centerAngel;
                        fan.attributes["lableAngel"] = centerAngel;
                        //保存该弧的结束角
                        fan.attributes["t"] = t;

                        //将扇形加入到svg容器之中去
                        zZ.Zstatic.zChart.createItem.apply(options.box.id, fan);
                        //保存此数据所对应的对象
                        data[item]["obj"] = fan;

                        //应用一些属性
                        var fan = zZ(fan);
                        fan.attr("stroke", "#fff");
                        fan.attr("fill", data[item].color);
                        fan.attr("stroke-width", "1");
                        fan.attr("stroke-linejoin", "round");
                        fan.attr("class", "zCharts_fan");
                        fan.attr("zIndex", "200");
                        fan.attr("cx", centerPoint.x);
                        fan.attr("cy", centerPoint.y);

                        //设置出现时的动画
                        //使用属性数值计算，计算每一个动画截的数值，然后手动给它相应的数值
                        fan.animation([['zNum.r', r, '', '>-', "0"], ['zNum.t', lastAngl, '', '>-', '-90'], ['zNum.preT', data[item].prePie, '', '>-', '0']], aTime, function () {

                            //设置鼠标浮动的事件
                            zZ(this).mouseover(function () {
                                zZ(this).attr('ttx', "0");
                                zZ(this).attr('tty', "0");
                                zZ(this).css('opacity', '0.8');
                                zZ(this).stopAnimation();
                                zZ(this).animation([['zNum.ttx', this.attributes["tran"].x, '', '>-', '0'],
                                           ['zNum.tty', this.attributes["tran"].y, '', '>-', '0']], 800, null, function () {
                                               zZ(this).attr('transform', "translate(" + zZ(this).attr('ttx') + "," + zZ(this).attr('tty') + ")");
                                           });
                            });
                            //设置鼠标浮动的事件
                            zZ(this).mouseout(function () {
                                zZ(this).css('opacity', '1');
                                zZ(this).stopAnimation();
                                zZ(this).animation([['zNum.ttx', "0", '', '>-', zZ(this).attr('ttx')],
                                           ['zNum.tty', "0", '', '>-', zZ(this).attr('tty')]], 800, null, function () {
                                               zZ(this).attr('transform', "translate(" + zZ(this).attr('ttx') + "," + zZ(this).attr('tty') + ")");
                                           });
                            });
                        }, function () {
                            //获得当前时间截中的半径
                            this.setR(zZ(this).attr("r"));
                            //使用当前时间截中的上一个角度+当前时间截中的当前的角度 得到结束的角度
                            var t = Number(zZ(this).attr("t")) + Number(zZ(this).attr("preT"));
                            //自动去设置结束的坐标，并得到坐标
                            var endPoint = this.autoBow(t, zZ(this).attr("preT"));
                            //获得并设置开始的坐标
                            var startPoint = this.getPointAnyAngleAnyRadiu(Number(zZ(this).attr("t")), Number(zZ(this).attr("r")), { x: Number(zZ(this).attr("cx")), y: Number(zZ(this).attr("cy")) });
                            this.setStartPoint(startPoint);
                        });
                        //设置上个角度
                        lastAngl = t;
                        //将开始点，设为上个扇形的结束点
                        startPoint = endPoint;
                        aTime += 80;
                    }
                    //将数据整合，返回结果
                    options.chart.data = data;
                    return options;
                }
                ,
                //创建扇形对应的文本
                createText: function (options) {
                    var data = options.chart.data;
                    var mAdd = 15;
                    //先创建小于180度的
                    for (var item in data) {
                        //获取lable开始的中点
                        //data[item]["lableStartPoint"] = fan.getPointAnyAngleAnyRadiu(centerAngel, r, centerPoint);
                        //获取lable结束的中点
                        var lableAngel = data[item].obj.attributes["lableAngel"];
                        var r = data[item].obj.attributes["r"];
                        var centerPoint = data[item].obj.attributes["centerPoint"];

                        //测试文字是否会重叠
                        //取出上一个对象
                        var lastItem = undefined;
                        //先计算大于180度的
                        if (lableAngel > -90 && lableAngel < 90) {

                            if (item == 0) {
                                if (lableAngel < -45) {
                                    data[item].obj.attributes["lableAngel"] += mAdd;
                                    lableAngel = data[item].obj.attributes["lableAngel"];
                                }
                            } else {
                                lastItem = data[item - 1];
                                //测试上一个对象的角是否在当前对象的5度角之内
                                //如果当前对象角度<上一个对象角度的5度
                                //那么当前对象的角度应该是上一个对象的角度+5
                                if (lableAngel < (lastItem.obj.attributes["lableAngel"] + mAdd)) {
                                    data[item].obj.attributes["lableAngel"] = lastItem.obj.attributes["lableAngel"] + mAdd;
                                    lableAngel = data[item].obj.attributes["lableAngel"];
                                }
                            }



                            var lableEndPoint = data[item].obj.getPointAnyAngleAnyRadiu(lableAngel, r + r / 4, centerPoint);

                            //创建span
                            var text = zZ.Zstatic.zChart.createItem.text({ x: lableEndPoint.x, y: lableEndPoint.y, value: data[item].name + "：" + data[item].data });
                            if (lableAngel > 90 && lableAngel <= 270) {
                                text.setAttribute('text-anchor', 'end');
                            } else {
                                text.setAttribute('text-anchor', 'start');
                            }
                            zZ.Zstatic.zChart.createItem.apply(options.box.id, text);
                            data[item]['text'] = text;
                        }
                    }

                    //再创建大于180度的
                    for (var item = data.length - 1; item > 0; item--) {
                        //获取lable开始的中点
                        //data[item]["lableStartPoint"] = fan.getPointAnyAngleAnyRadiu(centerAngel, r, centerPoint);
                        //获取lable结束的中点
                        var lableAngel = data[item].obj.attributes["lableAngel"];
                        var r = data[item].obj.attributes["r"];
                        var centerPoint = data[item].obj.attributes["centerPoint"];

                        //测试文字是否会重叠
                        //取出上一个对象
                        var lastItem = undefined;

                        //先计算大于180度的
                        if (lableAngel > 90 && lableAngel < 270) {

                            if (item == data.length - 1) {
                                if (lableAngel > 225) {
                                    data[item].obj.attributes["lableAngel"] -= mAdd;
                                    lableAngel = data[item].obj.attributes["lableAngel"];
                                }
                            } else {
                                lastItem = data[item + 1];
                                //测试上一个对象的角是否在当前对象的5度角之内
                                //如果当前对象角度<上一个对象角度的5度
                                //那么当前对象的角度应该是上一个对象的角度+5
                                if (lableAngel > (lastItem.obj.attributes["lableAngel"] - mAdd)) {
                                    data[item].obj.attributes["lableAngel"] = lastItem.obj.attributes["lableAngel"] - mAdd;
                                    lableAngel = data[item].obj.attributes["lableAngel"];
                                }
                            }


                            var lableEndPoint = data[item].obj.getPointAnyAngleAnyRadiu(lableAngel, r + r / 4, centerPoint);

                            //创建span
                            var text = zZ.Zstatic.zChart.createItem.text({ x: lableEndPoint.x, y: lableEndPoint.y, value: data[item].name + "：" + data[item].data });
                            if (lableAngel > 90 && lableAngel <= 270) {
                                text.setAttribute('text-anchor', 'end');
                            } else {
                                text.setAttribute('text-anchor', 'start');
                            }
                            zZ.Zstatic.zChart.createItem.apply(options.box.id, text);
                            data[item]['text'] = text;
                        }
                    }

                    return options;
                }
                , //创建连接线
                createLine: function (options) {
                    var data = options.chart.data;
                    for (var item in data) {
                        var centerAngel = data[item].obj.attributes["centerAngel"];
                        var lableAngel = data[item].obj.attributes["lableAngel"];
                        var r = data[item].obj.attributes["r"];
                        var centerPoint = data[item].obj.attributes["centerPoint"];

                        var startPoint = data[item].obj.getPointAnyAngleAnyRadiu(centerAngel, r + r / 16, centerPoint);
                        var endPoint = data[item].obj.getPointAnyAngleAnyRadiu(centerAngel, r + r / 8, centerPoint);
                        var lablePoint = data[item].obj.getPointAnyAngleAnyRadiu(lableAngel, r + r / 5, centerPoint);

                        //创建line
                        var line = zZ.Zstatic.zChart.createItem.line({ startPoint: startPoint, endPoint: lablePoint, cOnePoint: endPoint, cTowPoint: endPoint, cEndPoint: lablePoint });
                        zZ.Zstatic.zChart.createItem.apply(options.box.id, line);
                        zZ(line).attr('stroke-width', '1');
                        zZ(line).attr('stroke', '#454545');
                        zZ(line).attr("zIndex", "0");
                        zZ(line).attr("fill", "none");

                        data[item]['line'] = line;
                    }
                    return options;
                }
                ,
                //创建标题
                createTitle: function (options) {
                    //创建span
                    var text = zZ.Zstatic.zChart.createItem.text({ x: 0, y: 0, value: options.box.title });
                    zZ.Zstatic.zChart.createItem.apply(options.box.id, text);
                    text = zZ(text);
                    text.attr('y', '25')
                        .css('text-align', 'center')
                        .css('height', '25px')
                        .attr('fill', '#32004a')
                        .css('font-size', '25px;')
                        .attr('x', options.box.width / 2 - text.width() / 2);

                    ////创建隔栏
                    startPoint = { x: 5, y: 35 };
                    endPoint = { x: options.box.width - 10, y: 35 };
                    var line = zZ.Zstatic.zChart.createItem.line({ startPoint: startPoint, endPoint: endPoint, cOnePoint: startPoint, cTowPoint: startPoint, cEndPoint: startPoint });
                    zZ.Zstatic.zChart.createItem.apply(options.box.id, line);
                    zZ(line).attr('stroke-width', '1');
                    zZ(line).attr('stroke', '#cccccc');
                    zZ(line).attr("zIndex", "0");
                    zZ(line).attr("fill", "none");
                    return options;
                }
                ,
                //创建图例
                createLegend: function (options) {

                    //定义每一个图例方形的属性
                    var everyRect = { width: 20, height: 10, margin: 5 }
                    var everyText = { margin: 3 }
                    //开始x为零
                    var x = 0;
                    //开始y为当前容器的高度
                    var y = options.box.height - everyRect.height - everyRect.margin;
                    //将数据从参数中抽出
                    var data = options.chart.data;
                    //开始循环填充图例
                    for (var item in data) {
                        //判断x是否会推出范围
                        //创建文字对象，y轴要减去之前小图标的10像素
                        var text = zZ.Zstatic.zChart.createItem.text({ x: 0, y: 0, value: data[item].name });
                        zZ.Zstatic.zChart.createItem.apply(options.box.id, text);
                        var dynX = everyRect.width + everyRect.margin + everyText.margin + everyRect.margin + x + zZ(text).width() + everyRect.margin;
                        //如果已经推出范围
                        if (dynX > options.box.width) {
                            var allLegendItem = zZ('#' + options.box.id).find(':legend=legend').Elements();
                            //将之前创建过的所有items往上推 边距+高度+边距

                            for (var i = 0; i < allLegendItem.length; i++) {
                                zZ(allLegendItem[i]).attr('y', zZ(allLegendItem[i]).attr('y') - (everyRect.height + everyRect.margin));
                            }
                            x = 0;
                            y = options.box.height - everyRect.height - everyRect.margin;
                        }

                        //先填充左边距
                        x += everyRect.margin;
                        //建立图例的小图标
                        var rect = zZ.Zstatic.zChart.createItem.rect({ rx: 2, ry: 2, x: x, y: y, width: everyRect.width, height: everyRect.height,
                            style: "fill:" + data[item].color + ";"
                        });
                        zZ(rect).attr('legend', 'legend');
                        //将小图标加入到显示范围之中
                        zZ.Zstatic.zChart.createItem.apply(options.box.id, rect);
                        //将x推至刚刚才建立的小图标的宽度加右边距+加上文字的左边距
                        x += everyRect.width + everyRect.margin + everyText.margin;

                        //设置文字对象的图形参数
                        text.setAttribute('text-anchor', 'start');
                        text.setAttribute('legend', 'legend');
                        text.setAttribute('x', x);
                        text.setAttribute('y', y + everyRect.height);

                        //将x轴推至刚才加入的text的宽度，和每个小图标的右边距
                        x += zZ(text).width() + everyRect.margin;
                    }
                    return options;
                }
                ,
                //创建饼状图
                init: function (options) {

                    //获得数据值的百分比/获得计算后的data
                    options.chart.data = zZ.Zstatic.zChart.createChart.pie.getPreOfData(options.chart.data);

                    //构建扇形
                    options = zZ.Zstatic.zChart.createChart.pie.createFans(options);

                    //构建完扇形构建text
                    options = zZ.Zstatic.zChart.createChart.pie.createText(options);

                    //创建完text创建连接线
                    options = zZ.Zstatic.zChart.createChart.pie.createLine(options);

                    //创建完连接线创建标题
                    options = zZ.Zstatic.zChart.createChart.pie.createTitle(options);

                    //创建完标题创建图例
                    options = zZ.Zstatic.zChart.createChart.pie.createLegend(options);

                }
            }
        }
        , //映射器
        charTypeList: {}
        ,
        //图形对象构造器
        createItem: {
            apply: function (id, obj) {
                document.getElementById(id).appendChild(obj);
            }
            , //创建图形容器
            g: function (options) {
                var g = document.createElementNS(zZ.Zstatic.zChart.xmlns, 'g');
                g.setAttribute('transform', 'translate(' + options.translate.x + ',' + options.translate.y + ')');
                return g;
            }
            , //创建文字对象
            text: function (options) {
                var text = document.createElementNS(zZ.Zstatic.zChart.xmlns, 'text');

                //设置属性
                text.setAttribute('x', options.x);
                text.setAttribute('y', options.y);
                text.setAttribute('style', 'font-family:Arial;font-size:12px;');
                text.setAttribute('zIndex', '1');
                text.textContent = options.value;

                return text;
            }
            , //创建矩形对象
            rect: function (option) {
                var rect = document.createElementNS(zZ.Zstatic.zChart.xmlns, 'rect');

                zZ(rect).attr('x', option.x);
                zZ(rect).attr('y', option.y);
                zZ(rect).attr('rx', option.rx);
                zZ(rect).attr('ry', option.ry);
                zZ(rect).attr('width', option.width);
                zZ(rect).attr('height', option.height);
                zZ(rect).attr('style', option.style);

                return rect;
            }
            , //创建line对象
            //参数option:{startPoint:{x:0,y:0},endPoint:{x:0,y:0},cOnePoint:{x:0,y:0},cTowPoint:{x:0,y:0},cEndPoint:{x:0,y:0}}
            line: function (option) {
                var path = document.createElementNS(zZ.Zstatic.zChart.xmlns, 'path');
                //开始点坐标
                path.attributes['startPoint'] = { x: option.startPoint.x || 0, y: option.startPoint.y || 0 };
                //结束点坐标
                path.attributes['endPoint'] = { x: option.endPoint.x || 0, y: option.endPoint.y || 0 };
                //c的第一个坐标
                path.attributes['cOnePoint'] = { x: option.cOnePoint.x || 0, y: option.cOnePoint.y || 0 };
                //c的第二个坐标
                path.attributes['cTowPoint'] = { x: option.cTowPoint.x || 0, y: option.cTowPoint.y || 0 };
                //c的结束坐标
                path.attributes['cEndPoint'] = { x: option.cEndPoint.x || 0, y: option.cEndPoint.y || 0 };

                //应用参数
                path.usePara = function () {
                    var d = "M " + this.attributes['startPoint'].x + " " + this.attributes['startPoint'].y + " C " + this.attributes['cOnePoint'].x + " " + this.attributes['cOnePoint'].y + "  " + this.attributes['cTowPoint'].x + " " + this.attributes['cTowPoint'].y + "  " + this.attributes['cEndPoint'].x + " " + this.attributes['cEndPoint'].y + " L " + this.attributes['endPoint'].x + " " + this.attributes['endPoint'].y;
                    this.setAttribute('d', d);
                }

                //设置开始点坐标
                path.setStartPoint = function (json) {
                    this.attributes['startPoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //设置结束点坐标
                path.setStartPoint = function (json) {
                    this.attributes['endPoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //设置c的第一个坐标
                path.setcOnePoint = function (json) {
                    this.attributes['cOnePoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //设置c的第二个坐标
                path.setcTowPoint = function (json) {
                    this.attributes['cTowPoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //设置c的结束坐标
                path.setcEndPoint = function (json) {
                    this.attributes['cEndPoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //配置默认option
                path.usePara(option);

                return path;
            }
            ,
            //创建扇形对象
            //参数option:{startPoint:{x:0,y:0},r:0,brs:0,endPoint:{x:0,y:0},centerPoint:{x:0,y:0}}
            fan: function (option) {
                var path = document.createElementNS(zZ.Zstatic.zChart.xmlns, 'path');
                //开始点坐标
                path.attributes['startPoint'] = { x: option.startPoint.x || 0, y: option.startPoint.y || 0 };
                //半径
                path.attributes['r'] = option.r || 0;
                //大圆/小圆
                path.attributes['brs'] = option.bts || 0;
                //结束点坐标
                path.attributes['endPoint'] = { x: option.endPoint.x || 0, y: option.endPoint.y || 0 };
                //圆心坐标
                path.attributes['centerPoint'] = { x: option.centerPoint.x || 0, y: option.centerPoint.y || 0 };

                //应用参数
                path.usePara = function () {
                    var d = "M " + this.attributes['startPoint'].x + " " + this.attributes['startPoint'].y + " A " + this.attributes['r'] + " " + this.attributes['r'] + " 0 " + this.attributes['brs'] + " 1 " + this.attributes['endPoint'].x + " " + this.attributes['endPoint'].y + "   L " + this.attributes['centerPoint'].x + " " + this.attributes['centerPoint'].y + " Z";
                    this.setAttribute('d', d);
                }

                //设置开始点坐标
                path.setStartPoint = function (json) {
                    this.attributes['startPoint'] = { x: json.x, y: json.y };
                    this.usePara();
                }

                //设置半径
                path.setR = function (r) {
                    this.attributes['r'] = r;
                    this.usePara();
                }

                //设置 大圆/小圆
                path.setBrs = function (brs) {
                    this.attributes['brs'] = brs;
                    this.usePara();
                }

                //设置 结束点坐标
                path.setEndPoint = function (json) {
                    this.attributes['endPoint'] = json;
                    this.usePara();
                }

                //设置 圆心坐标
                path.setCenterPoint = function (json) {
                    this.attributes['centerPoint'] = json;
                    this.usePara();
                }

                //自动形成弧度
                //传入已经堆积的角t,和纯角prePie
                path.autoBow = function (t, prePie) {
                    //设置结束坐标点
                    this.setEndPoint(this.getPointAnyAngleAnyRadiu(t, this.attributes['r'], this.attributes['centerPoint']));

                    //设置大弧/小弧
                    //角度大于180就是大弧
                    if (prePie > 180) {
                        this.setBrs(1);
                    }
                    else {
                        this.setBrs(0);
                    }

                    //返回终点坐标
                    return this.attributes['endPoint'];
                }

                //使用任何角度任何半径获得结束坐标点
                //angle角度
                //radiu半径
                path.getPointAnyAngleAnyRadiu = function (angle, radiu, centerPoint) {
                    //计算弧度，弧度=角度*pai/180
                    var PIEt = angle * Math.PI / 180;

                    //设置弧的终点坐标  x = 开始x+cos弧度*半径
                    var result = { x: centerPoint.x + (Math.cos(PIEt) * radiu)
                        , //设置弧的终点坐标  y = 开始y+sin弧度*半径
                        y: centerPoint.y + (Math.sin(PIEt) * radiu)
                    };
                    return result;
                }

                //配置默认option
                path.usePara();

                //返回生成的对象
                return path;
            }
        }
    }

    //制造一个图表
    //传入options配置{box:{title:'xxx',width:0,height:0,style:'',class:''},chart:{type:'pie',data:[]}}
    zT.zChart = function (options) {
        //获得容器
        container = this.lObj[0];
        //生成容器id
        options.box.id = "zTool_Chart_" + (+new Date / Math.random()).toString().replace('.', '');
        //获取容器大小
        options = zZ.Zstatic.zChart.getCotainerSize(options, container);
        //创建容器
        zZ.Zstatic.zChart.createSvgCotainer(options, container);
        //应用样式和class
        if (options.box.style) {
            zZ(options.box.id).attr('style', options.box.style);
        }
        if (options.box.class) {
            zZ(options.box.id).attr('class', options.box.class);
        }

        //构建报表
        //从构造器中取出构建报表的方法，将options传入
        zZ.Zstatic.zChart.charTypeList[options.chart.type](options);
    }

    //构建映射
    zZ.Zstatic.zChart.charTypeList['pie'] = window.zZ.Zstatic.zChart.createChart.pie.init;


});