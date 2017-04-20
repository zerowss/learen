
var wTool = (function () {
    /*自定义选择器*/
    var wToolsObj = {
        $ : function (selector,parent) {
            parent = parent || document;
            if(/^#\S+$/ig.test(selector)){
                return parent.getElementById(selector.slice(1));
            }else if(/\S+[>\s]\S+/ig.test(selector)){
                var sel = parent.querySelectorAll(selector);
                sel =  Array.prototype.slice.call(sel);
                return sel.length == 1?sel[0] : sel;
            }else if(/^\.\S+$/ig.test(selector)){
                var ele = parent.getElementsByClassName(selector.slice(1));
                ele =  Array.prototype.slice.call(ele);
                return ele.length == 1?ele[0] : ele;
            }else{
                var tag = parent.getElementsByTagName(selector);
                tag =  Array.prototype.slice.call(tag);
                return tag.length == 1?tag[0] : tag;
            }
        },

        addEvent : function (ele,eventName,eventFn) {
            ele.addEventListener(eventName,eventFn,false);
        },
        removeEvent : function (ele,eventName,eventFn) {
            ele.removeEventListener(eventName,eventFn,false);
        },
        hasClass : function (ele,clsName) {
            // var classNameArr = ele.className.match(/\S+/g);
            var onOff = false;
            var classNameArr = ele.className.split(' ');
            classNameArr.forEach(function (item) {
                if(item === clsName){
                    onOff = true;
                }
            });
            return onOff;
        },
        addClass : function (ele,clsNames) {
            if(typeof clsNames == 'string'){
                if(!wTool.hasClass(ele,clsNames)){
                    ele.className += ' '+ clsNames;
                }
            }
        },
        removeClass : function (ele,clsNames) {
            var classNameArr = ele.className.match(/\S+/);
            for(var i = 0;i<classNameArr.length;i++){
                if(classNameArr[i] == clsNames){
                    classNameArr.splice(i,1);
                    i--;
                }
            }
            ele.className = classNameArr.join('');
        },
        toggleClass : function (ele,clsNames) {
            if(wTool.hasClass(ele,clsNames)){
                wTool.removeClass(ele,clsNames);
                return false;
            }else{
                wTool.addClass(ele,clsNames);
                return true;
            }
        },
        parents : function (obj,selector) {
            if(selector.charAt(0) == '#'){
                while(obj.id !==selector.slice(1)){
                    obj = obj.parentNode;
                }
            }else if(selector.charAt(0) == '.'){
                while((obj && obj.nodeType != 9) && !wTool.hasClass(obj,selector.slice(1))){
                    obj = obj.parentNode;
                }
            }else{
                while((obj && obj.nodeType != 9) && obj.nodeName.toLowerCase() !== selector){
                    obj = obj.parentNode;
                }
            }
            return obj;
        },
        each : function (obj,callBack) {
            for(var i =0;i<obj.length;i++){
                callBack(obj[i],i)
            }
        },
        getEleRect : function (obj) {
            return obj.getBoundingClientRect();
        },
        collisionRect : function (obj1,obj2) {/*碰撞检测*/
            var obj1Rect = wTool.getEleRect(obj1),
                obj2Rect = wTool.getEleRect(obj2);
            var obj1W = obj1Rect.width,
                obj1H = obj1Rect.height,
                obj1L = obj1Rect.left,
                obj1T = obj1Rect.top;
            var obj2W = obj2Rect.width,
                obj2H = obj2Rect.height,
                obj2L = obj2Rect.left,
                obj2T = obj2Rect.top;
            if(obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H){
                return true;
            }else{
                return false;
            }
        },
        extend : function (obj) {
            var newArr = obj.constructor === Array ? [] : {};
            for(var attr in obj){
                if(typeof obj[attr] === 'object'){
                    newArr[attr] = wTool.extend(obj[attr]);
                }else{
                    newArr[attr] = obj[attr];
                }
            }
            return newArr;
        },
        hide : function (ele) {
            ele.style.display = 'none';
        },
        show : function (ele) {
            ele.style.display = 'block';
        },
        getOffset : function (ele) {
            return {
                width : ele.offsetWidth,
                height : ele.offsetHeight
            }
        },
        delNext : function (parent,obj) {
            while(obj.nextElementSibling){
                parent.removeChild(obj.nextElementSibling);
            }
        },
        delArr : function (arr,val) {
            if(arr.indexOf(val) != -1){
                var index = arr.indexOf(val);
                arr.splice(index,1);
            }
            return arr;
        }
    
    };
    return wToolsObj;
}());