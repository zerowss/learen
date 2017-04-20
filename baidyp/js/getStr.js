
/*注备文件区域的html结构*/

/*左侧菜单栏*/
function LeftFilesHtml(fileData) {
    var className =fileData.selected === 1? 'active' : '';
    let liInner = `<li class="list-item ${className}">
                       <a href="javascript:;">
                           <div class="text">
                               <span class="icon ${fileData.icon}"></span>
                               <span class="icon"></span>
                               <span class="text-tittle">${fileData.title}</span>
                           </div>
                       </a>
                   </li>`;

    return liInner;
}
/*右侧文件区域结构-竖排状态*/
function HFileHtml(fileData) {
     var  inner = `<li class="list-view-item" data-file-id="${fileData.id}">
                     <div class="list-view-name">
                         <span class="checkbox">
                            <span class="icon checksmall icon-checksmall"></span>
                         </span>
                        <div class="fileicon dir-small"></div>
                        <div class="file-name">
                            <div class="text">
                                <a href="javascript:;">${fileData.tittle}</a>
                            </div>
                        </div>
                     </div>
                     <div class="file-size">${fileData.fileSize}</div>
                     <div class="ctime">${fileData.modDate}</div>
                 </li>`;
    return inner;
}
/*竖排结构-点击新建文件夹结构*/
function HNewFile(a,b) {
    var inner = `<div class="list-view-name">
                    <span class="checkbox">
                        <span class="icon checksmall icon-checksmall"></span>
                    </span>
                    <div class="fileicon dir-small"></div>
                    <div class="new-dir-item">
                        <input type="text" value="${a}" class="box">
                        <span class="sure">
                            <em class="icon icon-border"></em>
                            <em class="icon icon-checksmall"></em>
                        </span>
                        <span class="cancel">
                            <em class="icon icon-border"></em>
                            <em class="icon icon-close"></em>
                        </span>
                    </div>
                </div>
                <div class="file-size">${b.size}</div>
                <div class="ctime">${b.date}</div>
                `;
    return inner;
}
/*竖排-点击确定后所需的结构*/
function HNewFileOne(fileData) {
    var inner = `
                <div class="list-view-name">
                    <span class="checkbox">
                       <span class="icon checksmall icon-checksmall"></span>
                    </span>
                    <div class="fileicon dir-small"></div>
                    <div class="file-name">
                        <div class="text">
                        <a href="javascript:;">${fileData[0].tittle}</a></div>
                    </div>
                </div>
                <div class="file-size">${fileData[0].fileSize}</div>
                <div class="ctime">${fileData[0].modDate}</div>
                `;
    return inner;
}
/*右侧文件区域结构-横排状态*/
function WFileHtml(fileData) {
        var inner = `<li class="list-view-item" data-file-id="${fileData.id}">
                    <div class="list-view-name">
                        <span class="checkbox">
                            <span class="icon checksmall icon-checksmall"></span>
                        </span>
                        <div class="fileicon dir-small"></div>
                        <div class="file-name">
                            <a href="javascript:;">${fileData.tittle}</a>
                        </div>
                    </div>
                </li>`;
    return inner;
}
/*横排状态-点击新建文件夹结构*/
function WNewFile(a) {
    var inner = `
                <div class="list-view-name">
                    <span class="checkbox">
                    <span class="icon checksmall icon-checksmall"></span>
                    </span>
                    <div class="fileicon dir-small"></div>
                    <div class="new-dir-item">
                        <input type="text" value="${a}" class="box">
                        <span class="sure">
                            <em class="icon icon-border"></em>
                            <em class="icon icon-checksmall"></em>
                        </span>
                        <span class="cancel">
                            <em class="icon icon-border"></em>
                            <em class="icon icon-close"></em>
                        </span>
                    </div>
               </div>
                `;

    return inner
}
/*横排-点击确定后所需的结构*/
function WNewFileOne(fileData) {
    var inner = `
                <div class="list-view-name">
                    <span class="checkbox">
                        <span class="icon checksmall icon-checksmall"></span>
                    </span>
                    <div class="fileicon dir-small"></div>
                    <div class="file-name">
                        <a href="javascript:;">${fileData[0].tittle}</a>
                    </div>
                </div>
                `;
    return inner;
}
/*自问家夹为空显示内容*/
function emptyHtml() {
    var inner = `
                <div class="empty">
                    <div class="em-tit">
                        <p>您还没上传过文件哦，点击 <a href="#">上传</a>按钮~</p>
                    </div>
                   <!-- <div class="em-download">
                        <p>您还可以下载百度网盘其它客户端</p>
                        <p><a href="#">iPad版下载</a><a href="#">手机版下载</a><a href="#">pc版下载</a></p>
                    </div>-->
                </div>
                `;
    return inner;
}
/*返回指定id下的所有的子数据的html的结构*/
function createHtml(data,id,callBack) {
    var child = dataContrl.getChildById(data,id);
    var inner = '';
    child.forEach(function (item) {
        inner += callBack(item);
    });
    return inner;
}
/*生成html结构 parent,data,id,className,callback*/
function getHtml(json) {
    var setting = {
        parent : json.parent,
        data : json.data,
        id : json.id,
        className : json.className,
        callback : json.callback
    };
    setting.parent.innerHTML = '';
    if(dataContrl.hasChilds(setting.data,setting.id)){
        var ul = document.createElement('ul');
        ul.className = setting.className;
        ul.innerHTML = createHtml(setting.data,setting.id,setting.callback);
        setting.parent.appendChild(ul);
    }else{
        setting.parent.innerHTML = emptyHtml();
    }

}
/*移动功能html*/

//准备树形菜单的html结构
function treeHtml(data,treeId){
    var childs = dataContrl.getChildById(data,treeId);
    var html = "<ul>";

    childs.forEach(function (item){
        //获取到当前数据的层级 通过id获取
        var level = dataContrl.getLeaveById(data,item.id);

        // 判断当前这个数据有没有子数据 通过id判断
        /*
        * icon-dropdown-arrow 有子元素
        * icon-right 当前打开的子元素
        * */
        var hasChild = dataContrl.hasChilds(data,item.id);
        var classNames = hasChild ? "tree-contro" : "tree-contro-none";
        var str = hasChild ? treeHtml(data,item.id) : '';
        html += `
            <li>
                <div class="tree-title " data-file-id="${item.id}" style="padding-left:${level*14}px">
                    <span class="${classNames} clear">
                        <i class="filer-type"></i>
                        <span class="ellipsis">${item.tittle}</span>
                    </span>
                </div>
                ${str}
            </li>
		    `;
    })


    html += "</ul>";

    return html;
}

//通过id定位到树形菜单，添加calss
function positionTreeById( positionId ){

    var ele = document.querySelector(".tree-title[data-file-id='"+positionId+"']");

    tools.addClass(ele,"tree-nav");
}

//通过id得到当前这个id所有的父数据，得到一个结构
function createPathNavHtml(datas,fileId){
    //找到指定id所有的父数据
    var parents = dataControl.getParents(datas,fileId).reverse();
    var pathNavHtml = '';
    var len = parents.length;

    parents.forEach(function(item,index){
        if( index === parents.length-1 ) return;
        pathNavHtml += `
				<a href="javascript:;" style="z-index:${len--}" data-file-id="${item.id}">
					${item.title}
				</a>
			`;
    });
    //是当前这个一层的导航内容
    pathNavHtml += `
			<span class="current-path" style="z-index:${len--}">
				${parents[parents.length-1].title}
			</span>
		`;

    return pathNavHtml;

}