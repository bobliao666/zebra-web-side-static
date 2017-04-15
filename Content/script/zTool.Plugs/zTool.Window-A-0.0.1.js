//zTool.Window - alpha 0.0.1
//廖力编写@2012
//模型层弹出插件，基于zTool.Core 
//-----------------------------------------

zZ(document).ready(function () {

    //设置静态模型数组
    zZ.Zstatic.zWinModal = [];

    //静态方法集
    zZ.Zstatic.zWindow = {
        zWinBack: "zWindowz_WinBack"
,
        //设置位置的委托对象
        positionFunc: function (contentId, zWinOptions) {
            this.applyPosition = function () {
                var st = 0;
                var sl = 0;
                if (zZ.fn.bor('msie 6.0')) {
                    st = document.documentElement.scrollTop;
                    sl = document.documentElement.scrollLeft;
                }

                //主内容的位置
                if (zWinOptions.position == 'center') {
                    zTool('#' + contentId).css('top', (zZ.fn.bodySize.height() / 2 - zTool('#' + contentId).height() / 2) + st + "px");
                    zTool('#' + contentId).css('left', (zZ.fn.bodySize.width() / 2 - zTool('#' + contentId).width() / 2) + sl + "px");
                    return;
                }

                var x = zWinOptions.position.split('|')[0], y = zWinOptions.position.split('|')[1];



                switch (x) {
                    case 'center':
                        zTool('#' + contentId).css('left', (zZ.fn.bodySize.width() / 2 - zTool('#' + contentId).width()) + sl / 2 + "px");
                        break;
                    case 'left':
                        zTool('#' + contentId).css('left', "0px");
                        break;
                    case 'right':
                        zTool('#' + contentId).css('left', (zZ.fn.bodySize.width() - zTool('#' + contentId).width()) + sl + "px");
                        break;
                    default:
                        zTool('#' + contentId).css('left', x + "px");
                        break;
                }

                switch (y) {
                    case 'center':
                        zTool('#' + contentId).css('top', (zZ.fn.bodySize.height() / 2 - zTool('#' + contentId).height()) + st / 2 + "px");
                        break;
                    case 'top':
                        zTool('#' + contentId).css('top', "0px");
                        break;
                    case 'bottom':
                        zTool('#' + contentId).css('top', (zZ.fn.bodySize.height() - zTool('#' + contentId).height()) + st + "px");
                        break;
                    default:
                        zTool('#' + contentId).css('top', y + "px");
                        break;
                }
            }
        }
,   //模型替换
        replaceModal: function (zWinThis, zWinContentId) {
            //它有可能是一个存在于内存中的元素
            if (zTool(zWinThis).E().parentElement) {
                //将模型复制一份出来并且存放在模型静态中
                var modal = { modalObj: zZ.fn.clone(zWinThis), modalId: zWinContentId };

                //将原有模型替换成标记，当窗口关闭，再替换回模型
                zTool(zWinThis).replaceWith('<div id="tag_' + zWinContentId + '" style="display:none" ><div>');            
            }
            else {
                var modal = { modalObj: zWinThis, modalId: zWinContentId };
            }
            return modal;
        }
,   //填充HTML结构
        fillHtml: function (zWinBack, zWinContent, zWinContentId, modal, zindex) {
            //如果背景不存在就写入背景
            if (!zZ("#" + zWinBack).E()) {
                //将窗口的背景置入界面
                //并在下面控制它的样式
                zTool('<body>').append('<iframe id="' + zWinBack + '" name="' + zWinBack + '" src="" frameborder="0"  allowtransparency="true" ></iframe>');
            } else {
                zTool('.' + zWinContent).css('z-index', zindex - 1);
            }

            //将窗口的主内容置入界面
            zTool('<body>').append('<div id="' + zWinContentId + '" class="' + zWinContent + '"></div>');

            //往主内容里填充模型
            zTool("#" + zWinContentId).append(modal.modalObj);
        }
,   //设置样式和属性
        setOptions: function (zWinBack, zWinContentId, options) {
            //设置背景的默认属性
            zTool('#' + zWinBack).css('opacity', options.opacity)
                                 .css('height', zZ.fn.bodySize.height() + "px")
                                 .css('left', '0px')
                                 .css('position', (zZ.fn.bor('msie 6.0') && 'absolute') || 'fixed')
                                 .css('top', '0px')
                                 .css('width', zZ.fn.bodySize.width() + "px")
                                 .css('z-index', options.zIndex)
                                 .css('zoom', '1')
                                 .css('background-color', options.background)
                                 ;
            if (zZ.fn.bor('msie 6.0')) { zTool('#' + zWinBack).css('height', document.body.scrollHeight + 'px').css('width', document.body.scrollWidth + 'px'); }

            //设置主内容的默认属性
            zTool('#' + zWinContentId).css('position', (zZ.fn.bor('msie 6.0') && 'absolute') || 'fixed')
                                 .css('z-index', parseInt(options.zIndex) + 1)
                                 .css('width', '100%')
                                 .css('padding', '0px auto 0px auto')
                                 .css('text-align', 'center');
            zTool(zTool('#' + zWinContentId).E().childNodes[0]).show().css('margin', '0px auto 0px auto');
        }
,   //IE修复
        fixIE: function (zWinBack) {
            if (zZ.fn.bor('msie 6.0') || zZ.fn.bor('msie 7.0') || zZ.fn.bor('msie 8.0')) {
                //IE6以及IE的其他版本浏览器需要设置Iframe内的样式
                var subdoc = document.getElementById(zWinBack).contentWindow.document;
                zTool(subdoc).load(function () {
                    zTool(subdoc.documentElement).find('<body>').css('background-color', 'transparent');
                });
            }
        }
,
        resizeFunc: function (zWinBack) {
            if (zZ.Zstatic.zWinModal.length != 0) {
                for (i in zZ.Zstatic.zWinModal) {
                    if (zZ.Zstatic.zWinModal[i].setPosition) {
                        zZ.Zstatic.zWinModal[i].setPosition.applyPosition();
                    }
                }
            }
            if (zTool('#' + zWinBack).E()) {
                if (zZ.fn.bor('msie 6.0')) {
                    zTool('#' + zWinBack).css('height', document.body.scrollHeight + 'px').css('width', document.body.scrollWidth + 'px')
                } else {
                    zTool('#' + zWinBack).css('width', zZ.fn.bodySize.width() + "px");
                    zTool('#' + zWinBack).css('height', zZ.fn.bodySize.height() + "px");
                }
            }
        }
    }



    //弹出模型层插件的主体方法
    zZ.fn.modal = function (options, callback) {
        //默认参数
        var defaultOp = { 'background': '#000', 'opacity': 0.5, 'position': 'center', zIndex: 1000 },
        zWinContent = "zWindowzWinContent",
        zWinContentId = "zTool_Window_" + (+new Date / Math.random()).toString().replace('.', ''),
        zWinThis = this.lObj[0];
        //检查是否有设置
        if (!options) {
            options = defaultOp;
        }

        //检查设置项目
        if (!zZ.fn.isFunction(options)) {
            if (!options.background) { options.background = '#000'; }
            if (!options.opacity) { options.opacity = 0.5; }
            if (!options.position) { options.position = 'center'; }
            if (!options.zIndex) { options.zIndex = '1000'; }
        } else {
            callback = options;
            options = defaultOp;
        }


        //替换模型
        var modal = zZ.Zstatic.zWindow.replaceModal(zWinThis, zWinContentId);

        //填充遮罩层的HTML结构和模型
        zZ.Zstatic.zWindow.fillHtml(zZ.Zstatic.zWindow.zWinBack, zWinContent, zWinContentId, modal, parseInt(options.zIndex));

        //设置样式和属性
        zZ.Zstatic.zWindow.setOptions(zZ.Zstatic.zWindow.zWinBack, zWinContentId, options);

        //新建委托
        modal.setPosition = new zZ.Zstatic.zWindow.positionFunc(zWinContentId, options);
        //应用委托以设置位置
        modal.setPosition.applyPosition();


        //如果是ie浏览器就进行一些其他方式的设置
        //IE FIX
        zZ.Zstatic.zWindow.fixIE(zZ.Zstatic.zWindow.zWinBack);

        //应用回调函数
        callback && callback.apply(zWinThis, arguments);

        //往窗口栈中推入模型
        zZ.Zstatic.zWinModal.push(modal);

        return this;
    }
    zZ.modalPosition = function () { zZ.Zstatic.zWindow.resizeFunc(zZ.Zstatic.zWindow.zWinBack); }
    //关闭窗口
    zZ.fn.closeModal = function (callBack) {
        var zWinThis = this.lObj[0],
        zWinContent = "zWindowzWinContent";
        if (zTool(zWinThis.parentNode).attr('class') != zWinContent) { return this; }

        var delAr = {};
        var removedIndex = 0;

        for (var i = 0; i < zZ.Zstatic.zWinModal.length; i++) {
            //移除目标层
            if (zTool(zWinThis.parentNode).attr('id') == zZ.Zstatic.zWinModal[i].modalId) {
                zTool('#' + zZ.Zstatic.zWinModal[i].modalId).remove();
                delAr = zZ.Zstatic.zWinModal[i];
                zTool('#tag_' + zZ.Zstatic.zWinModal[i].modalId).replaceWith(zZ.Zstatic.zWinModal[i].modalObj);
                removedIndex = i;
                break;
            }
        }

        //删除对象中的家伙
        zZ.Zstatic.zWinModal = zZ.fn.delArr(zZ.Zstatic.zWinModal, delAr);

        if (zZ.Zstatic.zWinModal.length <= 0) {
            zTool('#' + zZ.Zstatic.zWindow.zWinBack).remove();
        } else {
            //如果移除掉的层 前面还有一个层，就不把后面的层推上来
            if (!zZ.Zstatic.zWinModal[i]) {
                zTool(zZ.Zstatic.zWinModal[i - 1].modalId).css('z-index', parseInt(zTool('#' + zZ.Zstatic.zWindow.zWinBack).css('z-index')) + 1);
            }
        }

        callBack && callBack.apply(zWinThis, arguments);

        return this;
    }


    if (zZ.fn.bor('msie 6.0')) { zZ.Zstatic.zWindow.windowReTime = 0; }



    //:窗口改变大小时使用的方法
    zTool(window).resize(function () {

        if (zZ.fn.bor('msie 6.0')) {
            var now = new Date();
            now = now.getTime();
            if (now - zZ.Zstatic.zWindow.windowReTime > 100) {
                zZ.Zstatic.zWindow.windowReTime = now;
                zZ.Zstatic.zWindow.resizeFunc(zZ.Zstatic.zWindow.zWinBack);
            }
        } else {
            zZ.Zstatic.zWindow.resizeFunc(zZ.Zstatic.zWindow.zWinBack);
        }
    });

    if (zZ.fn.bor('msie 6.0')) {
        zTool(window).scroll(function () {
            zZ.Zstatic.zWindow.resizeFunc(zZ.Zstatic.zWindow.zWinBack);
        });
    }

});