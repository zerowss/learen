var $$ = {
    /*加载完dom树后执行（兼容版）*/
    loadingProgress: function (callBack) {
        if(document.addEventListener){
            document.addEventListener('DOMContentLoaded',function () {
                document.removeEventListener('DOMContentLoaded',arguments.cellee,false);
                callBack&&callBack();
            })
        }else if(document.attachEvent){
            document.attachEvent('onreadytstatechange',function () {
                if (document.readyState == "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    callBack&&callBack();
                }
            })
        }else if (document.lastChild == document.body) {
            callBack&&callBack();
        }
    },
    /*img加载完成*/
    loadingImgs : function (json) {
        var settings = {
            arr : json.arr,
            middle  : json.middle || function(){},/*监控中间过程*/
            done : json.done || function () {}/*加载完后执行的函数*/
        };
        settings.arr = (typeof settings.arr != 'object') ? [settings.arr] :settings.arr; /*确保传进来的总是数组*/
        var newImages = [];
        var loadImages = 0;
        settings.arr.forEach(function (item,i) {
            newImages[i] = new Image();
            newImages[i].src = item;
            newImages[i].onload = function () {
                /*模拟预加载*/
                setTimeout(function () {
                    imagesLoadPost();
                },i*100)
            };
            newImages[i].onerror = function () {
                imagesLoadPost();
            }
        });
        function imagesLoadPost() {
            loadImages ++;
            settings.middle(loadImages);
            if(loadImages == newImages.length){
                settings.done(newImages);
            }
        }
    }
}
