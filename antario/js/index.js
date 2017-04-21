
(function () {

    /*阻止移动端默认事件*/
    document.addEventListener('touchmove',function (ev) {
        ev.preventDefault();
    });
    /*事件调用*/
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.clientHeight;
    var box = document.querySelector('.box');
    var z = document.querySelector('.z');
    var view = document.getElementById('view');
    var main = view.querySelector('.main');
    var loadingLogo = document.getElementById('loading_logo');
    var loadingText = document.getElementById('loading_text')
    var loadingAt = document.getElementById('loading_at');
    var musicAct = document.getElementById('music');
    var Fragment = document.getElementById('Fragment');
    var tit = Fragment.querySelector('.tit');
    loadingAtF(loadingAt);
    loadingAtF(tit);
    fragmentMove(tit);
    // css(z,'translateZ',-1000);
    $$.loadingProgress (function () {
       $$.loadingImgs({
           arr:data.bg,
           middle : function(n){
                var deg = css(loadingLogo,'rotateY');
                loadingText.innerHTML = '已加载'+parseInt(n / data.bg.length * 100)+' %';
                mTween(loadingLogo,{rotateY:deg+180},500,'linear');
           },
           done : function (n) {
               loadingLogo.parentNode.style.display = 'none';
               loadingAt.style.display = 'block';
               musicAct.style.display = 'block';
               musicGo(musicAct);
               loadingAtMove(loadingAt,function () {
                   fragM(tit,mainMove);
               });
           }
       });
    });

    /*逻辑*/


    /*主体初始化*/
    function setView() {
        set();
        window.addEventListener('resize',set);
        function set() {
            var view = document.getElementById('view');
            var over = view.querySelector('.over');
            var main = view.querySelector('.main');
            var height = view.clientHeight;
            var initialDeg = 52.5;/*3d适配角度*/
            var R = Math.round(Math.tan((initialDeg/180*Math.PI))*height/2);
            over.style.WebkitPerspective = over.style.perspective = R + 'px';

        }
    }
    /*创建主体元素*/
    function create(ele){
        var yunBox = main.querySelector('.yunBox');
        var len = data.bg.length;
        var deg = 360/len;
        var startDeg = 180;
        var moveZ = Math.round(Math.tan(((180 - deg)/2)*Math.PI/180)*64.5) - 1;
        css(ele,'rotateX',0);
        css(ele,'rotateY',25);
        var newDiv = document.createElement('div');
        for(var i = 0 ;i<len;i++){
            var span = document.createElement('span');
            css(span,'rotateY',startDeg);
            css(span,'translateZ',-moveZ);
            span.style.background='url('+data.bg[i]+') no-repeat';
            newDiv.appendChild(span);
            startDeg -= deg;
        }
        ele.appendChild(newDiv);
        css(z,'translateZ',-1000);

        mTween(z,{
            rotateY:360,
            translateZ : -160
        },5000,'linear');
        getYun(function () {
            creatPiaofu(function () {
                doveDarg();
            });
        });
    }
    /*主体动画*/
    function setRotate(ele) {
        var startDeg ={x:0,y:0};
        var startDevice = {x:0,y:0};
        var isStart = true;
        var dir = window.orientation;
        var oldDate = Date.now();
        window.addEventListener('orientationchange',function () {
            dir = window.orientation;
            isStart = true;
        });
        window.addEventListener('deviceorientation',function (ev) {
            var nowDate = Date.now();
            if((nowDate - oldDate) < 30){
                return;
            }
            oldDate = nowDate;
            var nowDevice = {x:0,y:0};
            var beta = Math.round(ev.beta);
            var gamma = Math.round(ev.gamma);
            var alpha = Math.round(ev.alpha);
            switch (dir){
                case 0:
                    var x = beta;
                    var y = gamma + alpha;
                    break;
                case 90:
                    var x = -gamma;
                    var y = beta + alpha;
                    break;
                case -90:
                    var x = gamma;
                    var y = -(beta + alpha) ;
                    break;
                case 180:
                    var x = -beta;
                    var y = -(gamma + alpha);
                    break;
            }
            y = y%360;
            y = y < 0 ? y + 360: y;
            if(isStart){
                isStart = false;
                startDevice.x = x;
                startDevice.y = y;
                startDeg.x = css(ele,'rotateX');
                startDeg.y = css(ele,'rotateY');
            }else{
                nowDevice.x = x;
                nowDevice.y = y;
                var disDevice = {};
                disDevice.x =  nowDevice.x - startDevice.x;
                disDevice.y =  nowDevice.y - startDevice.y;
                var disDeg = {};
                disDeg.x = startDeg.x + disDevice.x;
                disDeg.y = startDeg.y + disDevice.y;
                if(disDeg.x > 40){
                    disDeg = 40;
                }else if(disDeg < -40){
                    disDeg = -40;
                }
                var disY = css(ele,'rotateY') - disDeg.y;
                if(Math.abs(disY) > 200){
                    var now = css(ele,"rotateY");
                    disY<0 ? css(ele,"rotateY",now + 360):css(ele,"rotateY",-now);
                }
                mTween(ele,{
                    rotateX : disDeg.x,
                    rotateY : disDeg.y
                },1000,'linear')
            }
        })
    }

    /*mainMove*/

    function mainMove() {
        view.style.display = 'block';
        setView();
        create(box);
        setRotate(box);
    }


    /*audio*/
    function musicGo(ele) {
        ele.addEventListener('click',function () {
            var child = this.children[0];
            if(child.paused){
                child.play();
                this.className ='play';
            }else{
                child.pause();
                this.className = 'pause';
            }
        })
    }

    /*loading_at*/
    function loadingAtF(ele) {
        var scale = 3/5;
        var eleW = scale*W;
        var eleH = scale*H;
        ele.style.cssText = 'width:'+eleW+'px;height:'+eleH+'px;margin: -'+eleH/2+'px 0 0 -'+eleW/2+'px;';
    }
    /*loading_at-> move*/
    function loadingAtMove(ele,callBack) {
        var box = ele.children[0];
        var startDeg = {y:0,z:0};
        startDeg.y = -180;
        startDeg.z = -1000;
        css(box,'translateZ',startDeg.z);
        css(box,'rotateY',startDeg.x);
        mFn(box,callBack);
        function mFn(box) {
            mTween(box,{translateZ:100,rotateY:180,scale:0.8},1000,'linear',function () {
                mTween(box,{translateZ:-1000,rotateY:360,scale:1},1200,'linear',function(){
                    mTween(box,{translateZ:100,rotateY:540,scale:0.8},1000,'linear',function(){
                        mTween(box,{translateZ:-1000,rotateY:720,scale:1},1200,'linear',function () {
                            ele.style.display = 'none';
                            callBack&&callBack();
                        });
                    });
                });
            });
        }
    }

    /*Fragment*/
    function fragmentMove(ele) {
        var titBox = ele.querySelector('.titBox');
        css(ele,'translateZ',-1000);
        var arr = data.fragmentBg;
        arr.forEach(function (item,i) {
            var img = document.createElement('img');
            img.src = item;
            img.style.display = 'none';
            css(img,'scale',0.1);
            titBox.appendChild(img);
        })
    }
    function fragM(ele,callBack) {
        Fragment.style.display = 'block';
        var z = css(ele,'translateZ');
        mTween(ele,{translateZ : 0},200,'linear',function () {
            var imgs = ele.querySelectorAll('img');
            var deg = 360/imgs.length;
            var r = Math.round(45 / Math.tan((deg/2) / 180 * Math.PI)) + 20;
            for(var i = 0;i<imgs.length;i++){
                (function (index) {
                    imgs[index].style.display = 'block';
                    var y = Math.random()*(200-(-200)+1)+(-200);
                    mTween(imgs[index],{translateY:y,scale:0.8,rotateY:deg*i,translateZ:r},500,'linear',function () {
                        var cDeg = css(imgs[index],'rotateY');
                        mTween(imgs[index],{rotateY:cDeg+360},2000,'linear',function () {
                            mTween(imgs[index],{scale:0.1},200,'linear');
                            mTween(ele,{translateZ : -2000,opacity:0},240,'linear',function () {

                                Fragment.style.display = 'none';
                                callBack&&callBack();
                            });
                        });
                    });
                })(i)
            }
        });

    }

//  云朵
    function getYun(callBack) {
        var cloud = document.querySelector('#cloud')
        var yunImg = data.dataYun;
        css(cloud,"translateZ",-400);

        yunImg.forEach(function (item,i) {
            var span = document.createElement('span');
            span.style.background='url('+item+') no-repeat';
            var R = 200+(Math.random()*150);
            var deg = (360/9)*i;//每个cloud的角度
            var x = Math.sin(deg*Math.PI/180)*R;
            var z = Math.cos(deg*Math.PI/180)*R;
            var y = (Math.random()-.5)*200;
            span.style.display = 'none';
            css(span,'translateX',x);
            css(span,'translateZ',z);
            css(span,'translateY',y);
            cloud.appendChild(span);
        });
        var num = 0;
        var timer = null;
        clearInterval(timer);
        timer = setInterval(function () {
            cloud.children[num].style.display = 'block';
            num++;
            if(num > cloud.children.length - 1){
                clearInterval(timer);
            }
        },50);
        mTween(
            cloud,
            {
             rotateY : 540
            },
            3500,
            'linear',
            function () {
                cloud.parentNode.removeChild(cloud);
                callBack&&callBack()
            },
            function () {
                var deg = -css(cloud,"rotateY");
                for(var i = 0;i<cloud.children.length;i++){
                    css(cloud.children[i],"rotateY",deg);
                }
            }
        )

    }

//漂浮层
    function creatPiaofu(callBack) {
        var pfEle = document.getElementById("piaofu");
        var deg = 18;
        var R = 406;
        var nub = 0;
        var startDeg = 180;

        css(pfEle,"rotateX",0);
        css(pfEle,"rotateY",-180);
        css(pfEle,"scale",0);
        var pf01 = document.createElement("div");
        pf01.className = 'pf';
        css(pf01,"translateX",1.564);
        css(pf01,"translateZ",-9.877);
        for(var i = 0;i<2;i++){
            var span = document.createElement("span");
            span.style.cssText = "height:344px;margin-top:-172px;";
            span.style.background = "url("+data.panOImg1[i]+")";
            css(span,"translateY",-163);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf01.appendChild(span);
        }
        pfEle.appendChild(pf01);

        var pf02 = document.createElement("div");
        pf02.className = 'pf';
        css(pf02,"translateX",20.225);
        css(pf02,"translateZ",-14.695);
        for(var i = 0;i<3;i++){
            var span = document.createElement("span");
            span.style.cssText = "height:326px;margin-top:-163px;";
            span.style.background = "url("+data.panOImg2[i]+")";
            css(span,"translateY",278);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf02.appendChild(span);
        }
        pfEle.appendChild(pf02);

        var pf03 = document.createElement("div");
        pf03.className = 'pf';
        css(pf03,"translateX",20.175);
        css(pf03,"translateZ",-11.35);
        for(var i = 0;i<4;i++){
            var span = document.createElement("span");
            span.style.cssText = "height:195px;margin-top:-163px;";
            span.style.background = "url("+data.panOImg3[i]+")";
            css(span,"translateY",192.5);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf03.appendChild(span);
        }
        pfEle.appendChild(pf03);

        var pf04 = document.createElement("div");
        pf04.className = "pf";
        css(pf04,"translateX",20.225);
        css(pf04,"translateZ",14.695);
        startDeg = 90;
        for(var i = 0; i < 5; i++){
            var span = document.createElement("span");
            span.style.cssText = "height:468px;margin-top:-234px;";
            span.style.background = "url("+data.panOImg4[i]+")";
            css(span,"translateY",129);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf04.appendChild(span)
        }
        pfEle.appendChild(pf04);

        var pf05 = document.createElement("div");
        pf05.className = "pf";
        css(pf05,"translateX",-4.54);
        css(pf05,"translateZ",9.91);
        startDeg = 18;
        for(var i = 0; i < 6; i++){
            var span = document.createElement("span");
            span.style.cssText = "height:444px;margin-top:-222px;";
            span.style.background = "url("+data.panOImg6[i]+")";
            css(span,"translateY",-23);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf05.appendChild(span)
        }
        pfEle.appendChild(pf05);

        var pf06 = document.createElement("div");
        pf06.className = "pf";
        css(pf06,"translateX",-11.35);
        css(pf06,"translateZ",22.275);
        startDeg = 18;
        for(var i = 0; i < 6; i++){
            var span = document.createElement("span");
            span.style.cssText = "height:582px;margin-top:-291px;";
            span.style.background = "url("+data.panOImg5[i]+")";
            css(span,"translateY",256);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf06.appendChild(span)
        }
        pfEle.appendChild(pf06);

        var pf07 = document.createElement("div");
        pf07.className = "pf";
        css(pf07,"translateX",-11.35);
        css(pf07,"translateZ",22.275);
        startDeg = -90;
        for(var i = 0; i < 6; i++){
            var span = document.createElement("span");
            span.style.cssText = "height:421px;margin-top:-291px;";
            span.style.background = "url("+data.panOImg8[i]+")";
            css(span,"translateY",-23);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf07.appendChild(span)
        }
        pfEle.appendChild(pf07);

        var pf08 = document.createElement("div");
        pf08.className = "pf";
        css(pf08,"translateX",-11.35);
        css(pf08,"translateZ",22.275);
        startDeg = -90;
        for(var i = 0; i < 3; i++){
            var span = document.createElement("span");
            span.style.cssText = "height:522px;margin-top:-291px;";
            span.style.background = "url("+data.panOImg7[i]+")";
            css(span,"translateY",268);
            css(span,"rotateY",startDeg);
            css(span,"translateZ",-R);
            startDeg -= deg;
            pf08.appendChild(span)
        }
        pfEle.appendChild(pf08);

        setTimeout(function () {
            mTween(pfEle,{
                rotateY : 25,
                scale : 1
            },1200,'easeBoth',function () {
                callBack&&callBack();
            })
        },2800)
    }

//    事件
    function doveDarg() {
        var piaoFu = document.querySelector("#piaofu"),
            main = document.querySelector(".main"),
            z = document.querySelector('.box');
        var startPoint = {x:0,y:0},
            zDeg = {x:0,y:0},
            scale = {x:129/18,y:1170/80};
        var startMain = css(main,"translateZ");
        var lastDeg = {x:0,y:0},
            lastDis = {x:0,y:0};

        document.addEventListener("touchstart",function (e) {
            startPoint.x = e.changedTouches[0].pageX;
            startPoint.y = e.changedTouches[0].pageY;
            zDeg.x = css(z,"rotateY");
            zDeg.y = css(z,"rotateX");
        });
        document.addEventListener("touchmove",function (e) {
            var nowPoint = {},
                nowDeg = {},
                nowDeg2 = {};
            nowPoint.x = e.changedTouches[0].pageX;
            nowPoint.y = e.changedTouches[0].pageY;
            var dis = {};//手指移动距离
            dis.x = nowPoint.x - startPoint.x;
            dis.y = nowPoint.y - startPoint.y;
            var disDeg = {};//旋转角度
            disDeg.x = -(dis.x/scale.x);
            disDeg.y = dis.y/scale.y;
            nowDeg.x = zDeg.x + disDeg.x;
            nowDeg.y = zDeg.y + disDeg.y;
            nowDeg2.x = zDeg.x + disDeg.x*0.95;
            nowDeg2.y = zDeg.y + disDeg.y*0.95;
            if(nowDeg.y > 40){
                nowDeg.y = 40;
            }else if(nowDeg.y < -40){
                nowDeg.y = -40;
            }
            if(nowDeg2.y > 40){
                nowDeg2.y = 40;
            }else if(nowDeg2.y < -40){
                nowDeg2.y = -40;
            }

            lastDis.x = nowDeg.x - lastDeg.x;
            lastDeg.x = nowDeg.x;
            lastDis.y = nowDeg.y - lastDeg.y;
            lastDeg.y = nowDeg.y;
            css(z,"rotateX",nowDeg.y);
            css(z,"rotateY",nowDeg.x);
            css(piaoFu,"rotateX",nowDeg2.y);
            css(piaoFu,"rotateY",nowDeg2.x);
            if(Math.abs(dis.x) > 300 ){
                dis.x = 300;
            }
            css(main,"translateZ",startMain - Math.abs(dis.x));
        });
        document.addEventListener("touchend",function (e) {
            var nowDeg = {
                x: css(z,"rotateY"),
                y:css(z,"rotateX")
            };
            var disDeg = {
                x:lastDis.x*10,
                y:lastDis.y*10
            };
            mTween(main,{
                translateZ : startMain
            },800,'easeOut');
            mTween(z,{
                rotateY : nowDeg.x + disDeg.x
            },800,'easeOut');
            mTween(piaoFu,{
                rotateY : nowDeg.x + disDeg.x
            },800,'easeOut');
        })
    }
})();
