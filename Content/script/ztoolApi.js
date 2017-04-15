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

        zZ('.APIButton_item').mouseover(function () {
            zZ(this).find(':class=dBRight').stopAnimation();
            zZ(this).find(':class=dBRight').animation([["width", 50, "px", ">-"]], 500);
        });

        zZ('.APIButton_item').mouseout(function () {
            zZ(this).find(':class=dBRight').stopAnimation();
            zZ(this).find(':class=dBRight').animation([["width", 5, "px", ">-"]], 500);
        });

        var apiPar = this.getQueryStringValue("api");
        if (apiPar) {
            defaultPage.displayThisItem(apiPar.replace('item_',''));
        }
    }
,   //位置调整
    setPosition: function () {
        zZ(".menuBackground").css('height', zZ.fn.bodySize.height() + "px");
        zZ(".mainDivFrame").css('height', zZ.fn.bodySize.height() + "px");
    }
,   //显示点击的子菜单项目
    displayThisItem: function (t) {
        zZ('.itemContent').hide(500);
        zZ(":itemMenu=item_" + t).show(500);
    }
,   //跳转内容
    dUrl: function (url) {
        zT.get(url, '', '', function (data) {
            zZ('.mainDivFrame').stopAnimation();
            zZ('.mainDivFrame').animation([["opacity", 0, "", ">-"], ["padding-left", 50, "px", ">-"]], 500, function () {
                zZ('.mainDivFrame').html('');
                zZ('.mainDivFrame').html(data);
                zZ('.mainDivFrame').animation([["opacity", 1, "", ">-"], ["padding-left", 0, "px", ">-"]], 1000);
            });
        });
    }
,   //获得QueryString参数       
    getQueryStringValue: function (qs) {
        s = location.href;
        s = s.replace("?", "?&").split("&");
        re = "";
        for (i = 1; i < s.length; i++) {
            if (s[i].indexOf(qs + "=") == 0) {
                re = s[i].replace(qs + "=", "");
            }
        }
        return re;
    }
}