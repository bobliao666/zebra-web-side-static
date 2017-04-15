//此文件为框架页的脚本
zZ(document).ready(function () {
    //初始化页面
    defaultPage.initPage();
});

zZ(window).resize(function () {
    defaultPage.setPosition();
});

window.defaultPage = {
    mainBackground: "background_one"
,
    mainFrame: "mainFrame"
,
    initPage: function () {
        //设置所有浮动元素的位置
        this.setPosition();
        zZ('#mainFrame').load(function () {
            zZ("#background_one").load(function () {
                zZ("#background_one").animation([["opacity", 1, "", ">-"]], 1000, function () {
                    zZ("#mainFrame").animation([["opacity", 1, "", ">-"]], 1000, function () {
                        zZ.print("界面已成功载入!");
                        zZ.print("系统基本信息如下：<br/>" + navigator.userAgent.toLowerCase());
                        zZ('<body>').delay(1000, function () { document.getElementById("mainFrame").contentWindow.defaultPage.showContent(); zZ("#footer").animation([["opacity", 1, "", ">-"]], 1000); });
                    });
                });
            });
            zZ("#background_one").attr('src', 'Content/images/background/5.jpg');
        });
        zZ('#mainFrame').attr('src', "Index.html");
        
    }
, //设置所有浮动元素的位置
    setPosition: function () {
        //调整背景图片的
        zZ(this.mainBackground).css('width', zZ.fn.bodySize.width() + "px");
        zZ(this.mainBackground).css('height', zZ.fn.bodySize.height() + "px");

        //调整页脚的
        zZ("#footer").css('top', (zZ.fn.bodySize.height() - zZ("#footer").height()) + "px");

        //调整iframe的高度
        zZ(this.mainFrame).css('height', ((zZ.fn.bodySize.height() - zZ("#footer").height()) - 3) + "px");
    }
, //切换窗口 :跳转地址，背景图片地址，动画类型
    pageDir: function (url, image, aType, callBack) {
        var hideBackground, hideFrame;
        //决定谁隐藏谁显示
        if (this.mainBackground == "background_one") {
            this.mainBackground = "background_tow";
            this.mainFrame = "mainFrame_tow";
            hideBackground = "background_one";
            hideFrame = "mainFrame";
        } else {
            this.mainBackground = "background_one";
            this.mainFrame = "mainFrame";
            hideBackground = "background_tow";
            hideFrame = "mainFrame_tow";
        }

        //当框架载入成功时触发的事件
        zZ("#load_img").modal();
        zZ(this.mainFrame).unbind('load');
        zZ(hideBackground).unbind('load');
        zZ(hideFrame).unbind('load');
        zZ(this.mainFrame).load(function () {
            //切换背景
            zZ(defaultPage.mainBackground).unbind('load');
            zZ(defaultPage.mainBackground).load(function () {
                var hideleft, showleft, readyleft;

                switch (aType) {
                    case 'r-l':
                        hideleft = -100;
                        showleft = 0;
                        readyleft = 100;
                        break;
                    case 'l-r':
                        hideleft = 100;
                        showleft = 0;
                        readyleft = -100;
                        break;
                }

                //将要隐藏的frame隐藏
                zZ(hideFrame).animation([["opacity", 0, "", ">-"], ["left", hideleft, "px", ">-"]], 1000, function () {
                    zZ(this).css('display', 'none');
                });
                //显示要显示的元素
                zZ(defaultPage.mainFrame).css('display', 'block');
                zZ(defaultPage.mainBackground).css('display', 'block');
                defaultPage.setPosition();

                //先显示背景
                zZ(hideBackground).animation([["opacity", 0, "", "--"]], 500, function () { zZ(this).css('display', 'none'); });
                zZ(defaultPage.mainBackground).animation([["opacity", 1, "", "--"]], 500, function () {

                    //再显示frame
                    //设置好动画的开始位置
                    zZ(defaultPage.mainFrame).css('left', readyleft + 'px');
                    zZ(defaultPage.mainFrame).animation([["opacity", 1, "", ">-"], ["left", showleft, "px", ">-"]], 1000, function () {
                        zZ(hideBackground).attr('src', '/');
                        zZ(hideFrame).attr('src', '/');
                        zZ("#load_img").closeModal();
                        if (zT.isFunction(callBack)) {
                            callBack();
                        }
                    });
                });
            });
            //载入背景
            zZ(defaultPage.mainBackground).attr('src', image);
        });
        //载入页面
        zZ(this.mainFrame).attr('src', url);
    }
}
