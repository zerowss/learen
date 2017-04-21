
var Tween = {
	linear: function (t, b, c, d){
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 2.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
};
/* 当css的参数个数小于3，获取否则 设置 */
function css(ele, attr , val){
	switch(attr){
		case 'rotate':
		case 'rotateX':
		case 'rotateY':
		case 'rotateZ':
		case 'scale':
		case 'scaleX':
		case 'scaleY':
		case 'skewX':
		case 'skewY':
		case 'translateX':
		case 'translateY':
		case 'translateZ':
			return setTransform(ele, attr , val);
	}
	if(arguments.length == 2){
		var val = ele.currentStyle?ele.currentStyle[attr]:getComputedStyle(ele)[attr];
		if(attr=='opacity'){
			val = Math.round(val*100);
		}
		return parseFloat(val);
	} else {
		switch(attr){
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
			case 'borderWidth':
			case 'borderLeftWidth':
			case 'borderRightWidth':
			case 'borderTopWidth':
			case 'borderBottomWidth':
				val = val < 0 ? 0 : val;
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				ele.style[attr] = val +"px";
				break;
			case 'opacity':
				ele.style.filter= "alpha(opacity:"+val+")";
				ele.style.opacity= val/100;
				break;	
			default:
				ele.style[attr]=val;	
		}
	}
}
function setTransform(ele,attr,val){
	if(typeof ele.transform == 'undefined'){
		ele.transform = {};
	}
	if (typeof val == 'undefined') {//没有传val值，只有两个参数
		if(!ele.transform[attr]){//在只传2个值得时候并且对象属性存在，初始化ele.transform对象的val值
		    switch (attr){
		        case 'scale':
				case 'scaleX':
				case 'scaleY':
					ele.transform[attr] = 1;
		            break;
		        default:
		        	ele.transform[attr] = 0;
		    }
		}
		return ele.transform[attr];
	} else{//传三个参数
		ele.transform[attr] = val;
		var str = '';
		for (var s in ele.transform) {
		    switch(s){
		    	case 'rotate':
				case 'rotateX':
				case 'rotateY':
				case 'rotateZ':
				case "skewX":
				case "skewY":
					str += ' '+s+'('+ele.transform[s] + 'deg)';
					break;
		    	case 'scale':
				case 'scaleX':
				case 'scaleY':
					str += ' '+s+'('+ele.transform[s] + ')';
					break;
		    	case 'translateX':
				case 'translateY':
				case 'translateZ':
					str += ' '+s+'('+ele.transform[s] + 'px)';
					break;
		    }
		}
		//document.title = (str.split(" ")[2]);
		ele.style.WebkitTransform = ele.style.MozTransform = ele.style.transform = str;
	}
}
/*运动函数*/
function mTween(el,target,time,type,callBack,callIn) {
	clearInterval(el.timer);
	var t = 0;
	var b = {}; 
	var c = {}; 	
	var d = time/20; 
	for(var s in target) {
		b[s] = css(el,s);  
		c[s] = target[s] - b[s];
	}
	el.timer = setInterval(function(){
		t++;
		if(t>d) {
			clearInterval(el.timer);
			if(typeof callBack == 'function'){
				setTimeout(function(){
					callBack();
				},20);
			}
			//callBack&&callBack(); //回调函数 动画执行完了以后，要执行的内容 ，类型 function	
		} else {
			callIn&&callIn();
			for(var s in target) {
				var val = Tween[type](t,b[s],c[s],d);
				css(el,s,val);
			}
		}
	},1000/60);
}
/*抖动函数*/
function toShake(ele,attr,n,callBack) {
	if(ele.shake){
		return;
	}
	var arr = [];
	var b= css(ele,attr);
	var nub= 0;
	for (var i = n-1;i>=0;i--) {
		i%2?arr.push(i):arr.push(-i);//
	}
	ele.shake = setInterval(
		function(){
			if(nub>n-1){
				clearInterval(ele.shake);
				ele.shake= 0;
				if(typeof callBack == 'function'){
					setTimeout(function(){
						callBack();
					},20);
				}
				//callBack&&callBack();
			}else{
				var val = b+arr[nub];
				css(ele,attr,val);
				nub++;
			}
		},40
	);
}
/*数组获取随机数*/
function rP(arr) {
	var max = Math.max(arr[0],arr[1]),
		min = Math.min(arr[0],arr[1]);
	return Math.round(Math.random() * (max - min)) + min;	
}
/*小于10补0*/
function add0(n) {
	return n < 10 ? '0' + n : '' + n;
}
