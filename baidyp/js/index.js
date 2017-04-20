
(function (w) {

    /*视图层初始化*/

    var asideList = wTool.$('.aside-list');
    var moduleListView = wTool.$('.module-list-view');
    /*要准备的数据*/
    var leftSub = data.list;/*左侧菜单数据*/
    var filerData = data.folder;/*右侧文件区域数据*/
    /*左侧菜单栏 */
    var leftId = -1;
    getHtml({
        parent : asideList,
        data : leftSub,
        id : leftId,
        className : 'menu-list',
        callback : LeftFilesHtml
    });
    /*右侧文件区域 */
    var rightId = 0;
    getHtml({
        parent : moduleListView,
        data : filerData,
        id : rightId,
        className : 'list-view',
        callback : HFileHtml
    });
    wTool.$('.box').innerHTML =treeHtml(filerData, 0);
/*控制层*/

function General() {
    this.barTool = wTool.$('.bar-tool');/*右侧按钮区域*/
    this.barChildren = this.barTool.children;/*右侧按钮区域子元素*/
    this.moduleListView = wTool.$('.module-list-view');/*文件区域*/
    this.checkBox = wTool.$('.checkbox', this.moduleListView);/*文件区域的checkbox*/
    this.gridBtn = wTool.$('.grid-btn');/*切换横竖模式按钮*/
    this.colItem = wTool.$('.col-item');/*文件全选按钮*/
    this.backBtn = wTool.$('.history-list-manager a');/*返回上一级功能*/
    this.delF = wTool.$('.delF');/*删除功能*/
    this.renameF = wTool.$('.renameF');/*重命名功能*/
    this.copyF = wTool.$('.copyF');/*复制功能*/
    this.moveF = wTool.$('.moveF');/*移动功能*/
    this.newObj = {};//记录新建文件的内容
    this.isCreate = true;/*记录是否新建文件夹 true为新建完成*/
    this.isGridBtn = true;/*记录横竖模式状态 true为横排*/
    this.obj = null;/*记录不同状态下的模版*/
    this.checkNum = 0;/*勾选按钮个数*/
    this.id = 0;/*记录当前的层级*/
    this.delArrData = [];/*存放准备删除的数据*/
}

General.prototype = {
    constructor : General,
    init : function () {/*所有事件都在init调用*/
        var _this = this;
        var isCheck = true;

        this.BoxSelect();
        /*切换横竖状态功能*/
        this.gridBtn.addEventListener('click',function () {
            /*
            * 默认一上来就是第0级的数据渲染
            * 每次点击切换时要去看现在是第几级的数据，对应去渲染
            * */

            _this.changeHtml(filerData,_this.id,_this.isGridBtn);
            _this.isGridBtn = !_this.isGridBtn;
        });
        /*点击文件夹展示子项*/
        this.moduleListView.addEventListener('click',function (ev) {
            _this.getChildFolder(ev);
            /*文件夹checkbox点击事件*/
            _this.fileChecks(ev,isCheck);
        });
        /*点击新建文件夹功能*/
        this.barChildren[1].addEventListener('click',function () {

            if(!_this.isGridBtn){
                _this.obj = {
                    fn : WNewFile,
                    aStr : WNewFileOne
                };
            }else{
                _this.obj = {
                    fn : HNewFile,
                    aStr :  HNewFileOne
                };
            }
            if(_this.isCreate){
                _this.isCreate = false;
                _this.newObj = {};
                _this.createFolder(_this.obj);
            }else{
                _this.tipsFn('新建文件(夹)还未确定,请先确定在新建');
            }
        });
        /*点击文件全选按钮事件*/
        wTool.$('.check-icon',this.colItem).addEventListener('click',function () {
               _this.checkBox = Array.prototype.slice.call(wTool.$('.checkbox', this.moduleListView));
               if(isCheck) {
                   _this.showOption();
                   wTool.$('.checksmall', this.parentNode).style.display = 'block';
                   _this.checkBox.forEach(function (item) {
                       item.children[0].style.display = 'block';
                       item.setAttribute('onOff', true);
                       wTool.addClass(item.parentNode.parentNode,'active');
                       _this.delArrData.push(wTool.parents(item,'.list-view-name').parentNode.dataset.fileId);
                   });
               }else{
                   _this.hideOption();
                   wTool.$('.checksmall', this.parentNode).style.display = 'none';
                   _this.checkBox.forEach(function (item) {
                       item.children[0].style.display = 'none';
                       item.setAttribute('onOff', false);
                       wTool.removeClass(item.parentNode.parentNode,'active');
                       _this.delArrData = wTool.delArr(_this.delArrData,wTool.parents(item,'.list-view-name').parentNode.dataset.fileId);
                   });
               }
               isCheck = !isCheck;
        });
        /*层级菜单功能*/
        this.backBtn[0].addEventListener('click',function () {
            var data = dataContrl.getOneParents(filerData,_this.id);
            var parent = wTool.$('.history-list-manager').children[1];

            _this.changeHtml(filerData,data[0].pid,!_this.isGridBtn);
            _this.id =  data[0].pid;
            if(_this.id == 0){
                var parentList = wTool.$('.history-list-manager');
                var listAl = wTool.$('.history-list-dir');
                parentList.style.display='none';
                listAl.style.display='block';
                parent.innerHTML = '';
            }else{
                parent.removeChild(parent.children[parent.children.length-1]);
                parent.children[parent.children.length-1].children[1].className = '';
            }
        });
        this.backBtn[1].addEventListener('click',function () {
            var parent = wTool.$('.history-list-manager').children[1];
            parent.innerHTML = '';
            var parentList = wTool.$('.history-list-manager');
            var listAl = wTool.$('.history-list-dir');
            parentList.style.display='none';
            listAl.style.display='block';
            _this.changeHtml(filerData,rightId,!_this.isGridBtn);
            ev.stopPropagation();

        });
        /*del文件*/
        this.delF.addEventListener('click',function () {
            /*删除选定id及子集数据，然后重新渲染*/

            _this.delArrData.forEach(function (item) {
                filerData = dataContrl.delChild(filerData,item);
            });
            var cArr = dataContrl.getChildById(filerData,_this.id);
            if(cArr.length == 0){
                wTool.$('.check-icon').children[0].style.display = 'none';
                isCheck = true;
            }
            _this.changeHtml(filerData,_this.id,!_this.isGridBtn);
            _this.hideOption();
            _this.checkNum = 0;
            _this.delArrData.length = 0;
        })
    },

    /*进入子级文件夹*/
    getChildFolder : function(ev){
        // ev.target.parentNode.nodeName === 'LI'
        if(ev.target.parentNode.nodeName === 'LI'){
            var parentList = wTool.$('.history-list-manager');
            var listAl = wTool.$('.history-list-dir');
            var parent = wTool.parents(ev.target,'.list-view-item');
            var getId = parent.dataset.fileId;
            this.id = getId;
            this.checkNum =0;
            this.delArrData.length = 0;
            parentList.style.display='block';
            listAl.style.display='none';
            this.getHistoryList(filerData,this.id);
            this.changeHtml(filerData,getId,!this.isGridBtn);
        }
        ev.stopPropagation();
    },
    /*文件夹checkbox点击事件*/
    fileChecks : function (ev,isC) {
        var arr = dataContrl.getChildById(data.folder,this.id);
        if(arr.length == 0){
            wTool.$('.checksmall',this.colItem).style.display = 'none';
            this.hideOption();
        }
        if(ev.target == wTool.$('.checkbox',ev.target.parentNode)){
            var checkbox = ev.target;
            var fileId = wTool.parents(checkbox,'.list-view-name').parentNode.dataset.fileId;
            if(checkbox.getAttribute('onOff') == 'true'){
                checkbox.setAttribute('onOff',false);
                checkbox.children[0].style.display = 'none';
                this.checkNum --;
                this.delArrData = wTool.delArr(this.delArrData,fileId);
                wTool.removeClass(checkbox.parentNode.parentNode,'active');
            }else{
                this.showOption();
                checkbox.setAttribute('onOff',true);
                checkbox.children[0].style.display = 'block';
                this.checkNum ++;
                this.delArrData.push(fileId);
                wTool.addClass(checkbox.parentNode.parentNode,'active');
            }
            if(this.checkNum == arr.length){
                wTool.$('.checksmall',this.colItem).style.display = 'block';
                isC = true;
            }else{
                wTool.$('.checksmall',this.colItem).style.display = 'none';
                isC = false;
            }
        }
        if(this.checkNum == 0){
            this.hideOption();
        }
        ev.stopPropagation();
    },
    /*新建文件夹*/
    createFolder : function (obj) {
        var _this = this;
        var liParent = this.moduleListView.children[0];
        if(liParent.nodeName == 'DIV'){
            this.moduleListView.removeChild(liParent);
            liParent = document.createElement('ul');
            liParent.className = 'list-view';
            this.moduleListView.appendChild(liParent);
        }
        /*获取当前的pid*/
        var arr = dataContrl.getChildById(data.folder,_this.id);
        if( arr.length != 0){
            arr.sort(function (a,b) {
                return a.id - b.id;
            });
        }
        var id = arr.length == 0?_this.id+'1':parseInt(arr[arr.length-1].id) + 1;
        var li = document.createElement('li');
        li.className ='list-view-item';
        li.dataset.fileId = id;
        var first = liParent.children[0];
        li.innerHTML = obj.fn(this.changName(arr),this.getTimeSize());
        var inputBox = wTool.$('.box',li);

        var size = this.getTimeSize().size;
        var times = this.getTimeSize().date;

        var sure = wTool.$('.sure',li);
        var cancel = wTool.$('.cancel',li);
        li.addEventListener('click',function (ev) {
            if(ev.target.parentNode == sure){
                var val = inputBox.value;
                if(val.length == 0){
                    _this.tipsFn('文件(夹)名称不能为空,请输入文件名称');
                }else{
                    if(_this.isSameName(arr,val)){
                        _this.newObj =  {
                            id : id,
                            pid : _this.id,
                            tittle : inputBox.value,
                            fileSize : size,
                            modDate : times
                        };
                        data.folder.unshift(_this.newObj);
                        liParent.removeChild(li);
                        liParent.insertBefore( _this.getNewLi(obj.aStr(data.folder),_this.newObj.id),first);

                        _this.isCreate = true;
                        _this.newObj = null;
                    }else{
                        _this.tipsFn('文件(夹)名称已经存在,请更换名称');
                    }
                }

            }
            if(ev.target.parentNode == cancel){
                liParent.removeChild(li);
                _this.isCreate = true;
            }

        });
        liParent.insertBefore(li,first);
    },

    /*看数组中是否有相同的名字*/
    isSameName : function (dataR,val) {
        var onOff = true;
        dataR.forEach(function (item) {
            if(item.tittle == val){
                onOff = false;
            }
        });
       return onOff;
    },
    /*提示框动画*/
    tipsFn : function (val) {
        var tips = wTool.$('#tips');
        var txt = wTool.$('.right',tips);
        txt.innerHTML = val;
        tips.style.height = '42px';
        setTimeout(function () {
            tips.style.height = '0';
        },2000);
    },
    /*生成新建文件夹结构*/
    getNewLi : function (aStr,id) {
        var li = document.createElement('li');
        li.className ='list-view-item';
        li.dataset.fileId = id;
        li.innerHTML = aStr;
        return li;
    },
    /*新建文件夹命名规则,同一个pid下的不能重名*/
    changName : function (arrNew) {
        var str = '';
        var onOff = true;
        var re = /^新建文件夹(\(\d+\))?$/;
        var arr = [];
        arrNew.forEach(function (item) {
            if(re.test(item.tittle)){
                onOff = false;
                if(item.tittle.match(/\d+/)){
                    arr.push(item.tittle.match(/\d+/)[0]);
                }else{
                    arr.push(0);
                }
            }
        });
        if(onOff){
            str ='新建文件夹';
        }else{
            var n = this.findMin(arr);
            str = '新建文件夹('+n+')';
        }
        return str;
    },
    findMin : function (arr) {
        arr.sort(function (a,b) {
            return a-b;
        });
        for(var i = 0;i<arr.length;i++){
            if(arr[i] != i){
                return i;
            }
        }
        return Math.max.apply(null,arr) + 1;
    },
    getTimeSize : function () {
        /*新建时为0，添加东西后才有值*/
        // var size = parseInt(Math.random()*100);
        var size = '--';
        var date = new Date(),
            year = date.getFullYear(),
            month = this.toDb(date.getMonth()+1),
            day = this.toDb(date.getDate());
        return {size : size,date : year + '-' + month + '-' + day};

    },
    toDb : function (n) {
        return n < 10 ? '0' + n : '' + n;
    },
    showOption : function () {
        wTool.$('.check-dragDown',this.barTool).style.display='block';
        this.barChildren[2].style.display = this.barChildren[3].style.display = 'none';
    },
    hideOption : function () {
        wTool.$('.check-dragDown',this.barTool).style.display='none';
        this.barChildren[2].style.display = this.barChildren[3].style.display = 'block';
    },
    /*层级菜单*/
    getHistoryList : function(data,id) {
        var _this = this;
        var parent = wTool.$('.history-list-manager').children[1];
        var childArr = dataContrl.getChildById(data,id);
        var pArr = dataContrl.getParentsData(data,id);
        var div = document.createElement('div');
        var span1 = document.createElement('span');
        var span2 = document.createElement('span');
        span1.innerHTML = '>';
        span2.innerHTML = pArr[0].tittle;
        span2.dataset.deep = id;
        this.id = id;
        span2.addEventListener('click',function () {
            _this.changeHtml(data,id,!_this.isGridBtn);
            wTool.delNext(parent,this.parentNode);
            this.className ='';

        })
        div.appendChild(span1);
        div.appendChild(span2);
        parent.appendChild(div);
        if(div.previousElementSibling){
            div.previousElementSibling.children[1].className = 'active';
        }

    },
    changeHtml : function (data,id,onOff) {
        if(onOff){
            getHtml({
                parent : moduleListView,
                data : data,
                id : id,
                className : 'list-view-change clear',
                callback : WFileHtml
            });
        }else{
            getHtml({
                parent : moduleListView,
                data : data,
                id : id,
                className : 'list-view',
                callback : HFileHtml
            });
        }
    },
    BoxSelect : function () {
        var _this = this;
        var newDiv = null;
        var fileItem = null;
        var checkboxs = null;
        var disX = 0,disY = 0;
        var parent = null;
        var checkedAll = wTool.$('.check-icon');
        wTool.addEvent(document,"mousedown",function (ev){
            parent = wTool.$('.list-view-change');
            //如果事件元素是在.nav-a这些元素身上，就没有框选效果
            var target = ev.target;
            /*if( wTool.parents(target,".nav-a") ){
                return;
            }*/

            disX = ev.clientX;
            disY = ev.clientY;



            //鼠标移动过程中
            wTool.addEvent(document,"mousemove",moveFn);

            wTool.addEvent(document,"mouseup",upFn);

            //去掉默认行为
            ev.preventDefault();

        })
        //移动的时候触发的函数
        function moveFn(ev){
            //找到文件区域下所有的文件
            if(parent.length == 0)return;
            fileItem =wTool.$('.list-view-item',parent);
            checkboxs = wTool.$(".checkbox");

            //在移动的过程中的位置-鼠标点击的位置 > 5

            if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){

                if( !newDiv ){
                    newDiv = document.createElement("div");
                    newDiv.className = "selectTab";
                    document.body.appendChild(newDiv);
                }
                newDiv.style.width = 0;
                newDiv.style.height = 0;
                newDiv.style.display = "block";
                newDiv.style.left = disX + "px";
                newDiv.style.top = disY + "px";
                var w = ev.clientX - disX;
                var h = ev.clientY - disY;

                newDiv.style.width = Math.abs(w) + "px";
                newDiv.style.height = Math.abs(h) + "px";
                //鼠标移动的过程中的clientX和在鼠标摁下的disX，哪一个小就把这个值赋给newDiv

                newDiv.style.left = Math.min(ev.clientX,disX) + "px";
                newDiv.style.top = Math.min(ev.clientY,disY) + "px";

                //做一个碰撞检测
                //拖拽的newDiv和那些文件碰上了，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式
                wTool.each(fileItem,function (item,index){
                    if( wTool.collisionRect(newDiv,item) )	{ //碰上了
                        wTool.addClass(item,"active");
                        wTool.addClass(checkboxs[index],"checked");
                        if(_this.delArrData.indexOf(item.dataset.fileId) == -1){
                            _this.delArrData.push(item.dataset.fileId);
                        }
                        _this.showOption();
                    }else{
                        wTool.removeClass(item,"active");
                        wTool.removeClass(checkboxs[index],"checked");
                        if(_this.delArrData.length != 0){
                            _this.delArrData = wTool.delArr(_this.delArrData,item.dataset.fileId);
                        }
                    }
                });
                if( _this.delArrData.length === checkboxs.length ){
                    wTool.addClass(checkedAll,"checked");
                }else{
                    wTool.removeClass(checkedAll,"checked");
                }
                if(_this.delArrData.length == 0){
                    _this.hideOption();
                }

            }



        }
        function upFn(){
            wTool.removeEvent(document,"mousemove",moveFn);
            wTool.removeEvent(document,"mouseup",upFn);
            if(newDiv) newDiv.style.display = "none";
        }
    }
};




var t = new General();
t.init();

})(window);
