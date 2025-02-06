var state_sync = true, URLactual = window.location+"";
var sp_system = {
	port: "",
};
document.addEventListener("DOMContentLoaded", function(event){
	
});
window.addEventListener("load", (event) => {
	
});


function mostrarModal(a, b){
	document.body.classList.add("stop-scrolling");
	var fondoModal = document.getElementById("fondoModal");
	var contenidoModal = document.getElementById("contenidoModal");
	if(widthSize() <= 720){
		contenidoModal.style.width = "95%";
		contenidoModal.style.height = b + "px";
	}else{
		contenidoModal.style.width = a + "px";
		contenidoModal.style.height = b + "px";
	}
	fondoModal.style.display = "block";
	contenidoModal.style.display = "block";
	if(!document.getElementById('cerrarModal')){
		document.getElementById('contenidoModal').innerHTML += '<input type="button" id="cerrarModal" title="Cerrar" value="X" onclick="cerrarModal()">';
	}
}
function cerrarModal(estado){
	document.body.classList.remove("stop-scrolling");
	window.onscroll = function() {
		if(typeof continuar_scroll === 'function') {
		  continuar_scroll();
		}
	};
	if(!estado){
		document.getElementById('contenidoModal').innerHTML = '';
	}
	document.getElementById('fondoModal').style.display = 'none';
	document.getElementById('contenidoModal').style.display = 'none';
}
shortcut("esc", function(){
	cerrarModal();
});

function widthSize(){
	var myWidth = 0;
	if (typeof (window.innerWidth) == 'number') {
		myWidth = window.innerWidth;
	} else if (document.documentElement && document.documentElement.clientWidth) {
		myWidth = document.documentElement.clientWidth;
	} else if (document.body && document.body.clientWidth) {
		myWidth = document.body.clientWidth;
	}
	return myWidth;
}
function heightSize(){
	var myHeight = 0;
	if (typeof (window.innerHeight) == 'number') {
		myHeight = window.innerHeight;
	} else if (document.documentElement
			&& document.documentElement.clientHeight) {
		myHeight = document.documentElement.clientHeight;
	} else if (document.body && document.body.clientHeight) {
		myHeight = document.body.clientHeight;
	}
	return myHeight;
}
function zeroFill(number, width){
  width -= number.toString().length;
  if( width > 0 ){
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + "";
}
function isMobile(){
  return (
    (navigator.userAgent.match(/Android/i)) ||
    (navigator.userAgent.match(/webOS/i)) ||
    (navigator.userAgent.match(/iPhone/i)) ||
    (navigator.userAgent.match(/iPod/i)) ||
    (navigator.userAgent.match(/iPad/i)) ||
    (navigator.userAgent.match(/BlackBerry/i))
  );
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function formArray(id){
  var arreglo = new Array();
  var frm = document.getElementById(id);
  for (var i=0; i<frm.elements.length; i++){
    arreglo.push(frm.elements[i].value);
  }
  return arreglo;
}
function synHttp(config){
	if(!state_sync){
		return;
	}else{
		state_sync = false;
	}
	if(document.getElementById('loading')){
		document.getElementById('loading').classList.remove("oculto");
	}
	if(document.getElementsByName('ih-vencido')[0]){
		if(parseInt(document.getElementsByName('ih-vencido')[0].value) == 1){
			return;
		}
	}
	const formdata = new FormData();
	if(config.data){
		var item = config.data;
		for (var key in item) {
			var tipo = ""+item[key];
			if(tipo.search("HTMLFormElement") >= 0){
				formdata.append(key, 0);
				var estado = 0;
				for($i=0;$i<item[key].length;$i++){
					var valor = "";
					if(item[key][$i].value != "undefined"){
						valor = item[key][$i].value;
					}
					if(item[key][$i].name){
						formdata.append(item[key][$i].name, valor);
					}else if(item[key][$i].id){
						formdata.append(item[key][$i].id, valor);
					}
				}
				if(estado == 1){
					formdata.append(key, item[key]);
				}
			}else{
				formdata.append(key, item[key]);
			}
		}
	}
	fetch(config.url,{
		method: config.type,
		body: formdata
	}).then(function(response) {
		if(response.ok) {
			response.text().then(function(resp) {
				var pos1 = resp.indexOf("|:") + 2;
				var pos2 = resp.indexOf(":|");
				if(pos1 >= 0 && pos2 > pos1) {
					var redirect = resp.substring(pos1, pos2);
					if(redirect == "/recargarpagina"){
						console.log(redirect);
						var redirect_refresh = window.location.pathname;
						window.location = redirect_refresh;
					}else if(redirect == "/nohacernada"){

					}else{
						window.location = redirect;
					}
				}else{
					setTimeout(function(){
						state_sync = true;
						config.success(resp);
					}, 100);
				}
				if(document.getElementById('loading')){
					document.getElementById('loading').classList.add("oculto");
				}
			});
		}else{
			state_sync = true;
			config.offline(response.status);
			if(document.getElementById('loading')){
				document.getElementById('loading').classList.add("oculto");
			}
		}
	}).catch(function(err) {
		if(document.getElementById('loading')){
			document.getElementById('loading').classList.add("oculto");
		}
		state_sync = true;
		config.error(err);
	});
}
function shortcut(shortcut, callback, opt){
	// Provide a set of default options
	var default_options = {
		'type' : 'keydown',
		'propagate' : false,
		'target' : document
	}
	if (!opt)
		opt = default_options;
	else {
		for ( var dfo in default_options) {
			if (typeof opt[dfo] == 'undefined')
				opt[dfo] = default_options[dfo];
		}
	}

	var ele = opt.target
	if (typeof opt.target == 'string')
		ele = document.getElementById(opt.target);
	var ths = this;

	// The function to be called at keypress
	var func = function(e) {
		e = e || window.event;

		// Find Which key is pressed
		var code;
		if (e.keyCode)
			code = e.keyCode;
		else if (e.which)
			code = e.which;
		var character = String.fromCharCode(code).toLowerCase();

		var keys = shortcut.toLowerCase().split("+");
		// Key Pressed - counts the number of valid keypresses - if it is same
		// as the number of keys, the shortcut function is invoked
		var kp = 0;

		// Work around for stupid Shift key bug created by using lowercase - as
		// a result the shift+num combination was broken
		var shift_nums = {
			"`" : "~",
			"1" : "!",
			"2" : "@",
			"3" : "#",
			"4" : "$",
			"5" : "%",
			"6" : "^",
			"7" : "&",
			"8" : "*",
			"9" : "(",
			"0" : ")",
			"-" : "_",
			"=" : "+",
			";" : ":",
			"'" : "\"",
			"," : "<",
			"." : ">",
			"/" : "?",
			"\\" : "|"
		}
		// Special Keys - and their codes
		var special_keys = {
			'esc' : 27,
			'escape' : 27,
			'tab' : 9,
			'space' : 32,
			'return' : 13,
			'enter' : 13,
			'backspace' : 8,

			'scrolllock' : 145,
			'scroll_lock' : 145,
			'scroll' : 145,
			'capslock' : 20,
			'caps_lock' : 20,
			'caps' : 20,
			'numlock' : 144,
			'num_lock' : 144,
			'num' : 144,

			'pause' : 19,
			'break' : 19,

			'winl' : 91,
			'winr' : 92,
			'insert' : 45,
			'home' : 36,
			'delete' : 46,
			'end' : 35,

			'pageup' : 33,
			'page_up' : 33,
			'pu' : 33,

			'pagedown' : 34,
			'page_down' : 34,
			'pd' : 34,

			'left' : 37,
			'up' : 38,
			'right' : 39,
			'down' : 40,

			'suma' : 107,
			'resta' : 109,

			'f1' : 112,
			'f2' : 113,
			'f3' : 114,
			'f4' : 115,
			'f5' : 116,
			'f6' : 117,
			'f7' : 118,
			'f8' : 119,
			'f9' : 120,
			'f10' : 121,
			'f11' : 122,
			'f12' : 123
		}

		for (var i = 0; k = keys[i], i < keys.length; i++) {
			// Modifiers
			if (k == 'ctrl' || k == 'control') {
				if (e.ctrlKey)
					kp++;

			} else if (k == 'shift') {
				if (e.shiftKey)
					kp++;

			} else if (k == 'alt') {
				if (e.altKey)
					kp++;

			} else if (k.length > 1) { // If it is a special key
				if (special_keys[k] == code)
					kp++;

			} else { // The special keys did not match
				if (character == k)
					kp++;
				else {
					if (shift_nums[character] && e.shiftKey) { // Stupid Shift
																// key bug
																// created by
																// using
																// lowercase
						character = shift_nums[character];
						if (character == k)
							kp++;
					}
				}
			}
		}

		if (kp == keys.length) {
			callback(e);

			if (!opt['propagate']) { // Stop the event
				// e.cancelBubble is supported by IE - this will kill the
				// bubbling process.
				e.cancelBubble = true;
				e.returnValue = false;

				// e.stopPropagation works only in Firefox.
				if (e.stopPropagation) {
					e.stopPropagation();
					e.preventDefault();
				}
				return false;
			}
		}
	}

	// Attach the function with the event
	if (ele.addEventListener)
		ele.addEventListener(opt['type'], func, false);
	else if (ele.attachEvent)
		ele.attachEvent('on' + opt['type'], func);
	else
		ele['on' + opt['type']] = func;
}