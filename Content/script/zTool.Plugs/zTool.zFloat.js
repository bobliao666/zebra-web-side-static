//zTool.zFloat - alpha 0.0.1
//廖力编写@2013
//浮动层插件，基于zTool.Core
//-----------------------------------------

zTool(document).ready(function () {

    //静态方法集
    zZ.Zstatic.zFloat = {
        EventModal: function (zFloThis, zFloTarget, EventCall) {
            this.bind = function () {
                zZ.Zstatic.zFloat.unBindEvent(zFloThis, zFloTarget, EventCall);
                zTool(zFloThis).bind(EventCall, function () {
                    zTool(zFloTarget).stopAnimation();
                    zTool(zFloTarget).stopDelay();
                    zTool(zFloTarget).css('display', 'block').css('position', 'absolute')
                             .css('top', zTool(zFloThis).position().y + parseInt(zTool(zFloThis).css('height').toString().replace('px')) + parseInt(zTool(zFloThis).css('padding-bottom').toString().replace('px')) + parseInt(zTool(zFloThis).css('padding-top').toString().replace('px')) + parseInt(zTool(zFloThis).css('border-bottom').toString().replace('px')) + parseInt(zTool(zFloThis).css('border-top').toString().replace('px')) + 'px')
                             .css('left', zTool(zFloThis).position().x + 'px');
                    if (zZ.fn.bor('msie') || zZ.fn.bor('firefox')) {
                        zTool(zFloTarget).css('top', zTool(zFloThis).position().y + zTool(zFloThis).height() + 'px')
                    }
                    zTool(zFloTarget).css('display', 'none');
                    zTool(zFloTarget).show(300, function () {
                        zTool(zFloThis).bind('mouseout', function () {
                            zTool(zFloTarget).delay(500, function () {
                                zZ.Zstatic.zFloat.unBindEvent(zFloThis, zFloTarget, EventCall);
                                zTool(this).hide(300, function () {
                                    zTool(zFloThis).zFloat(EventCall);
                                });
                            });
                        }, true);
                        zTool(zFloTarget).bind('mouseout', function () {
                            zTool(zFloTarget).delay(500, function () {
                                zZ.Zstatic.zFloat.unBindEvent(zFloThis, zFloTarget, EventCall);
                                zTool(this).hide(300, function () {
                                    zTool(zFloThis).zFloat(EventCall);
                                });
                            });
                        }, true);
                        zTool(zFloThis).bind('mouseover', function () {
                            zTool(zFloTarget).stopDelay();
                        }, true);
                        zTool(zFloTarget).bind('mouseover', function () {
                            zTool(zFloTarget).stopDelay();
                        }, true);
                    });
                }, false);
            }
        }
        ,
        unBindEvent: function (zFloThis, zFloTarget, EventCall) {
            zTool(zFloThis).unbind(EventCall);
            zTool(zFloThis).unbind('mouseout');
            zTool(zFloThis).unbind('mouseover');
            zTool(zFloTarget).unbind('mouseout');
            zTool(zFloTarget).unbind('mouseover');
        }
    }

    //定义主方法
    zZ.fn.zFloat = function (inputEvent) {

        for (var j = 0; j < this.lObj.length; j++) {
            if (zZ(this.lObj[j]).attr('rel')) {
                var zFloThis = this.lObj[j];
                var zFloTarget = zTool(zFloThis).attr('rel');
                var EventCall = '';

                if (inputEvent) {
                    EventCall = inputEvent;
                } else {
                    EventCall = 'mouseover';
                }

                //注册事件
                var eventModal = new zZ.Zstatic.zFloat.EventModal(zFloThis, zFloTarget, EventCall);
                eventModal.bind();
            }
        }

    }

});