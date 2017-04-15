zZ(document).ready(function () {

    //静态方法集
    zZ.Zstatic.zConsole = {
        //载入
        init: function () {
            zZ('<body>').append('<div id="zConsole_Content" ></div>');
            zZ('#zConsole_Content').css('position', 'fixed')
                                   .css('left', '20px')
                                   .css('min-height', '25px')
                                   .css('width', '40%')
                                   .css('top', zZ.fn.bodySize.height() - 25 - 20 + 'px')
                                   .css('z-index', '9999');
        }
,       //定位
        setPosition: function () {
            zZ('#zConsole_Content').stopAnimation();
            zZ('#zConsole_Content').animation([['top', zZ.fn.bodySize.height() - zZ('#zConsole_Content').height() - 20, 'px', '>-']], 500);
        }
    };

    //打印
    zZ.print = function (content) {
        var itemid = 'zConsole_Item' + (+new Date / Math.random()).toString().replace('.', '');
        zZ('#zConsole_Content').append('<div id="' + itemid + '" >' + content + '</div>');
        zZ(itemid).css('background-color', '#303030')
                     .css('border-radius', '3px')
                     .css('margin', '5px')
                     .css('padding', '5px')
                     .css('color', '#eee')
                     .css('display', 'table');

        //设置内容的TOP
        zZ.Zstatic.zConsole.setPosition();

        zZ(itemid).css('opacity', '0');
        zZ(itemid).animation([['opacity', 1, '', '-<']], 300);

        //十秒过后移除消息
        zZ(itemid).delay(5000, function () {
            zZ(itemid).animation([['opacity', 0, '', '-<']], 500, function () {
                zZ(itemid).remove();
                zZ('#zConsole_Content').css('top', zZ.fn.bodySize.height() - zZ('#zConsole_Content').height() - 20 + 'px');
            });
        });
    }

    zZ.Zstatic.zConsole.init();
});

zZ(window).resize(function () {
    zZ.Zstatic.zConsole.setPosition();    
});