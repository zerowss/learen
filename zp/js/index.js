;(function (win, doc) {
    showIcon();
    infoFn();
    wordMove(word);
    function showIcon() {
        var zuopin = tools.$('.zuopin');
        liHtml(zuopin);
        var lis = tools.$('li', zuopin);
        var moveJson = {
            'left': {
                top: '0',
                left: '-100%'
            },
            'top': {
                top: '-100%',
                left: '0'
            },
            'right': {
                top: '0',
                left: '100%'
            },
            'bottom': {
                top: '100%',
                left: '0'
            }
        };

        lis.forEach(function (el, i) {
            el.addEventListener('mouseenter', function (ev) {
                this.react = this.getBoundingClientRect();
                fnEnter(this, ev.clientX, ev.clientY, moveJson);
            });
            el.addEventListener('mouseleave', function (ev) {
                fnOut(this, ev.clientX, ev.clientY, moveJson);
            });
        });
        function liHtml(parent) {
            var str = '';
            str += '<ul>';
            for (var i = 0; i < workData.length; i++) {
                str += `
                    <li data-id="${workData[i].id}">
                        <a href="${workData[i].href}"><img src="${workData[i].src}" alt="">
                            <div class="mark">
                                <span>${workData[i].name}</span>
                            </div>
                        </a>
                    </li> `;
            }
            str += '</ul>';
            parent.innerHTML = str;
        }

        function fnEnter(el, x, y, json) {
            var mark = tools.$('.mark', el);
            var obj = {
                'left': Math.abs(x - el.react.left),
                'top': Math.abs(y - el.react.top),
                'right': Math.abs(x - el.react.left - el.react.width),
                'bottom': Math.abs(y - el.react.top - el.react.height)
            };
            var attr = findMin(obj);
            mark.style.transition = '';
            mark.style.top = json[attr].top;
            mark.style.left = json[attr].left;
            setTimeout(function () {
                mark.style.transition = 'all 0.5s ease';
                mark.style.top = '0';
                mark.style.left = '0';
            }, 10);

        }

        function fnOut(el, x, y, json) {
            var mark = tools.$('.mark', el);
            var obj = {
                'left': Math.abs(x - el.react.left),
                'top': Math.abs(y - el.react.top),
                'right': Math.abs(x - el.react.left - el.react.width),
                'bottom': Math.abs(y - el.react.top - el.react.height)
            };
            var attr = findMin(obj);
            setTimeout(function () {
                mark.style.top = json[attr].top;
                mark.style.left = json[attr].left;
            }, 10);
        }

        function findMin(obj) {
            var l = '';
            var max = new Date().getTime();
            for (var s in obj) {
                if (obj[s] < max) {
                    l = s;
                    max = obj[s];
                }
            }
            return l;
        }
    }

    function infoFn() {
        /*初始化位置*/
        var ifonWwrap = tools.$('.ifon-wrap'),
            ifon = tools.$('.info', ifonWwrap),
            zhezhao = tools.$('.zhezhao', ifonWwrap),
            divs = tools.$('div', ifon);
        var onOff = false;
        var isOff = false;
        var nub = 0;
        var oleft = move.css(ifon, 'left');
        console.log(oleft)
        move.cssTransfrom(ifon, 'rotateZ', -40);
        divs.forEach(function (el, i) {
            move.cssTransfrom(el, 'rotateZ', -5 * i);
        });
        ifon.addEventListener('click', function (ev) {
            if (!onOff) {
                move.cssTransfrom(ifon, 'rotateZ', -120);
                zhezhao.style.display = 'block';
                move.mTween(this, {left: 950, rotateZ: -100}, 100, 'linear', function () {
                    move.mTween(ifon, {left: 700, rotateZ: -60}, 200, 'linear', function () {
                        move.mTween(ifon, {left: 550, rotateZ: 0}, 200, 'linear', function () {
                            onOff = true;
                            tools.addClass(ifon, 'animated swing');
                            setTimeout(function () {
                                tools.rmClass(ifon, 'animated');
                                tools.rmClass(ifon, 'swing');
                            }, 1000);
                        });
                    });
                });
            }
            ev.stopPropagation();
        });
        ifon.addEventListener('mouseover', function (ev) {
            if (onOff & !isOff) {
                divs.forEach(function (el, i) {
                    move.mTween(el, {rotateZ: -3 * i}, 200, 'linear');
                });
                isOff = true;
            }
        });
        ifon.addEventListener('mouseout', function (ev) {
            if (onOff & !isOff) {
                divs.forEach(function (el, i) {
                    move.mTween(el, {rotateZ: -8 * i}, 200, 'linear');
                })
            }
        });

        divs[0].addEventListener('click', function () {
            if (onOff) {
                nub++;
                if (nub % 2 == 1) {
                    move.mTween(this, {rotateZ: 100}, 100, 'linear');
                    move.mTween(divs[1], {rotateZ: 0}, 100, 'linear');
                    move.mTween(divs[2], {rotateZ: -3}, 100, 'linear');
                }
                if (nub % 2 == 0) {
                    move.mTween(this, {rotateZ: 0}, 100, 'linear');
                    move.mTween(divs[1], {rotateZ: -3}, 100, 'linear');
                    move.mTween(divs[2], {rotateZ: -6}, 100, 'linear');
                }
            }

        });
        divs[1].addEventListener('click', function () {
            if (onOff) {
                move.mTween(divs[0], {rotateZ: 120}, 100, 'linear');
                move.mTween(this, {rotateZ: 100}, 100, 'linear');
                move.mTween(divs[2], {rotateZ: 0}, 100, 'linear');
                nub = 0;
            }
        });
        divs[2].addEventListener('click', function () {
            if (onOff) {
                move.mTween(divs[0], {rotateZ: 0}, 100, 'linear');
                move.mTween(divs[1], {rotateZ: -3}, 100, 'linear');
                move.mTween(this, {rotateZ: -6}, 100, 'linear');
                nub = 0;
            }
        });
        zhezhao.addEventListener('click', function () {
            move.css(ifon, 'left', 1350);
            this.style.display = 'none';
            move.cssTransfrom(ifon, 'rotateZ', -60);
            divs.forEach(function (el, i) {
                move.cssTransfrom(el, 'rotateZ', -5 * i);
            });
            move.mTween(ifon, {left: oleft, rotateZ: -40}, 400, 'backOut', function () {
                onOff = false;
            });
        })
    }

    function wordMove(el) {
        var arrStr = el.innerText.split('');
        var arrPos = [];
        resite();

        var spans = el.querySelectorAll('span');
        spans.forEach(function (e, i) {
            arrPos.push({
                id: i,
                left: e.offsetLeft,
                top: e.offsetTop
            });
            e.style.left = e.offsetLeft + 'px';
            e.style.top = e.offsetTop + 'px';
        });
        spans.forEach(function (e, i) {
            e.style.position = 'absolute';
        });
        /*布局重置*/
        function resite() {
            var a = document.createElement('a');
            a.className = 'moveBox';
            arrStr.forEach(function (el, i) {
                var span = document.createElement('span');
                span.innerText = el;
                a.appendChild(span);
            });
            el.innerHTML = '';
            el.appendChild(a);
        }

        el.addEventListener('mousemove', function (ev) {
            this.react = this.getBoundingClientRect();
            var len = spans.length;
            var index = posX(this.react, ev.clientX);
            var num1 = index, num2 = index;
            for (var i = 0; i < len; i++) {
                if (i < index) {
                    move.mTween(spans[i], {top: -(arrPos[i].top + (i+1)*1.5)}, 200, 'linear');
                } else {
                    num1--;
                    move.mTween(spans[i], {top: -((num1+1)*1.5 + arrPos[i].top)}, 200, 'linear');
                    if(num1 == 0){
                        return;
                    }
                }

            }
        });
        el.addEventListener('mouseout', function () {
            var len = spans.length;
            for (var i = 0; i < len; i++) {
                move.mTween(spans[i], {top: 0}, 200, 'backOut');
            }
        });

        function posX(react, x) {
            var arr = [];
            var l = x - react.left;
            var max = new Date().getTime();
            var s = null;
            arrPos.forEach(function (e, i) {
                var n = Math.abs(l - e.left);
                arr.push({
                    id: i,
                    n: n
                });
            });

            arr.forEach(function (e, i) {
                if (e.n < max) {
                    max = e.n;
                    s = e.id;
                }
            });
            return s;
        }
    }


})(window, document);