//zTool.Core - alpha 1.1.4 - Beta 1.1.0 
//廖力编写@2012-12-27 ~ 2013-12-18
//DOM集成对象操作器
//-----------------------------------------

/*
------------------------------------代码大纲------------------------------------
一.基本功能：
1.zTool核心/基本/选择器
2.HTML对象操作
3.HTML属性操作
4.HTML事件操作

二.富功能：
1.动画操作
2.ajax通讯
3.辅助工具
:2013-06-10
--------------------------------------------------------------------------------
【zTool.Core】
向使用者说明如何剔除/组合这些代码：
除去“基本功能”的“zTool核心/基本/选择器”这一块无论如何不可剔除之外，
其他的模块都可以由一些方式自由组合/剔除/或者修改。
依赖关系如下：
一.基本功能：
1.zTool核心/基本/选择器
↑ 【2.HTML对象操作】必须依赖【1.zTool核心/基本/选择器】
2.HTML对象操作
↑ 【3.HTML属性操作】必须依赖【2.HTML对象操作】
3.HTML属性操作
↑ 【 4.HTML事件操作】必须依赖【3.HTML属性操作】
4.HTML事件操作

以上为“基本功能”内模块之间的依赖关系，如果打破上文所示的依赖关系，笔者
未在这种情况下做过严格测试，如果您打算这么做，笔者认为容易出现一些问题。
富功能中的依赖关系如下图：

【基本功能】
↑         ↑          ↑
1.动画操作  2.ajax通讯  3.辅助工具

“富功能”中的任意模块可以和“基本功能”搭配，但是请确保“富功能”中的任
何模块在和“基本功能”搭配的同时，“基本功能”中的四个子模块一并存在，笔者在
开发过程中并未考虑更为灵活的搭配方式，假如您想尝试，可能会出现一些问题。
:2013-06-10
*/


//////////////////////////////////////////////////////////////////////基本功能//////////////////////////////////////////////////////////////////



//==============================================================================================================================================
//*********************************************************第一部分，zTool基本,基本的zTool结构**************************************************
//该部分包含:
//1.基础的zTool.fn封装对象,zZ对象，_zTool对象
//2.html元素选择器，选择器提供基础的html元素筛选
//3.全局静态zZ.Zstatic json原型，原型中放置zTool内部使用的全局静态变量，以及全局静态方法
//4.数组操作的一些自定义方法
//5.去除前后空格的方法
//:2013-06-10
//==============================================================================================================================================


//对象操作器
//更新于2013-09-01
//更新内容：增加闭包，以避免代码作用域混乱
(function (window) {
    window.zTool = window.zZ = function (input) {
        return new _zTool(input);
    };
    //建立主函数
    window._zTool = function (inputObj) {
        //输入的字符串/对象
        this.InputObj = inputObj;

        //判断用户是否是想创建一个元素对象                                                                    //判断一对完整的闭合标签，或者一个非闭合标签
        if (typeof (inputObj) == 'string' && new RegExp('^<([a-zA-Z]+)[ ]*([ ]+[a-zA-Z0-9]+=.+)*>.*</[a-zA-Z]+>$|^<([a-zA-Z]*)[ ]*([ ]+[a-zA-Z0-9]{1,}=.+)*/>$').test(inputObj)) {
            if (!this.createElement) { alert('zTool.Core：Undefined function of "zT.createElement" ,\n if you need create elements width zTool.Core, \n please add "part 2" of zebra tool to your zTool.Core-Beta-x.x.x.js.') }
            this.lObj = this.createElement(inputObj);
        } else {
            //进入简单选择器,开始查找元素，并存入元素数组
            this.lObj = this.findElement(inputObj);
        }
    }

    //设置主函数的属性/方法
    window.zZ.fn =
    window._zTool.prototype =
    window.zT =
    {//为方便调试记录选择器分析的文本 ：2013-02-26
        InputObj: null
    , //查找元素
        findElement: function (selectObj) {
            var elements = [];
            //一级选择器
            if (selectObj) {
                switch (typeof (selectObj)) {
                    case 'string': //如果是STRING说明传入的是对象ID 或者某种选择器
                        elements = this.stringSeleter(selectObj);
                        break;
                    case 'object': //如果是object说明传入的是个对象
                        elements.push(selectObj);
                        break;
                }
            }
            return elements;
        }
    ,   //文本选择分析器
        stringSeleter: function (string, inputNode) {
            var elements = [];
            if (!inputNode) { inputNode = document.documentElement.childNodes; }
            //通过样式选择
            if (new RegExp('^[\.]').test(string)) {
                string = string.replace('.', '');
                var allElements = document.body;
                elements = zZ.Zstatic.selector.selectCss(inputNode, string);
                return elements;
            }

            //通过ID选择
            if (new RegExp('^[\#]').test(string)) {
                string = string.replace('#', '');
                elements = zZ.Zstatic.selector.selectPrototype(inputNode, "id=" + string);
                return elements;
            }

            //通过tagName
            if (new RegExp('^<.{1,}>').test(string)) {
                string = string.replace('<', '').replace('>', '');
                elements = zZ.Zstatic.selector.selectTagName(inputNode, string);
                return elements;
            }

            //通过属性获取对象数组selectPrototype
            if (new RegExp('(^[\:])([a-zA-Z0-9]{1,}=.{1,}$)').test(string)) {
                string = string.replace(':', '');
                elements = zZ.Zstatic.selector.selectPrototype(inputNode, string);
                return elements;
            }

            //默认通过ID选择
            elements.push(document.getElementById(string));
            return elements;
        }
    ,   //通过某种条件，在已经找到的对象中继续查找(可以使用一级选择器所有的语法)
        find: function (input) {
            //通过属性获取对象数组selectPrototype
            this.lObj = this.stringSeleter(input, this.lObj);
            return this;
        }
    ,   //返回所有找到的对象(对象数组)
        Elements: function () {
            if (this.lObj.length == 0) { return undefined };
            return this.lObj;
        }
    ,    //返回找到的对象（单个对象）
        E: function () {
            if (this.lObj.length == 0) { return undefined };
            return this.lObj[0];
        }
    ,   //删除某数组里的某值的项目
        delArr: function (arr, value) {
            var rArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != value) {
                    rArr.push(arr[i]);
                }
            }
            return rArr;
        }
    ,   //清除数组中不存在的元素 :  2013-02-26
        clearEmptyItem: function (arr) {
            var rArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    rArr.push(arr[i]);
                }
            }
            return rArr;
        }
    ,   //将一组数组中的栈压倒另一个数组中去
        joinArr: function (inArr, pArr) {
            for (var i = 0; i < pArr.length; i++) {
                inArr.push(pArr[i]);
            }
            return inArr;
        }
    ,   //去除前后空格
        trim: function (str) {
            if (str == '') { return str }
            return str.toString().trim();
        }
    };

    //全局静态方法/变量
    window.zZ.Zstatic = {
        clCss: null,
        //需要进行动画计时的对象列表{'lpoolID':xxxxxx,'lpoolObj':xxxxxx,'startTime':xxxxxx,'TotalTime':xxxxxx,'options':xxxxxx,'state':play/stop,'action':xxxxxx,'callBack':xxxxxx}
        intervalList: [],
        //帧渲染频率
        frequencyTime: 1,
        //动作
        frameAction: null,
        //动画计时器
        fxFrame: null,
        //动画计时器的方法
        fxFrameFunction: null,
        //选择器选择组件
        selector: null,
        //{zTool_Delay_id:'',timer:xxxx}
        delayTimerArr: []
    }

    //选择器
    window.zZ.Zstatic.selector = {
        //CSS选择器
        selectCss: function (nodes, string) {
            var elements = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].getAttribute) {
                    if (nodes[i].getAttribute('className') || nodes[i].getAttribute('class')) {
                        if (nodes[i].getAttribute('className')) {
                            if (zZ.fn.trim(nodes[i].getAttribute('className')) == string) {
                                elements.push(nodes[i]);
                            }
                        } else {
                            if (zZ.fn.trim(nodes[i].getAttribute('class')) == string) {
                                elements.push(nodes[i]);
                            }
                        }
                    }
                }
                if (nodes[i].childNodes) {
                    elements = zZ.fn.joinArr(elements, zZ.Zstatic.selector.selectCss(nodes[i].childNodes, string));
                }
            }
            return elements;
        }
,
        //属性选择器
        selectPrototype: function (nodes, string) {
            var elements = [],
        Pname = string.split('=')[0],
        Pvalue = string.split('=')[1];
            for (var i = 0; i < nodes.length; i++) {
                var added = false;
                if (nodes[i][Pname]) {
                    if (nodes[i][Pname].toString().trim() == Pvalue.trim()) {
                        elements.push(nodes[i]);
                        added = true;
                    }
                }

                if (!added) {
                    if (nodes[i].attributes) {
                        if (nodes[i].attributes[Pname]) {
                            if (nodes[i].attributes[Pname].value == Pvalue) {
                                elements.push(nodes[i]);
                            }
                        }
                    }
                }

                if (nodes[i].childNodes) {
                    elements = zZ.fn.joinArr(elements, zZ.Zstatic.selector.selectPrototype(nodes[i].childNodes, string));
                }
            }
            return elements;
        }
,
        //tagName选择器
        selectTagName: function (nodes, string) {
            var elements = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].tagName) {
                    if (nodes[i].tagName.toLowerCase() == string.toLowerCase()) {
                        elements.push(nodes[i]);
                    } else if (string == '*') { elements.push(nodes[i]); }
                }

                if (nodes[i].childNodes) {
                    elements = zZ.fn.joinArr(elements, zZ.Zstatic.selector.selectTagName(nodes[i].childNodes, string));
                }
            }
            return elements;
        }
    }

    //TRIM方法
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }

    //此段代码并非本人所写
    //此代码来源于http://www.json.org/js.html
    //若有兴趣可进入以上链接研读该代码
    //
    //此代码功能为:
    //在ie6/7下可使用JSON对象
    //增加JSON.stringify()方法
    //增加JSON.parse()方法
    //
    //若您认为此代码无用，可将其剔除，解除在ie6/7下对JSON对象的支持
    //更新于2013-09-25
    "object" != typeof JSON && (JSON = {}), function () { "use strict"; function f(a) { return 10 > a ? "0" + a : a } function quote(a) { return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) { var b = meta[a]; return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' } function str(a, b) { var c, d, e, f, h, g = gap, i = b[a]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, h = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (f = i.length, c = 0; f > c; c += 1) h[c] = str(c, i) || "null"; return e = 0 === h.length ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e } if (rep && "object" == typeof rep) for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)); else for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)); return e = 0 === h.length ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf() }); var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; "function" != typeof JSON.stringify && (JSON.stringify = function (a, b, c) { var d; if (gap = "", indent = "", "number" == typeof c) for (d = 0; c > d; d += 1) indent += " "; else "string" == typeof c && (indent = c); if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify"); return str("", { "": a }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { function walk(a, b) { var c, d, e = a[b]; if (e && "object" == typeof e) for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]); return reviver.call(a, b, e) } var j; if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) } ();

})(window);


//==============================================================================================================================================
//*********************************************************第二部分，HTML对象操作***************************************************************
//该部分主要围绕操作HTML节点
//该部分包含:
//1.使用zZ(input)构造一个或多个元素
//1.获取子节点
//2.获取父节点
//3.设置innerHTML值
//4.在某节点里增加一个元素
//5.清空某元素下的所有子级节点
//6.在某节点之前插入
//7.在某节点之后插入：2013-06-11
//8.用某个元素去替换某个元素
//9.克隆对象，使之不产生任何指针引用
//:2013-06-10
//==============================================================================================================================================
//获取子节点
zT.childen = function () {
    var elements = [];
    for (var i = 0; i < this.lObj[0].childNodes.length; i++) {
        if (this.lObj[0].childNodes[i].tagName) {
            elements.push(this.lObj[0].childNodes[i]);
        }
    }
    this.lObj = elements;
    return this;
} //获取父节点
zT.parent = function () {
    var a = [];
    a.push(this.lObj[0].parentNode);
    this.lObj = a;
    return this;
} //设置innerHTML值
zT.html = function (v) {
    if (this.lObj.length == 0) { return undefined };
    if (!v) { return this.lObj[0].innerHTML; }
    for (var j = 0; j < this.lObj.length; j++) {
        this.lObj[j].innerHTML = v;
    }
    return this;
}  //创建元素
zT.createElement = function (input) {
    var adder = document.createElement('div'), sub = "", nodes = null,
             identity = 'data-zTool-appendNode-' + (+new Date / Math.random()).toString().replace('.', '');

    //将输入的HTML去除前后空格
    input = zZ.fn.trim(input);
    //判断之中是否有tbody,thead,tr,tfoot 有的话便创建table 而不是div
    sub = 0
    if (new RegExp('^[ ]{0,}<(td|th|tr|thead|tbody|tfoot)').test(input)) {
        var tInput = input;
        input = "<table>" + input + "</table>";
        if (new RegExp('^[ ]{0,}<(tr)[ ]*([ ]+[a-zA-Z0-9]+=.+)*>').test(tInput)) {
            sub = 2;
        }
        else if (new RegExp('^[ ]{0,}<(td|th)[ ]*([ ]+[a-zA-Z0-9]+=.+)*>').test(tInput)) {
            sub = 3;
        }
        else {
            sub = 1;
        }
    }
    //设置一个临时容器，将要append的元素放进去先
    adder.setAttribute('id', identity);
    adder.innerHTML = input;
    document.body.appendChild(adder);

    //让浏览器去构造用户输入的元素，我们在这里只需要获得浏览器已经构造好的元素
    nodes = document.getElementById(identity);

    //一旦检测到类似table这样的元素的时候，
    //会启动一个类似于计数器的东西，
    //它将记录我们真正要获得的元素在第几个嵌套里
    var thatObj = document.getElementById(identity);
    for (var i = 0; i < sub; i++) {
        thatObj = thatObj.childNodes[0];
    }
    nodes = thatObj.childNodes;

    //再将我们要添加的内容复制到内存中去
    var nodeArr = [];
    for (var i = 0; i < nodes.length; i++) {
        nodeArr.push(zZ.fn.clone(nodes[i]));
    }
    //将临时容器删除,消灭作案证据(偷笑)
    document.body.removeChild(document.getElementById(identity));
    return nodeArr;
}  //在某节点里增加一个元素
zT.append = function (input) {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        if (typeof (input) == 'string') {
            var nodeArr = this.createElement(input);
            for (var i = 0; i < nodeArr.length; i++) {
                this.lObj[j].appendChild(nodeArr[i]);
            }
        } else {
            this.lObj[j].appendChild(input);
        }
    }
    return this;
} //向某节点插入
zT.appendTo = function (input) {
    if (this.lObj.length == 0) { return undefined }
    var appNode = zTool(input).Elements();
    var cNodes = [];
    for (var i = 0; i < appNode.length; i++) {
        for (var j = 0; j < this.lObj.length; j++) {
            var tNode = zT.clone(this.lObj[j]);
            appNode[i].appendChild(tNode);
            cNodes.push(tNode);
        }
    }
    this.lObj = cNodes;
    return this;
} //清空某元素下的所有子级节点
zT.empty = function () {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        if (this.lObj[j].childNodes.length != 0) {
            this.lObj[j].removeChild(this.lObj[j].childNodes[0]);
            if (this.lObj[j].childNodes.length != 0) {
                zZ(this.lObj[j]).empty();
            }
        }
    }
    return this;
} //删除一个元素
zT.remove = function () {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        try { this.lObj[j].parentNode.removeChild(this.lObj[j]); } catch (e) { };
    }
}  //在某节点之前插入
zT.insertBefore = function (input) {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        if (typeof (input) == 'string') {
            var adder = document.createElement('div'),
                identity = 'zTool_appendNode_' + (+new Date / Math.random()).toString().replace('.', '');
            adder.setAttribute('id', identity);
            document.body.appendChild(adder);
            document.getElementById(identity).innerHTML = input;
            var nodes = document.getElementById(identity).childNodes;

            for (var i = 0; i < nodes.length; i++) {
                var nodeNow = nodes[i];
                this.lObj[j].parentNode.insertBefore(nodeNow, this.lObj[j]); //修正BUG：2013-06-11
            }

            document.body.removeChild(document.getElementById(identity));
        } else {
            this.lObj[j].parentNode.insertBefore(input, this.lObj[j]); //修正BUG：2013-06-11
        }
    }
    return this;
} //在某节点之后插入：2013-06-11
zT.insertBehind = function (input) {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        var parent = this.lObj[j].parentNode;
        var appNode = null;
        var appendStyle = "append";
        if (parent.childNodes.length > 1) {
            appendStyle = "insertBefore";
            for (var childs = 0; childs < parent.childNodes.length; childs++) {
                if (parent.childNodes[childs] == this.lObj[j]) {
                    if (!parent.childNodes[childs + 1]) {
                        appendStyle = "append";
                        continue;
                    }
                    appNode = parent.childNodes[childs + 1];
                    continue;
                }
            }
        }

        if (appendStyle == "append") {
            zTool(parent).append(input);
        } else {
            zTool(appNode).insertBefore(input);
        }
    }
    return this;
} //用某个元素去替换某个元素/该方法有效果，
//但是没有达到预期的替换效果,需要完善:2013-06-10
//效果已经达成，问题修复！ :2013-06-10
zT.replaceWith = function (htmlDocument) {
    if (this.lObj.length == 0) { return undefined }
    for (var j = 0; j < this.lObj.length; j++) {
        var rId = "replaceWith_Sine_" + (+new Date / Math.random()).toString().replace('.', '');
        zTool(this.lObj[j]).insertBefore("<a id='" + rId + "'></a>");
        zTool(this.lObj[j]).remove();
        zTool("#" + rId).insertBefore(htmlDocument);
        zTool("#" + rId).remove();
    }
}    //克隆对象，使之不产生任何指针或引用
zT.clone = function (Object) {
    if (Object) {
        return Object.cloneNode(true);
    } else {
        return this.lObj[0].cloneNode(true);
    }
}


//==============================================================================================================================================
//*********************************************************第三部分，HTML属性操作***************************************************************
//该部分主要围绕操作HTML节点的一些属性，比如css,attribute
//也包括一些浏览器的属性
//该部分包含:
//1.获得浏览器可见区域大小的对象
//2.某对象的绝对宽度
//3.某对象的绝对高度
//4.滚动条已滚去的宽度
//5.滚动条已滚去的高度
//6.传入浏览器类型，验证是否为真(true/fales)
//7.获取当前浏览器类型
//8.传入元素对象，获得元素的静态/动态 LEFT/TOP
//9.获取css/设置css/删除css
//10.判断是否是特殊的CSS名称
//11.获取特殊的CSS值
//12.设置特殊的CSS值
//13.删除特殊的CSS值
//14.css名称变js的CSS名称格式
//15.获取attribute或设置attribute
//16.移除attribute
//17.获得value
//18.建立获取纯CSS样式的方法
//:2013-06-10
//==============================================================================================================================================

//获得浏览器可见区域大小的对象
zT.bodySize = {
    height: function () {
        return parseInt(document.documentElement.clientHeight || document.body.offsetHeight);
    }
,
    width: function () {
        return parseInt(document.documentElement.clientWidth || document.body.offsetWidth);
    }
} //某对象的绝对宽度
zT.width = function () {
    return this.lObj[0].clientWidth || this.lObj[0].offsetWidth;
} //某对象的绝对高度
zT.height = function () {
    return this.lObj[0].clientHeight || this.lObj[0].offsetHeight;
} //滚动条已滚去的宽度
zT.scrollLeft = function () {
    return this.lObj[0].scrollLeft || this.lObj[0].scrollLeft;
} //滚动条已滚去的高度
zT.scrollTop = function () {
    return this.lObj[0].scrollTop || this.lObj[0].scrollTop;
} //传入浏览器类型，验证是否为真(true/fales)
//浏览器类型字典：chrome，opera，msie，safari，firefox，gecko
zT.bor = function (b) {
    if (!b) { return this.Borwser(); }
    if (this.Borwser().indexOf(b) != -1) {
        return true;
    }
    return false;
} //获取当前浏览器类型
zT.Borwser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua == null) return "ie";
    else if (ua.indexOf('chrome') != -1) return "chrome";
    else if (ua.indexOf('opera') != -1) return "opera";
    else if (ua.indexOf('safari') != -1) return "safari";
    else if (ua.indexOf('firefox') != -1) return "firefox";
    else if (ua.indexOf('gecko') != -1) return "gecko";
    else if (ua.indexOf('msie 6.0') != -1) return "msie 6.0";
    else if (ua.indexOf('msie 7.0') != -1) return "msie 7.0";
    else if (ua.indexOf('msie 8.0') != -1) return "msie 8.0";
    else if (ua.indexOf('msie 9.0') != -1) return "msie 9.0";
    else if (ua.indexOf('msie') != -1) return "msie";
    else return "ie";
} //传入元素对象，获得元素的静态/动态 LEFT/TOP
//返回json:{x:INT,y:INT}
zT.position = function () {//2
    if (this.lObj.length == 0) { return undefined };
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera') != -1);
    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    var el = this.lObj[0];

    if (el.parentNode === null || el.style.display == 'none') {
        return null;
    }


    var parent = null;
    var pos = [];
    var box;

    if (el.getBoundingClientRect)    //IE
    {
        box = el.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        return { x: box.left + scrollLeft, y: box.top + scrollTop };
    }
    else if (document.getBoxObjectFor)    // gecko    
    {
        box = document.getBoxObjectFor(el);
        var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
        var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
        pos = [box.x - borderLeft, box.y - borderTop];
    }
    else    // safari & opera    
    {
        pos = [el.offsetLeft, el.offsetTop];
        parent = el.offsetParent;

        if (parent != el) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }

        if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;
        }
    }

    if (el.parentNode) {
        parent = el.parentNode;
    }
    else {
        parent = null;
    }

    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
        pos[0] -= parent.scrollLeft;
        pos[1] -= parent.scrollTop;

        if (parent.parentNode) {
            parent = parent.parentNode;
        }
        else {
            parent = null;
        }
    }

    return { x: pos[0], y: pos[1] };

}
//获取css/设置css/删除css
//display:block导致table等元素混乱的注释请参看第587行
zT.css = function (cssName, cssValue) {
    if (this.lObj.length == 0) { return undefined };
    var speCss = zZ.fn.ifIsSpecialCssName(cssName);

    //如果只是获取STYLE属性
    if (!cssValue && cssValue != '') {

        if (speCss) { return this.getSpecialCssValue(cssName) };
        var resultValue = zZ.Zstatic.clCss(this.lObj[0], this.cssNameToJavascript(cssName));

        //记录日期 ： 2013-02-26
        //如果是auto就是用其他的获取手段
        //AUTO现象通常出现在IE6/7/8上，已知HEIGHT/和WIDTH会出现此现象
        //将来可能要单独写个方法处理此问题
        if (resultValue == 'auto') {
            switch (cssName) {
                case "height":
                    resultValue = (this.lObj[0].clientHeight || this.lObj[0].offsetHeight) + "px";
                    break;
                case "width":
                    resultValue = (this.lObj[0].clientWidth || this.lObj[0].offsetWidth) + "px";
                    break;
                default:
                    resultValue = 0;
                    break;
            }
        }
        return resultValue;
    }

    //如果要修改/或者添加CSS属性
    if (cssValue && cssName) {
        for (var j = 0; j < this.lObj.length; j++) {
            if (cssValue == 'remove' && speCss) { this.removeSpecialCssValue(cssName, this.lObj[j]); continue; }
            if (speCss) {
                this.setSpecialCssValue(cssName, cssValue, this.lObj[j]);
                continue;
            }

            var changedCss = '',
            //获得行样式
                lineStyle = this.bor('msie') ? this.lObj[j].style.cssText : this.lObj[j].getAttribute('style');

            //如果行样式存在的话，就直接替换行样式
            if (lineStyle) {
                var styleList = lineStyle.toString().split(';');
                for (var i = 0; i < styleList.length; i++) {
                    //除了要设置的属性外 其他的照旧
                    if (this.trim(styleList[i].toString().split(':')[0]).toLowerCase() != this.trim(cssName).toLowerCase() && styleList[i] != '') {
                        changedCss += styleList[i] + ';';
                    }
                }
                //最后加上要改变的样式
                if (cssValue != 'remove') {
                    changedCss += cssName + ':' + cssValue + ';';
                }
                if (changedCss == '') { this.lObj[j].removeAttribute('style'); }
                if (this.bor('msie')) {
                    this.lObj[j].style.cssText = changedCss;
                } else {
                    this.lObj[j].setAttribute('style', changedCss);
                }
            } else {
                if (cssValue != 'remove') {
                    changedCss = cssName + ':' + cssValue + ';';
                }
                if (this.bor('msie')) {
                    this.lObj[j].style.cssText = changedCss;
                } else {
                    this.lObj[j].setAttribute('style', changedCss);
                }
            }
        }
        return this;
    }
}
//判断是否是特殊的CSS名称
zT.ifIsSpecialCssName = function (cssName) {
    //修复透明问题，由于上次优化代码导致判断错误出现在IE6下无法透明
    //已将BUG修复 2013-04-10
    if (cssName == 'opacity') {
        if (zZ.fn.bor('msie 6.0') || zZ.fn.bor('msie 7.0') || zZ.fn.bor('msie 8.0')) {
            return true;
        }
    }
    if (cssName == 'blur') {
        if (zZ.fn.bor('chrome') || zZ.fn.bor('safari') || zZ.fn.bor('opera')) {
            return true;
        }
    }
    return false;
}
//获取特殊的CSS值
zT.getSpecialCssValue = function (cssName, Obj) {
    if (cssName == 'opacity') {
        if (this.lObj[0].filters.alpha) {
            return parseInt(this.lObj[0].filters.alpha.opacity) / 100;
        }

        if (this.lObj[0].style.filter) {
            return (parseInt(this.lObj[0].style.filter.replace('alpha(opacity = ', '').replace(')', '')) / 100).toString();
        }
        return 100;
    }

    if (cssName == 'blur') {
        if (zZ.fn.bor('chrome') || zZ.fn.bor('safari') || zZ.fn.bor('opera')) {
            if (zZ.Zstatic.clCss(this.lObj[0], this.cssNameToJavascript('webkit-filter'))) {
                var value = zZ.Zstatic.clCss(this.lObj[0], this.cssNameToJavascript('webkit-filter'));
                return value.replace('blur(', '').replace(')', '');
            }
            return '0px';
        }
    }
}
//设置特殊的CSS值
zT.setSpecialCssValue = function (cssName, cssValue, Obj) {
    if (cssName == 'opacity') {
        Obj.style.filter = 'alpha(opacity=' + cssValue * 100 + ')';
    }

    if (cssName == 'blur') {
        if (zZ.fn.bor('chrome') || zZ.fn.bor('safari') || zZ.fn.bor('opera')) {
            zTool(Obj).css('-webkit-filter', 'blur(' + cssValue + ')').css('-o-filter', 'blur(' + cssValue + ')')
        }
    }
}
//删除特殊的CSS值
zT.removeSpecialCssValue = function (cssName, Obj) {
    if (cssName == 'opacity') {
        Obj.style.filter = "";
    }

    if (cssName == 'blur') {
        if (zZ.fn.bor('chrome') || zZ.fn.bor('safari') || zZ.fn.bor('opera')) {
            zTool(Obj).css('-webkit-filter', 'remove').css('-o-filter', 'remove')
        }
    }
}
//css名称变js的CSS名称格式
zT.cssNameToJavascript = function (name) {
    if (name.indexOf('-') != '-1') {
        var namearr = name.split('-');
        return namearr[0] + namearr[1].substring(0, 1).toUpperCase() + namearr[1].substring(1, namearr[1].length);
    }
    return name;
} //获取attribute或设置attribute
zT.attr = function (attrName, attrValue) {
    if (this.lObj.length == 0) { return undefined };
    //如果attrvalue存在 说明需要设置属性
    if (attrValue && attrValue) {
        for (var j = 0; j < this.lObj.length; j++) {
            if (attrName == 'class' && (this.bor('msie 6.0') || this.bor('msie 7.0') || this.bor('msie 8.0'))) { this.lObj[j].setAttribute('className', attrValue); }
            else if (attrName == 'style' && this.bor('msie')) { this.lObj[j].style.cssText = attrValue; }
            else { this.lObj[j].setAttribute(attrName, attrValue); }
        }
        return this;
    } else { //否则就是获取
        if (attrName == 'class' && (this.bor('msie 6.0') || this.bor('msie 7.0') || this.bor('msie 8.0'))) { return this.lObj[0].getAttribute('className') || this.lObj[0].getAttribute('class'); }
        if (attrName == 'style' && this.bor('msie')) { return this.lObj[0].style.cssText; }
        return this.lObj[0].getAttribute(attrName);
    }
} //移除attribute
zT.removeAttr = function (attrName) {
    for (var j = 0; j < this.lObj.length; j++) {
        if (attrName == 'class' && (this.bor('msie 6.0') || this.bor('msie 7.0') || this.bor('msie 8.0'))) { this.lObj[j].removeAttribute('className'); }
        this.lObj[j].removeAttribute(attrName);
    }
    return this;
} //获得value
zT.val = function (value) {
    if (this.lObj.length == 0) { return undefined };
    if (value == undefined || value == null) {
        return this.lObj[0].value;
    } else {
        for (var j = 0; j < this.lObj.length; j++) {
            this.lObj[j].value = value;
        }
    }
    return this;
}
//此处为建立获取纯CSS样式的方法
//非IE
if (!zZ.fn.bor('msie 6.0') && !zZ.fn.bor('msie 7.0') && !zZ.fn.bor('msie 8.0')) {
    //传入对象/JS格式的STYLE名称，返回属性值
    zZ.Zstatic.clCss = function (obj, cssName) {
        return window.getComputedStyle(obj, null)[cssName];
    }
}
//IE
else {
    zZ.Zstatic.clCss = function (obj, cssName) {
        //修正参数错误 : 2013年2月26日
        switch (cssName) {
            case "borderBottom":
                cssName = "borderBottomWidth";
                break;
            case "borderTop":
                cssName = "borderTopWidth";
                break;
            case "borderLeft":
                cssName = "borderLeftWidth";
                break;
            case "borderRight":
                cssName = "borderRightWidth";
                break;
        }
        return obj.currentStyle[cssName];
    }
}

//==============================================================================================================================================
//*********************************************************第四部分，事件操作*******************************************************************
//该部分包含事件的绑定/取消/快速绑定方法
//1.绑定事件的方法
//2.绑定事件的内部方法
//3.取消事件的方法
//4.判断是否为function的方法
//5.各种事件的快速绑定
//6.事件闭包
//:2013-06-10
//==============================================================================================================================================

//绑定事件,参考资料如下：
//参考资料来自：http://www.jb51.net/article/18220.htm
//Mozilla中： 
//addEventListener的使用方式： 
//target.addEventListener(type, listener, useCapture); 
//target： 文档节点、document、window 或 XMLHttpRequest。 
//type： 字符串，事件名称，不含“on”，比如“click”、“mouseover”、“keydown”等。 
//listener ：实现了 EventListener 接口或者是 JavaScript 中的函数。 
//useCapture ：是否使用捕捉，一般用 false 。例如：document.getElementById("testText").addEventListener("keydown", function (event) { alert(event.keyCode); }, false); 
//IE中：
//target.attachEvent(type, listener); 
//target： 文档节点、document、window 或 XMLHttpRequest。 
//type： 字符串，事件名称，含“on”，比如“onclick”、“onmouseover”、“onkeydown”等。 
//listener ：实现了 EventListener 接口或者是 JavaScript 中的函数。 例如：document.getElementById("txt").attachEvent("onclick",function(event){alert(event.keyCode);}); 
//W3C 及 IE 同时支持移除指定的事件, 用途是移除设定的事件, 格式分别如下: 
//W3C格式: 
//removeEventListener(event,function,capture/bubble); 
//Windows IE的格式如下: 
//detachEvent(event,function); 
//target.addEventListener(type, listener, useCapture); 
//target 文档节点、document、window 或 XMLHttpRequest。 
//type 字符串，事件名称，不含“on”，比如“click”、“mouseover”、“keydown”等。 
//listener 实现了 EventListener 接口或者是 JavaScript 中的函数。 
//useCapture 是否使用捕捉，看了后面的事件流一节后就明白了，一般用 false
zT.bind = function (event, callBack) {
    if (this.lObj.length == 0) { return undefined; }
    for (var i = 0; i < this.lObj.length; i++) {

        //先注销其所有事件
        this.unInsEvent(event, this.lObj[i]);

        //如果没有事件集合，就给它事件集合
        if (!this.lObj[i]['zEvent-club']) {
            this.lObj[i]['zEvent-club'] = {};
        }

        //如果没有特定事件，就给它特定事件
        if (!this.lObj[i]['zEvent-club'][event]) {
            this.lObj[i]['zEvent-club'][event] = { arr: [], fFunc: null };
        }

        //将事件单元压入栈
        this.lObj[i]['zEvent-club'][event]['arr'].push(callBack);

        //然后在对象上绑定所有事件
        this.evalEvent(this.lObj[i], event, false);
    }

    return this;
}   //绑定事件
zT.evalEvent = function (thisObj, event, useCapture) {
    //生成事件委托
    var action = new zZ.eventFunction(thisObj, thisObj['zEvent-club'][event]['arr']);
    //将最后绑定的方法的样子保存
    thisObj['zEvent-club'][event]['fFunc'] = action.callFunction;

    //判断浏览器
    //如果是IE浏览器就使用IE特有的事件绑定机制
    if (thisObj.attachEvent) {
        var eventString = 'on' + event;
        thisObj.attachEvent(eventString, action.callFunction);
    } else {
        //否则就使用标准语法绑定
        thisObj.addEventListener(event, action.callFunction, useCapture || false);
    }
} //卸载事件
zT.unInsEvent = function (event, thisObj) {
    if (!thisObj['zEvent-club']) { return; }
    if (!thisObj['zEvent-club'][event]) { return; }
    //获得事件函数
    var action = thisObj['zEvent-club'][event]['fFunc'];
    this.removeEvent(thisObj, action, event);
}
//移除事件
zT.removeEvent = function (thisObj, action, event) {
    //判断浏览器
    //如果是IE浏览器就是用IE特有的事件绑定机制
    if (thisObj.detachEvent) {
        var eventString = 'on' + event;
        thisObj.detachEvent(eventString, action);
    } else {
        thisObj.removeEventListener(event, action, false);
    }
}

////取消事件绑定
zT.unbind = function (event, func) {
    if (this.lObj.length == 0) { return undefined; }
    for (var i = 0; i < this.lObj.length; i++) {
        //先用传统的方式删除一下，避免漏掉本来就绑定在上面的事件
        if (func) { this.removeEvent(this.lObj[i], func, event); }
        //再判断用 zTool动态绑定的事件
        if (!this.lObj[i]['zEvent-club']) { return; }
        if (!this.lObj[i]['zEvent-club'][event]) { return; }
        //如果func存在，说明使用者想撤销的是单个事件
        if (func && this.lObj[i]['zEvent-club'][event]['arr'].length > 1) {
            //撤销在元素上真实绑定的所有事件先
            this.unInsEvent(event, this.lObj[i]);
            //在本元素的事件堆里寻找要撤销的事件
            for (var j = 0; j < this.lObj[i]['zEvent-club'][event]['arr'].length; j++) {
                if (this.lObj[i]['zEvent-club'][event]['arr'][j] == func) {
                    delete this.lObj[i]['zEvent-club'][event]['arr'][j];
                }
            }
            //整理一下其中的空元素
            this.lObj[i]['zEvent-club'][event]['arr'] = zZ.fn.clearEmptyItem(this.lObj[i]['zEvent-club'][event]['arr']);

            //然后在对象上绑定剩下的事件
            this.evalEvent(this.lObj[i], event, false);
        } else { //否则就是撤销所有事件
            this.unInsEvent(event, this.lObj[i]);
            //撤销该元素上事件集合中的特定事件
            this.lObj[i]['zEvent-club'][event] = undefined;
        }

    }
    return this;
}
//除去zT.ready 方法之外，以下一些方法如果在开发中认为多余，可以剔除
//可以剔除的方法如下：
//zT.click，zT.dblclick，zT.blur ，zT.focus，zT.keydown，zT.keypress，zT.keyup，zT.mousedown，zT.mousemove
//zT.mouseout，zT.mouseover，zT.mouseup，zT.change，zT.scroll，zT.load，zT.resize
//：2013-06-10
zT.click = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) {
        for (var i in this.lObj) {
            this.lObj[i].click();
        } return;
    }
    this.bind('click', callBack);
}
zT.dblclick = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].dblclick(); } return; }
    this.bind('dblclick', callBack);
}
zT.blur = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].blur(); } return; }
    this.bind('blur', callBack);
}
zT.focus = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].focus(); } return; }
    this.bind('focus', callBack);
}
zT.keydown = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].keydown(); } return; }
    this.bind('keydown', callBack);
}
zT.keypress = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].keypress(); } return; }
    this.bind('keypress', callBack);
}
zT.keyup = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].keyup(); } return; }
    this.bind('keyup', callBack);
}
zT.mousedown = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].mousedown(); } return; }
    this.bind('mousedown', callBack);
}
zT.mousemove = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].mousemove(); } return; }
    this.bind('mousemove', callBack);
}
zT.mouseout = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].mouseout(); } return; }
    this.bind('mouseout', callBack);
}
zT.mouseover = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].mouseover(); } return; }
    this.bind('mouseover', callBack);
}
zT.mouseup = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].mouseup(); } return; }
    this.bind('mouseup', callBack);
}
zT.change = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].change(); } return; }
    this.bind('change', callBack);
}
zT.scroll = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].scroll(); } return; }
    this.bind('scroll', callBack);
}
zT.load = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].load(); } return; }
    this.bind('load', callBack);
}
zT.resize = function (callBack) {
    if (!zZ.fn.isFunction(callBack)) { for (var i in this.lObj) { this.lObj[i].resize(); } return; }
    this.bind('resize', callBack);
}
zT.ready = function (callBack) {
    //2013-08-13:
    //如果方法是在页面加载后执行的，就直接执行回调函数
    if (document.readyState == "complete") {
        callBack();
        return this;
    }
    this.bind('readystatechange', function () {
        if (this.readyState == "complete") {
            callBack();
        }
    });
}     //检查对象是否为方法
zT.isFunction = function (o) {
    if (typeof (o) == 'function') { return true; }
    return false;
} //事件闭包
zZ.eventFunction = function (thisObj, callBackArr) {
    this.callFunction = function () {
        for (var i = 0; i < callBackArr.length; i++) {
            callBackArr[i].apply(thisObj, arguments);
        }
    }
}

//////////////////////////////////////////////////////////////////富功能////////////////////////////////////////////////////////////////////////
//富功能包含 动画效果模块，Ajax通讯模块，工具模块（杂项功能）



//==============================================================================================================================================
//*********************************************************第一部分，动画操作*******************************************************************
//该部分实现动画效果，动画列队等效果
//1.动画的实现方法
//2.停止动画的方法
//3.显示
//4.隐藏
//5.缓动效果类
//6.每一帧执行的动作
//7.帧对象的获取方法
//8.系统的帧对象
//:2013-06-10
//==============================================================================================================================================

//动画的实现方法，传入设置，时间,回调函数，运行时回调函数（每运行一个周期回调一次）
//效果：默认不填写为Linear, 参数分别为'--'(Linear),'-<'(easeIn),'>-'(easeOut),'<>'(easeInOut)
//ops格式为['属性(可为zNum.名称)','结束数值','单位','效果','开始数值(可不填写)']
//属性为zNum 并且填写开始数值，不填写单位的话，说明这是数值动画，可以在一些复杂的
//css滤镜或者属性中用到，详情参考api
zT.animation = function (ops, time, callBack, rCallback) {
    if (this.lObj.length == 0) { return undefined };
    for (var j = 0; j < this.lObj.length; j++) {
        //在此处获得属性的开始数值
        var options = [];

        //产生动画ID
        var aid = (+new Date / Math.random()).toString().replace('.', '');


        //填充开始数值
        for (var i = 0; i < ops.length; i++) {
            //options格式为['属性','开始数值','结束数值','单位','效果']
            options.push([ops[i][0], ops[i][4] || '-', ops[i][1], ops[i][2] || '', ops[i][3] || '']);
        }

        //每一帧执行计算的方法
        var action = zZ.Zstatic.frameAction,
        //推送动画到播放列表*填写参数
                animationSingal = { 'lpoolID': aid,
                    'lpoolObj': this.lObj[j],
                    'startTime': '-',
                    'TotalTime': time,
                    'options': options,
                    'state': 'play',
                    'action': action,
                    'callBack': callBack || null,
                    'runtimeCallback': rCallback || null
                };
        //推送!
        zZ.Zstatic.intervalList.push(animationSingal);
    }
} //停止动画的方法
zT.stopAnimation = function () {
    //先关闭动画计时器
    clearInterval(zZ.Zstatic.fxFrame);
    zZ.Zstatic.fxFrame = null;
    //删除动画精灵
    for (var j = 0; j < this.lObj.length; j++) {
        if (this.lObj[j].getAttribute('_jpool_animation_id')) {
            for (var i = 0; i < zZ.Zstatic.intervalList.length; i++) {
                if (zZ.Zstatic.intervalList[i]) {
                    //停止该对象上所有的动画而不是某个动画，所以是对比对象是否一致而不是动画id
                    if (zZ.Zstatic.intervalList[i].lpoolObj == this.lObj[j]) {
                        delete zZ.Zstatic.intervalList[i];
                    }
                }
            }
            this.lObj[j].removeAttribute('_jpool_animation_id');
        }
    }
    //清除一下无效数组:2013-06-17
    zZ.Zstatic.intervalList = zZ.fn.clearEmptyItem(zZ.Zstatic.intervalList);
    //再恢复帧对象运行
    zZ.Zstatic.fxFrame = zZ.Zstatic.fxFrameFunction();
} //显示
zT.show = function (p, callback) {
    if (this.lObj.length == 0) { return undefined; }
    if (!callback) { callback = function () { } }
    var callBackSwitch = 0;
    for (var j = 0; j < this.lObj.length; j++) {
        if (zZ(this.lObj[j]).css('display') == 'block') { callBackSwitch++; continue; }
        if (p) {

            var heightcss = '', opacitycss = '', overflowcss = '';

            if (zZ(this.lObj[j]).css('height')) {
                heightcss = zZ(this.lObj[j]).css('height');
            }

            if (zZ(this.lObj[j]).css('opacity')) {
                opacitycss = zZ(this.lObj[j]).css('opacity');
            }

            if (zZ(this.lObj[j]).css('overflow')) {
                overflowcss = zZ(this.lObj[j]).css('overflow');
            }

            //如果不是IE6或者ie7就按照W3C标准赋予DISPLAY值，如果不这么做则无法正确显示元素 ：2013-02-26
            //该问题已经调查，调查结果如下：2013-05-22
            ////在页面顶部，HTML类型标签为<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> 时，
            ////视为HTML 4.01页面模式，在该模式下需要严谨定义CSS中的DISPLAY值于对象，否则在遵从W3C HTML 4.01的浏览器中，某些元素如‘table’会发生混乱
            ////该问题解决办法有两种，分别如下
            ////////1.将页面顶部的<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">标签更换为<!DOCTYPE html>可以正常使用display:block来表示元素显示
            ////////2.不改变W3C的DOCTYPE标准的支持下，判断元素的类型，给予元素正确的渲染方法
            ////为解决此问题，本人采用了第二种解决方法
            ////然后为保证此问题能够得到完美解决，决定过段时间编写一个处理函数，判断页面支持类型，相应处理。
            if (!zZ.fn.bor('msie 7.0') && !zZ.fn.bor('msie 6.0')) {
                switch (this.lObj[j].tagName.toLowerCase()) {
                    case 'table':
                        zZ(this.lObj[j]).css('display', 'table');
                        break;
                    case 'tbody':
                        zZ(this.lObj[j]).css('display', 'table-row-group');
                        break;
                    case 'tr':
                        zZ(this.lObj[j]).css('display', 'table-row');
                        break;
                    case 'td':
                        zZ(this.lObj[j]).css('display', 'table-cell');
                        break;
                    case 'th':
                        zZ(this.lObj[j]).css('display', 'table-cell');
                        break;
                    case 'thead':
                        zZ(this.lObj[j]).css('display', 'table-header-group');
                        break;
                    case 'tfoot':
                        zZ(this.lObj[j]).css('display', 'table-footer-group');
                        break;
                    default:
                        zZ(this.lObj[j]).css('display', 'block');
                        break;
                }
            } else {
                zZ(this.lObj[j]).css('display', 'block');
            }

            var height = zZ(this.lObj[j]).height();
            zZ(this.lObj[j]).css('height', '0px').css('opacity', '0').css('overflow', 'hidden');
            zZ(this.lObj[j]).animation([['height', height, 'px', '>-'], ['opacity', 1, '', '>-']], p, function () {
                if (heightcss && !'auto') {
                    zZ(this).css('height', heightcss + 'px');
                } else { zZ(this).css('height', 'remove'); }

                if (opacitycss && !'auto') {
                    zZ(this).css('opacity', opacitycss);
                } else { zZ(this).css('opacity', 'remove'); }

                if (overflowcss && !'auto') {
                    zZ(this).css('overflow', overflowcss);
                } else { zZ(this).css('overflow', 'remove'); }
                callback.apply(this, arguments);
            });
        }
        else {
            //如果不是IE6或者ie7就按照W3C标准赋予DISPLAY值 ：2013-02-26
            //详细说明参看第1221行
            if (!zZ.fn.bor('msie 7.0') && !zZ.fn.bor('msie 6.0')) {
                switch (this.lObj[j].tagName.toLowerCase()) {
                    case 'table':
                        zZ(this.lObj[j]).css('display', 'table');
                        break;
                    case 'tbody':
                        zZ(this.lObj[j]).css('display', 'table-row-group');
                        break;
                    case 'tr':
                        zZ(this.lObj[j]).css('display', 'table-row');
                        break;
                    case 'td':
                        zZ(this.lObj[j]).css('display', 'table-cell');
                        break;
                    case 'th':
                        zZ(this.lObj[j]).css('display', 'table-cell');
                        break;
                    case 'thead':
                        zZ(this.lObj[j]).css('display', 'table-header-group');
                        break;
                    case 'tfoot':
                        zZ(this.lObj[j]).css('display', 'table-footer-group');
                        break;
                    default:
                        zZ(this.lObj[j]).css('display', 'block');
                        break;
                }
                return this;
            } else {
                zZ(this.lObj[j]).css('display', 'block');
                return this;
            }
        }
    }
    if (callBackSwitch == this.lObj.length) {
        callback.apply(this, arguments);
        return this;
    }
}    //隐藏
zT.hide = function (p, callback) {
    if (this.lObj.length == 0) { return undefined; }
    if (!callback) { callback = function () { } }
    var callBackSwitch = 0;
    for (var j = 0; j < this.lObj.length; j++) {
        if (zZ(this.lObj[j]).css('display') == 'none') { callBackSwitch++; continue; }
        if (p) {

            var heightcss = '', opacitycss = '', overflowcss = '';

            if (zZ(this.lObj[j]).css('height')) {
                heightcss = zZ(this.lObj[j]).css('height');
            }

            if (zZ(this.lObj[j]).css('opacity')) {
                opacitycss = zZ(this.lObj[j]).css('opacity');
            }

            if (zZ(this.lObj[j]).css('overflow')) {
                overflowcss = zZ(this.lObj[j]).css('overflow');
            }

            var height = zZ(this.lObj[j]).height();
            zZ(this.lObj[j]).css('height', height + "px").css('opacity', '1').css('overflow', 'hidden');
            zZ(this.lObj[j]).animation([['height', 0, 'px', '>-'], ['opacity', 0, '', '>-']], p, function () {
                zZ(this).css('display', 'none');

                if (heightcss && !'auto') {
                    zZ(this).css('height', heightcss + 'px');
                } else { zZ(this).css('height', 'remove'); }

                if (opacitycss && !'auto') {
                    zZ(this).css('opacity', opacitycss);
                } else { zZ(this).css('opacity', 'remove'); }

                if (overflowcss && !'auto') {
                    zZ(this).css('overflow', overflowcss);
                } else { zZ(this).css('overflow', 'remove'); }

                callback.apply(this, arguments);
            });
        } else {
            zZ(this.lObj[j]).css('display', 'none');
            return this;
        }
    }

    if (callBackSwitch == this.lObj.length) {
        callback.apply(this, arguments);
        return this;
    }
}

//****缓动效果类****
//****算法来自 http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html ****
//****cloudgamer编写****
//****廖力节选****
//d：  duration（持续步长）。
//c：  change in value（变化增量）；
//b：  beginning value（位置初始值）；
//t：  current time（当前步长）；
zZ.Tween = {
    //无缓动效果
    Linear: function (t, b, c, d) { return c * t / d + b; },
    //五次方的缓动
    Quint: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    }
,
    Bounce: {
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    }
}

//每一帧执行的动作
zZ.Zstatic.frameAction = function (ft, as) {
    if (!zZ(as.lpoolObj).attr('_jpool_animation_id')) { zZ(as.lpoolObj).attr('_jpool_animation_id', as.lpoolID); }
    if (zZ(as.lpoolObj).attr('_jpool_animation_id') == as.lpoolID) {

        //执行计算
        var startTime, endTime, totalTime;

        if (as.startTime == '-') {
            as.startTime = parseInt(+new Date);
        }

        //开始时间
        startTime = as.startTime;

        //结束时间
        endTime = as.startTime + as.TotalTime;

        //总时间
        totalTime = as.TotalTime;

        //参数
        options = as.options;

        //计算参数
        for (var i = 0; i < options.length; i++) {

            //在此处获取该属性的初始值
            //获取一次后不需要再度获取
            //['属性','开始数值','结束数值','单位','效果']
            if (as.options[i][1] == '-') {
                //设置display'none'的对象 到'display'
                //当对象设置了display'none'将会阻碍参数的获取
                if (zZ(as.lpoolObj).css('display') == 'none') {
                    zZ(as.lpoolObj).css('display', 'block');
                    zZ(as.lpoolObj).attr('_jpool_dpser', '_jpool_dpser');
                }
                as.options[i][1] = parseFloat(zZ(as.lpoolObj).css(as.options[i][0]).toString().replace('px'));
                if (zZ(as.lpoolObj).attr('_jpool_dpser')) {
                    zZ(as.lpoolObj).css('display', 'none');
                    zZ(as.lpoolObj).removeAttr('_jpool_dpser');
                }
            }

            //开始值
            var startValue = parseFloat(options[i][1]),

            //结束值
                endValue = parseFloat(options[i][2]),

            //总值
                totalValue = endValue - startValue,

            //老算法 ： 总值 除以 总时间 得到 速度 ，现在的时间 减去 开始的时间 得到 已逝去的时间 ， 速度乘以已逝去的时间得到现在的位置，现在的位置加上初始位置得到结果
            //computedtestNum = ((totalValue / totalTime) * (parseInt(+new Date) - startTime));
                computedNum = 0;

            //新算法
            //懂数学就是牛，下辈子一定要学好数学！
            switch (options[i][4]) {
                case '':
                case '--':
                    computedNum = zZ.Tween.Linear((parseFloat(+new Date) - startTime), startValue, totalValue, totalTime);
                    break;
                case '-<':
                    computedNum = zZ.Tween.Quint.easeIn((parseFloat(+new Date) - startTime), startValue, totalValue, totalTime);
                    break;
                case '>-':
                    computedNum = zZ.Tween.Quint.easeOut((parseFloat(+new Date) - startTime), startValue, totalValue, totalTime);
                    break;
                case '<>':
                    computedNum = zZ.Tween.Quint.easeInOut((parseFloat(+new Date) - startTime), startValue, totalValue, totalTime);
                    break;
                case '~~':
                    computedNum = zZ.Tween.Bounce.easeOut((parseFloat(+new Date) - startTime), startValue, totalValue, totalTime);
                    break
            }


            computedNum = computedNum - startValue;

            //修复误差
            if (totalValue > 0) { if (computedNum > totalValue) { computedNum = totalValue } }
            else if (totalValue < 0) { if (computedNum < totalValue) { computedNum = totalValue } }

            //算出该参数当前所处值      
            var fValue = (startValue + computedNum).toFixed(3);

            //更改对象值
            if (options[i][0].indexOf('zNum') == -1) {
                zZ(as.lpoolObj).css(options[i][0], fValue + options[i][3]);
            } else {
                zZ(as.lpoolObj).attr(options[i][0].split('.')[1], fValue + options[i][3]);
            }
        }
        //此处执行‘运行时回调函数’
        as.runtimeCallback && as.runtimeCallback.apply(as.lpoolObj, arguments);
    }
};

//帧对象的获取方法
zZ.Zstatic.fxFrameFunction = function () {
    return setInterval(function () {
        for (var i = 0; i < zZ.Zstatic.intervalList.length; i++) {
            if (zZ.Zstatic.intervalList[i]) {

                if (!zZ.Zstatic.intervalList[i].lpoolObj) {
                    delete zZ.Zstatic.intervalList[i];
                    return;
                }

                if (zZ.Zstatic.intervalList[i].state == 'play') {
                    zZ.Zstatic.intervalList[i].action(zZ.Zstatic.frequencyTime, zZ.Zstatic.intervalList[i]);
                }

                if (zZ.Zstatic.intervalList[i].startTime != '-') {
                    //如果 开始时间+总时间 < 当前时间 便结束此动画
                    if (parseInt(zZ.Zstatic.intervalList[i].startTime) + parseInt(zZ.Zstatic.intervalList[i].TotalTime) <= parseInt(+new Date)) {
                        zZ(zZ.Zstatic.intervalList[i].lpoolObj).removeAttr('_jpool_animation_id');
                        if (zZ.Zstatic.intervalList[i].callBack) {
                            zZ.Zstatic.intervalList[i].callBack.apply(zZ.Zstatic.intervalList[i].lpoolObj, arguments);
                        }
                        delete zZ.Zstatic.intervalList[i];
                        //清除一下无效数组:2013-06-17
                        zZ.Zstatic.intervalList = zZ.fn.clearEmptyItem(zZ.Zstatic.intervalList);
                        return;
                    }
                }
            }
        }
    }, zZ.Zstatic.frequencyTime);
}

//系统的帧对象
zZ.Zstatic.fxFrame = zZ.Zstatic.fxFrameFunction();

//==============================================================================================================================================
//*********************************************************第二部分，Ajax通讯*******************************************************************
//该部分实现Ajax通讯
//1.ajax发送方法 
//2.ajax获取数据方法
//3.AJAX方法 参数
//:2013-06-10
//==============================================================================================================================================

//ajax发送方法
zT.post = function (url, ajaxAction, Parameter, successCall, failedCall) {
    if (!successCall) { successCall = function () { }; }
    if (!failedCall) { failedCall = function () { }; }
    zZ.ajax(url + ajaxAction + "?refNumberAjax=" + Math.random().toString().replace('.', ''),
       { requestType: 'POST',
           asynch: true,
           sendData: Parameter,
           type: "text",
           success: function (data) {
               successCall(data);
           },
           failed: function (request, status) {
               failedCall(request, status);
           }
       });
}
//ajax获取数据方法
zT.get = function (url, ajaxAction, Parameter, successCall, failedCall) {
    if (!successCall) { successCall = function () { }; }
    if (!failedCall) { failedCall = function () { }; }
    zZ.ajax(url + ajaxAction + "?refNumberAjax=" + Math.random().toString().replace('.', ''),
       { requestType: 'GET',
           asynch: true,
           sendData: Parameter,
           type: "text",
           success: function (data) {
               successCall(data);
           },
           failed: function (request, status) {
               failedCall(request, status);
           }
       });
}


//AJAX方法 传入url，options：{requestType:GET/POST,asynch:true/false,sendData:xxxxxx,type:"text/json",success:function,failed:function}
zZ.ajax = function (url, options) {
    //定义Ajax通讯容器
    var request = false;

    var setUpAjax = function () {
        try {//应对普通浏览器
            request = new XMLHttpRequest();
        } catch (trymicrosoft) {
            try {//应对微软的XMLHTTPREQUEST4.0 : 2013-08-22
                request = new ActiveXObject("Msxml2.XMLHTTP.4.0");
            } catch (othermicrosoft) {
                try {//应对微软的XMLHTTPREQUEST
                    request = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (othermicrosoft) {
                    try {//应对更老的微软XMLHTTPREQUEST
                        request = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (failed) {//还没有就直接提示用户您浏览器实在太老了，丢不起这脸
                        request = false;
                    }
                }
            }
        }
        if (!request) {
            alert("Error! Your borwser version is too old, please upgrade your borwser!\n您的浏览器可能版本过低，请升级系统后再继续使用本网页！");
        }
    }

    //回调函数
    //在里面判断请求状态来触发回调函数
    //2013-08-22
    var callBackFunc = function () {
        //成功接受到响应
        if (request.readyState == 4) {
            if (request.status == 200) {
                //成功之后执行成功的回调函数
                options.success(request.responseText);
            }
            else {
                //失败的回调函数
                options.failed(request, request.status);
            }
        }
    }

    //初始化AJAX
    setUpAjax();

    //接收配置
    var options = options || { requestType: 'GET', asynch: true, sendData: null, type: "Text", success: function () { }, failed: function () { } }

    //如果用户注明传送类型为json,那么就将其json格式的传送值转换为string格式
    //2013-09-25
    if (options.type == "json") {
        options.sendData = JSON.stringify(options.sendData);
    }

    //打开链接
    request.open(options.requestType, encodeURI(url), options.asynch);

    //设置回调函数
    request.onreadystatechange = callBackFunc;

    //则需要设置http头以正确使用send方法,否则请求将会出现一些屎尿未及的错误
    //以form表单方式提交
    //2013-08-22
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    //发送数据
    request.send(options.sendData);
}

//==============================================================================================================================================
//*********************************************************第三部分，其他功能*******************************************************************
//包含延时执行函数
//:2013-06-10
//==============================================================================================================================================
//延时方法，延迟执行函数
zT.delay = function (time, callBack) {
    //构建委托
    var func = function (callBack, thisObj) {
        this.callBack = callBack;
        this.thisObj = thisObj;
        this.applyCallback = function () {
            zTool(thisObj).stopDelay();
            callBack.apply(thisObj, arguments);
        };
    }
    //创建委托
    var Func = new func(callBack, this.lObj[0]);
    //创建id 
    var zToolDelayId = (+new Date / Math.random()).toString().replace('.', '');
    //执行委托
    var timer = setTimeout(function () { Func.applyCallback() }, time);

    zTool(this.lObj[0]).attr('zTool_Delay_id', zToolDelayId);

    //{zTool_Delay_id:'',timer:xxxx} 将延时操作压入操作栈
    zZ.Zstatic.delayTimerArr.push({ 'zTool_Delay_id': zToolDelayId, 'timer': timer });
}
//停止某对象上的延时
zT.stopDelay = function () {
    if (zTool(this.lObj[0]).attr('zTool_Delay_id')) {
        var index = null;
        for (var i = 0; i < zZ.Zstatic.delayTimerArr.length; i++) {
            if (zZ.Zstatic.delayTimerArr[i].zTool_Delay_id == zTool(this.lObj[0]).attr('zTool_Delay_id')) {
                //注销计时器
                clearInterval(zZ.Zstatic.delayTimerArr[i].timer);
                //ID取消
                zTool(this.lObj[0]).removeAttr('zTool_Delay_id');

                index = i;
                break;
            }
        }
        zZ.Zstatic.delayTimerArr = zZ.fn.delArr(zZ.Zstatic.delayTimerArr, zZ.Zstatic.delayTimerArr[index]);
    }
    return this;
}