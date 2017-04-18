(function () {
	/*------------------*/
	/*
		1.打开页面请求后台数据，生成页脚（有多少页）(默认在第一页)
		2.提交评论（如果翻页了，提交自动回到第一页）
		3.点击页脚，切换hash值（当前页始终在中间）
	 */

	 function Wb(){
	 	this.countAll = 0;//ajax 获得
	 	this.count = 5;//页脚5个
	 	this.num = 0;
	 	this.inner = '';//记录a标签
	 	this.content = '';//记录div
	 	this.pageWrap = document.getElementById('page');
	 	this.divWrap = document.getElementById('div1');
	 	this.as = this.pageWrap.children;
	 }

	 Wb.prototype.page = function(){
	 	var _this = this;
	 	ajax({
	 		method : 'get',
	 		url : 'weibo.php',
	 		data : {
	 			act : 'get_page_count'
	 		},
	 		succ : function(json){
	 			_this.countAll = json.count;
	 			_this.getPageFoot(1);
	 			_this.PageData(1);
	 		}
	 	});
		
	 };

	  Wb.prototype.getPageFoot = function(n){
	  	var _this = this;
	  	this.getOnePage(n);
	  	for(var i=0;i<this.as.length;i++){
  			this.as[i].addEventListener('click', function(){
		  		n = parseInt(this.innerHTML);
		  		if(n == _this.countAll ){
		  			alert('已经到最后了！');
		  		}else if(n == 1){
		  			alert('已经到第一个了！');
		  		}
		  		_this.getPageFoot(n);
		  		/*点击跳转页面重新生成*/
		  		_this.PageData(n);
		  	});
	  	}
	  };

	  /*点击跳转页面重新生成*/
	   Wb.prototype.PageData = function(n){
	   		var _this = this; 
	   		ajax({
		 		method : 'get',
		 		url : 'weibo.php',
		 		data : {
		 			act : 'get',
		 			page : n
		 		},
		 		succ : function(json){
		 			_this.onePageData(json,n);
		 			/*获取当前页数据渲染出来,修改hsah值*/
	  				window.location.hash = n;
		 		}
		 	});
	   };


	  /*生成一页数据*/
	   Wb.prototype.onePageData = function(json,n){
	   		var _this = this;
	   		this.divWrap.innerHTML = this.content = '';
	   		for(var i = 0;i<json.length;i++){
	   			this.content += `
							<div class="reply">
				                <p class="replyContent">${json[i].content}</p>
				                <p class="operation">
				                    <span class="replyTime">${this.timeChange(json[i].time*1000)}</span>
				                    <span class="handle">
				                    	<a href="javascript:;" class="top">${json[i].acc}</a>
				                        <a href="javascript:;" class="down_icon">${json[i].ref}</a>
				                        <a href="javascript:;" class="cut">删除</a>
				                    </span>
				                </p>
				            </div>
	   						`;
	   		}	

	   		this.divWrap.innerHTML = this.content;
	   		/*--------*/
	   		var handle = this.divWrap.getElementsByClassName('handle');
	   		
	   		for(var i = 0;i<handle.length;i++){
	   			(function(i){
	   				handle[i].up = true;
	   				handle[i].down = true;
	   				handle[i].addEventListener('click',function(ev){
		   				var as = handle[i].children;
			   			if(ev.target == as[0]){
			   				if(handle[i].up){//没点过的情况
			   					_this.fabulous(json[i],ev.target);
			   					ev.target.innerHTML = json[i].acc+1;
			   					handle[i].up = false;
			   				}else{//只要点过就走下边
			   					var date = new Date();
					 			var year = date.getFullYear();
					 			var month = date.getMonth();
					 			var day = date.getDate();
					 			var tomorrow =new Date(year,month,day+1,0,0,0);
					 			if(tomorrow.getTime()-date.getTime() > 0){
					 				alert('请过了零点再来赞!')
					 			}else{
					 				_this.fabulous(json[i],ev.target);
				   					ev.target.innerHTML = json[i].acc+1;
				   					handle[i].up = false;
					 			}
			   				}
			   			}
			   			if(ev.target == as[1]){
			   				if(handle[i].down){//没点过的情况
			   					_this.downIcon(json[i],ev.target);
			   					ev.target.innerHTML = json[i].ref+1;
			   					handle[i].down = false;
			   				}else{//只要点过就走下边
			   					var date = new Date();
					 			var year = date.getFullYear();
					 			var month = date.getMonth();
					 			var day = date.getDate();
					 			var tomorrow =new Date(year,month,day+1,0,0,0);
					 			if(tomorrow.getTime()-date.getTime() > 0){
					 				alert('请过了零点再来踩!')
					 			}else{
					 				_this.downIcon(json[i],ev.target);
				   					ev.target.innerHTML = json[i].ref+1;
				   					handle[i].down = false;
					 			}
			   				}
			   			}
			   			if(ev.target == as[2]){
		   					_this.Del(json[i]);
		   					_this.page(n);
			   			}
			   			ev.stopPropagation();
			   		});
	   			})(i)
	   		}
	   };


	
	 /*中间的*/
	  Wb.prototype.getOnePage = function(a){//点击哪个传入那个
	 	this.pageWrap.innerHTML = this.inner = '';
	 	var mid = parseInt(this.count/2);
	 	var b = a+mid;
	 	var c = a-mid-1;
	 	
	 	if(this.countAll <= this.count){//页数小于5时，有几页就生成几页
	 		
	 		c = 0;
	 		b = this.countAll;
	 		for(var i = c; i < b; i++){
		 		this.inner += '<a href="javascript:;">'+(i+1)+'</a>';
		 	}
		 	this.pageWrap.innerHTML = this.inner;
		 	a = a<1?1:a;
		 	if(this.as[a-1]){
		 		this.as[a-1].className = 'active';
		 	}
	 	}else{
	 		if( b >= this.countAll){
		 		b = this.countAll;
		 		c = b - this.count;
		 	}
		 	if(c <= 0){
		 		c = 0;
		 		b = c + this.count;
		 	}
		 	
		 	for(var i = c; i < b; i++){
		 		this.inner += '<a href="javascript:;">'+(i+1)+'</a>';
		 	}
		 	this.pageWrap.innerHTML = this.inner;
		 	if(a <= 3){
		 		a= a==0?0:a-1;
		 		mid = a%this.as.length;
		 	}else if(a >= this.countAll - 2){
		 		mid = (a-(c+1));
		 	}else{
		 		mid = mid;
		 	}
		 	this.as[mid].className = 'active';
	 	}
	 };

	 /*顶某一条数据*/
	 Wb.prototype.fabulous = function(obj,ele){
 		ajax({
	 		method : 'get',
	 		url : 'weibo.php',
	 		data : {
	 			act : 'acc',
	 			id : obj.id
	 		},
	 		succ : function(json){
	 			if(json.error){//失败后
	 				ele.innerHTML = obj.acc;
	 			}else{
	 				alert('点赞成功!')
	 			}
	 		}
	 	});
	 };

	  /*踩某一条数据*/
	 Wb.prototype.downIcon = function(obj,ele){
 		ajax({
	 		method : 'get',
	 		url : 'weibo.php',
	 		data : {
	 			act : 'ref',
	 			id : obj.id
	 		},
	 		succ : function(json){
	 			if(json.error){//失败后
	 				ele.innerHTML = obj.ref;
	 			}else{
	 				alert('踩成功!')
	 			}
	 		}
	 	});
	 };

	  /*删除某一条数据*/
	 Wb.prototype.Del = function(obj,ele){
 		ajax({
	 		method : 'get',
	 		url : 'weibo.php',
	 		data : {
	 			act : 'del',
	 			id : obj.id
	 		},
	 		succ : function(json){
	 			if(json.error){//失败后
	 				// ele.innerHTML = obj.ref;
	 			}else{
	 				alert('删除成功!')
	 			}
	 		}
	 	});
	 };
	 /*将时间戳转换成需要的时间格式*/
	  Wb.prototype.timeChange = function(time){
	  	var date = new Date(time);
	  	var year = date.getFullYear(),
	  		month = this.toDb(date.getMonth()+1),
	  		day = this.toDb(date.getDate()),
	  		hours = this.toDb(date.getHours()),
	  		minute = this.toDb(date.getMinutes()),
	  		seconds = this.toDb(date.getSeconds());
	  	return `${year}-${month}-${day} ${hours}:${minute}:${seconds}`;
	  };

	  /*转换两位数*/
	   Wb.prototype.toDb = function(n){
	   		return n < 0 ? '0'+n :n;
	   };

	  /*---------------------------------------------------------*/


	 var t = new Wb();
	 t.page();
	 /*---------------------------------------------------------*/
	


	
	 var hash = window.location.hash.split('#')[1] || 1;
	 var btn1 = document.getElementById('btn1');
	 var tijiaoText = document.getElementById('tijiaoText');
	 btn1.addEventListener('click',tijiao);
	 document.addEventListener('keydown',function(ev){
	 	if(ev.keyCode == 13){
			tijiao();
	 	}
	 });


	 function tijiao(){
	 	var val = tijiaoText.value;
	 	if(val.length == 0){
	 		alert('请输入点什么')
	 		return;
	 	}
	 	/*提交数据*/
	 	ajax({
	 		method : 'get',
	 		url : 'weibo.php',
	 		data : {
	 			act : 'add',
	 			content : val
	 		},
	 		succ : function(json){
	 			 t.page();
	 			 tijiaoText.value = '';
	 		}
	 	});

	 }
})()