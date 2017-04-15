//斑马框架的页面
//页面载入事件
zZ(document).ready(function () {
    defaultPage.initPage();
});

zZ(window).resize(function () {
    defaultPage.setPosition();
})

window.defaultPage = {
    initPage: function () {
        this.setPosition();
        this.bindEvent();

        zZ('.pagehead').css('margin-top', (zZ.fn.bodySize.height() / 2 - zZ(".pagehead").height() / 2) + 'px');
    }
,
    bindEvent: function () {
        //鼠标移动测量事件
        zZ.zMouse.AddMouseMoveFunc("portDisplay", function () {
            var scop = zZ.fn.bodySize.width() - zZ(".portList").width() - 50;
            if (zZ.zMouse.NowMousePosition[0] > scop) {
                if (!zZ(".portList").attr('displayed')) {
                    defaultPage.setPosition();
                    zZ(".portList").stopAnimation();
                    zZ(".portList").animation([["opacity", 1, "", ">-"]], 500);
                    zZ(".portList").attr('displayed', 'displayed');
                }
            } else {
                if (zZ(".portList").attr('displayed')) {
                    zZ(".portList").stopAnimation();
                    zZ(".portList").animation([["opacity", 0.2, "", ">-"]], 1000);
                    zZ(".portList").removeAttr('displayed');
                }
            }
        });
    }
,   //位置调整
    setPosition: function () {
        zZ(".portList").css('left', zZ.fn.bodySize.width() - zZ(".portList").width() + "px");
        zZ(".portList").css('top', (zZ.fn.bodySize.height() / 2 - zZ(".portList").height() / 2) + "px");
    }
,   //显示内容div
    showContent: function () {
        zZ(".pagehead").animation([["margin-top", 0, "px", "-<"]], 400, function () {
            zZ(".pageContent").css('display', 'block').css('blur', '20px');
            zZ(".pageContent").animation([["opacity", 1, "", ">-"], ["margin-top", 40, "px", ">-"], ["blur", 0, "px", ">-"]], 1000);
        });
    }
}

/*打开窗口的方法*/
function openWindow(url) {
    var aElem = zZ("<a href='" + url + "' target='_blank' ></a>").appendTo('<body>').E();

    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
    aElem.dispatchEvent(evObj);


    zZ(aElem).remove();
}