

function ajax(json){
	/**/
	var settings = {
		method : json.method || 'get',
		url : json.url || '',
		data : json.data || {},
		succ : json.succ || function(){},
		fail : json.fail || function(){},
		type : json.type || 'json'
	}
	var arr = [];
	for(var attr in settings.data){
		arr.push(attr + '=' + settings.data[attr]);
	}
	settings.data = arr.join('&');

	/**/
	var ajax = new XMLHttpRequest();

	if(settings.method == 'get'){
		var q = settings.data ? '?' : '';
		ajax.open(settings.method,settings.url + q + settings.data + '&' + new Date());
		ajax.send();
	}else{
		ajax.open(settings.method,settings.url);
		ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		ajax.send(settings.data);
	}
	ajax.onload = function(){
		if(ajax.readyState === 4){
			if(ajax.status >= 200 && ajax.status <= 206){
				if(settings.type == 'json'){
					settings.succ(eval('('+ajax.responseText+')'));
				}else if(settings.type == 'xml'){
					settings.succ(ajax.responseXML);
				}else{
					settings.succ(ajax.responseText);
				}
			}else{
				settings.fail(ajax,status);
			}
		}
	};
}