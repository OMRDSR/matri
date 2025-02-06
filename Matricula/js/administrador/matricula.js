var contador = 0, timeAceptar, ob={}, myCalendarp, myCalendarv, myCalendar0, myCalendar1, myCalendar2, myCalendar3, myCalendar4, myCalendar5, aoc=[], myCalendarei, myCalendaref;
document.addEventListener("DOMContentLoaded", () => {
	if(localStorage.getItem("ssede")){
		if(parseInt(document.getElementsByName('sc-caja')[0].value) == 0){
			document.getElementsByName('sc-sede')[0].value = localStorage.getItem("ssede");
			if(parseInt(localStorage.getItem("ssede")) == 0){
				document.getElementsByName('dc-caja')[0].classList.remove('oculto');
			}
		}else{
			localStorage.setItem("ssede", document.getElementsByName('sc-sede')[0].value);
		}
	}else{
		document.getElementsByName('dc-caja')[0].classList.remove('oculto');
		localStorage.setItem("ssede", 0);
	}
});

window.addEventListener("load", (event) => {
	if(document.getElementsByName('sc-bcerrar')[0]){
		crearComprobante(0,0);
	}else{
		document.getElementsByName('dc-caja')[0].innerHTML = 'Click en el botÃ³n Abrir<br><strong>Para iniciar la caja</strong>';
		document.getElementsByName('dc-caja')[0].classList.remove('oculto');
	}
});
window.addEventListener("beforeprint", (event) => {
	//ANTES DE IMPRIMIR
});
window.addEventListener("afterprint", (event) => {
	//DESPUES DE IMPRIMIR
	if(ob.actualizar == 1){
		listarComprobantes();
	}
	if(ob.imprimirduplicado > 0){
		verComprobante(ob.imprimirduplicado);
	}
});

function listarComprobantes(){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			listarComprobantes: 1
		},success : function(data) {
			document.getElementsByName('dc-recibo')[0].innerHTML = data;
		}
	});
}

function crearComprobante(id,idciclo){
	ob.efectivodigital = 1;
	ob.imprimirduplicado = 0;
	ob.actualizar = 1;
	ob.idusuario = id;
	document.getElementById('contenidoModal').classList.remove("no-imprimir");
	document.getElementById('contenidoModal').classList.add("si-imprimir");
	document.getElementById('contenidoImprimir').classList.remove('si-imprimir');
	document.getElementById('contenidoImprimir').classList.add('no-imprimir');
	document.getElementById('contenidoImprimir').innerHTML = '';
	var h = heightSize()-150;
	var w = widthSize()-80;
	synHttp({
		url : "matricula", type : "POST",
		data : {
			crearComprobante: id,
			idciclo: idciclo,
			width: w,
			height: h,
			caja: document.getElementsByName('sc-caja')[0].value,
			idsede: localStorage.getItem("ssede")
		},success : function(data){
			ob.numcuota = 1;
			document.getElementsByName('dc-recibo')[0].innerHTML = data;
			document.getElementsByName('dl-lista-comprobante')[0].setAttribute('style','height:'+(h-35)+'px');
			document.getElementsByName('tbx-c-dni')[0].focus();
			if(!localStorage.getItem("spmprint")){
				localStorage.setItem("spmprint",0);
			}else{
				document.getElementsByName('s-hoja')[0].selectedIndex = ""+localStorage.getItem("spmprint");
			}
			document.getElementsByName('sc-caja')[0].value = document.getElementsByName('ih-id-caja')[0].value;
			if(parseInt(document.getElementsByName('sc-sede')[0].value) > 0){
				if(parseInt(document.getElementsByName('ih-estadow')[0].value) == 0){
					document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
				}
			}
			if(parseInt(document.getElementsByName('ih-estadow')[0].value) == 2){
				document.getElementsByName('btn-firmar-comprobante')[0].classList.remove('oculto');
			}
			if(localStorage.getItem("tsize")){
				document.getElementsByName('s-size')[0].value = localStorage.getItem("tsize");
				seleccionarSize();
			}else{
				localStorage.setItem("tsize", 0);
			}
			if(localStorage.getItem("tduplicado")){
				if(parseInt(localStorage.getItem("tduplicado")) == 1){
					document.getElementsByName('s-duplicado')[0].value = localStorage.getItem("tduplicado");
				}
			}else{
				localStorage.setItem("tduplicado", 0);
			}
			myCalendarv = new dhtmlXCalendarObject(["tih-vencimiento"]);
			myCalendar0 = new dhtmlXCalendarObject(["cit-vencimiento0"]);
			myCalendar1 = new dhtmlXCalendarObject(["cit-vencimiento1"]);
			myCalendar2 = new dhtmlXCalendarObject(["cit-vencimiento2"]);
			myCalendar3 = new dhtmlXCalendarObject(["cit-vencimiento3"]);
			myCalendar4 = new dhtmlXCalendarObject(["cit-vencimiento4"]);
			myCalendar5 = new dhtmlXCalendarObject(["cit-vencimiento5"]);
			myCalendar0.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendar1.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendar2.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendar3.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendar4.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendar5.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			myCalendarv.attachEvent("onClick", function(date){
				validarTotalCuotas();
			});
			var s = document.getElementsByName('tc-ciclo')[0];
			for(var i=0; i<s.options.length; i++){
				if(parseInt(s.options[i].value) > 0){
					var objc = {};
					objc.id = s.options[i].value;
					objc.nombre = s.options[i].innerText.trim();
					aoc.push(objc);
				}
			}
		}
	});
}
function buscarPorDNI(){
	var d = document.getElementsByName('tbx-c-dni')[0].value;
	d = d.trim();
	if(d.length != 8){
		return;
	}
	synHttp({
		url : "matricula", type : "POST",
		data : {
			buscarPorDNI: d
		},success : function(data) {
			if(data.trim() != 'no'){
				var o = JSON.parse(data);
				document.getElementsByName('tbx-c-apellido')[0].value = o.apellidos;
				document.getElementsByName('tbx-c-nombre')[0].value = o.nombres;
				document.getElementsByName('tbx-c-colegio')[0].value = o.iep;
				document.getElementsByName('tbx-c-carrera')[0].value = o.carrera;
				document.getElementsByName('ih-colegio-id')[0].value = o.idcolegio;
				document.getElementsByName('tbx-c-distrito')[0].value = o.colegiodistrito;
				document.getElementsByName('ih-id-distrito')[0].value = o.iddistrito;
				document.getElementsByName('tbx-c-celular')[0].value = o.celular;
				var fa = o.nacimiento.split("-");
				document.getElementsByName('s-c-anio')[0].value = fa[0];
				document.getElementsByName('s-c-mes')[0].value = fa[1];
				document.getElementsByName('s-c-dia')[0].value = fa[2];
				document.getElementsByName('tbx-l-nacimiento')[0].value = o.procedencia;
				document.getElementsByName('tbx-a-nombre')[0].value = o.apoderado_nombre;
				document.getElementsByName('tbx-a-celular')[0].value = o.apoderado_celular;
				document.getElementsByName('tbx-a-dni')[0].value = o.apoderado_dni;
				document.getElementsByName('tih-fecha-vencimiento')[0].value = o.vencimientociclo;
				if(o.apoderado_nombreb){
					document.getElementsByName('tbx-a-dnib')[0].value = o.apoderado_dnib;
					document.getElementsByName('tbx-a-nombreb')[0].value = o.apoderado_nombreb;
					document.getElementsByName('tbx-a-celularb')[0].value = o.apoderado_celularb;
				}
				if(parseInt(o.sexo) == 1){
					document.getElementsByName('tbx-c-sexo')[0].selectedIndex = "1";
				}else{
					document.getElementsByName('tbx-c-sexo')[0].selectedIndex = "0";
				}
				//PAGO EN CUOTAS
				if(o.matricula){
					if(o.matricula.id){
						var obj = o.matricula;
						document.getElementsByName('tih-pago-cuota')[0].value = obj.id;
						document.getElementsByName('tih-fecha-cuota')[0].value = obj.vencimiento;
						document.getElementsByName('tih-vencimiento')[0].value = obj.vencimiento;
						document.getElementsByName('tbl-comprobante')[0].innerHTML = '';
						//AGREGAR LOS SERVICIOS Y PRODUCTOS
						document.getElementsByName('s-total')[0].innerHTML = obj.total;
						document.getElementsByName('tih-cuota-total')[0].value = obj.total;
						document.getElementsByName('ts-saldo')[0].innerHTML = obj.saldo;
						if(parseInt(document.getElementsByName('ih-estadow')[0].value) == 0){
							document.getElementsByName('btn-firmar-comprobante')[0].classList.add('oculto');
							document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
							document.getElementsByName('btn-imprimir-comprobante')[0].classList.add('oculto');
						}else{
							document.getElementsByName('btn-firmar-comprobante')[0].classList.remove('oculto');
							document.getElementsByName('btn-aceptar-comprobante')[0].classList.add('oculto');
							document.getElementsByName('btn-imprimir-comprobante')[0].classList.add('oculto');
						}
						document.getElementsByName('th-buttons')[0].classList.add('oculto');
						if(document.getElementsByName('sih-fecha-actual')[0]){
							document.getElementsByName('sih-fecha-actual')[0].value = obj.fecha;
						}
						lcListar(obj.cadenacuotas);
					}
				}
			}
		}
	});
	function lcListar(o){
		var r = o.split("#");
		document.getElementsByName('cit-agregar')[0].classList.add('oculto');
		var er = 0;
		for(var i=0; i<r.length; i++){
			var fv = r[i].split("&");
			if(fv[0].length == 10 && parseFloat(fv[1]) > 0){
				ob.numcuota++
				document.getElementsByName('cit-estado')[i].disabled = false;
				document.getElementsByName('ctr-'+i)[0].classList.remove('oculto');
				document.getElementsByName('cit-vencimiento')[i].value = fv[0];
				document.getElementsByName('cit-vencimiento')[i].disabled = true;
				document.getElementsByName('cit-pago')[i].value = fv[1];
				document.getElementsByName('cit-pago')[i].disabled = true;
				document.getElementsByName('cit-remove')[i].classList.add('oculto');
				document.getElementsByName('cit-digital')[i].value = fv[3];
				document.getElementsByName('cit-efectivo')[i].value = fv[4];
				document.getElementsByName('cit-tipo')[i].value = fv[5];
				if(parseInt(fv[2]) == 1){
					document.getElementsByName('cit-estado')[i].checked = true;
					document.getElementsByName('cit-estado')[i].value = 1;
					document.getElementsByName('cit-estado')[i].disabled = true;
					document.getElementsByName('citf-estado'+i)[0].innerText = 'PAGADO';
					document.getElementsByName('cit-digital')[i].value = fv[3];
					document.getElementsByName('cit-digital')[i].disabled = true;
					document.getElementsByName('cit-efectivo')[i].value = fv[4];
					document.getElementsByName('cit-efectivo')[i].disabled = true;
					document.getElementsByName('cit-tipo')[i].value = fv[5];
					document.getElementsByName('cit-tipo')[i].disabled = true;
				}else{
					if(er == 0){
						document.getElementsByName('cit-estado')[i].click();
						er++;
					}
				}
			}
		}
		ob.numcuota = ob.numcuota-1;
		//validarTotal();
	}
}
function agregarItem(){
	contador++;
	var tb = document.getElementsByName('tbl-comprobante')[0];
	var tr = document.createElement('tr');
	tr.setAttribute('class','hoverGris');
	tr.setAttribute('name','tr-lista');
	tr.setAttribute('id','tr-lista'+contador);
	synHttp({
		url : "matricula", type : "POST",
		data : {
			agregarItem: contador
		},success : function(data) {
			tr.innerHTML = data;
			tb.appendChild(tr);
		}
	});
}
function agregarProducto(){
	contador++;
	var tb = document.getElementsByName('tbl-comprobante')[0];
	var tr = document.createElement('tr');
	tr.setAttribute('class','hoverGris');
	tr.setAttribute('name','tr-lista');
	tr.setAttribute('id','tr-lista'+contador);
	synHttp({
		url : "matricula", type : "POST",
		data : {
			agregarProducto: contador
		},success : function(data) {
			tr.innerHTML = data;
			tb.appendChild(tr);
		}
	});
}
function validarTotal(){
	ocultarBuscadores();
	var total = 0;
	var f_ini = "";
	var f_fin = "";
	for(var i=0; i<20; i++){
		if(document.getElementsByName('txb-c-cantidad')[i]){
			var subtotal = parseInt(document.getElementsByName('txb-c-cantidad')[i].value)*parseFloat(document.getElementsByName('txb-c-precio')[i].value);
			total = total + subtotal;
		}
		if(document.getElementsByName('tc-inicio')[i]){
			var sel = document.getElementsByName('tc-ciclo')[i];
			if(i == 0){
				document.getElementsByName('si-ciclo')[0].innerHTML = sel.options[sel.selectedIndex].text;
			}else{
				document.getElementsByName('si-ciclo')[0].innerHTML = document.getElementsByName('si-ciclo')[0].innerHTML+", "+sel.options[sel.selectedIndex].text;
			}
		}
	}
	document.getElementsByName('s-total')[0].innerHTML = total.toFixed(2);
	document.getElementsByName('ts-saldo')[0].innerHTML = '0.00';
	if(parseInt(document.getElementsByName('tih-pago-cuota')[0].value) == 0){
		document.getElementsByName('cit-pago')[0].value = total;
		document.getElementsByName('cit-efectivo')[0].value = total;
		document.getElementsByName('cit-digital')[0].value = 0;
		document.getElementsByName('cit-tipo')[0].value = 0;
		for(var i=1; i<20; i++){
			if(document.getElementsByName('cit-pago')[i]){
				document.getElementsByName('cit-pago')[i].value = 0;
				document.getElementsByName('cit-efectivo')[i].value = 0;
				document.getElementsByName('cit-digital')[i].value = 0;
				document.getElementsByName('cit-tipo')[i].value = 0;
			}
		}
	}
	if(document.getElementsByName('si-tiempo')[0]){
		document.getElementsByName('si-tiempo')[0].innerHTML = "Desde "+f_ini+" hasta "+f_fin;
	}
	if(total > 0){
		if(document.getElementsByName('btn-nuevo-comprobante')[0]){
			document.getElementsByName('btn-nuevo-comprobante')[0].classList.add('oculto');
		}
	}else{
		if(document.getElementsByName('btn-nuevo-comprobante')[0]){
			document.getElementsByName('btn-nuevo-comprobante')[0].classList.remove('oculto');
		}
	}
	validarTotalCuotas();
}
function validarTotalCuotas(n1,t1){
	if(t1){
		var cen = document.getElementsByName('cit-efectivo')[n1].value;
		var cdn = document.getElementsByName('cit-digital')[n1].value;
		var cpn = document.getElementsByName('cit-pago')[n1].value;
		if(parseInt(t1) == 1){
			document.getElementsByName('cit-digital')[n1].value = cpn-cen;
		}else{
			document.getElementsByName('cit-efectivo')[n1].value = cpn-cdn;
		}
	}
	var cp = document.getElementsByName('cit-pago');

	var tp = 0;
	var vt = 0;
	for(var i=0; i<cp.length; i++){
		var cv = document.getElementsByName('cit-vencimiento')[i].value;
		cv = cv.trim();
		var ce = parseInt(document.getElementsByName('cit-estado')[i].value);
		if(parseFloat(cp[i].value) > 0){
			tp = tp + parseFloat(cp[i].value);
		}
		if(parseFloat(cp[i].value) > 0 && cv.length == 10){
			vt++;
		}
	}
	var monto_deuda = parseFloat(document.getElementsByName('s-total')[0].innerHTML)-tp;
	if(monto_deuda != 0){
		document.getElementsByName('tr-saldom')[0].classList.add('cRojo');
	}else{
		document.getElementsByName('tr-saldom')[0].classList.remove('cRojo');
	}
	if(parseInt(document.getElementsByName('tih-pago-cuota')[0].value) > 0){
		document.getElementsByName('ts-saldo')[0].innerHTML = '0.00';
	}else{
		document.getElementsByName('ts-saldo')[0].innerHTML = monto_deuda;
	}
	var afecha = new Date(document.getElementsByName('ih-date')[0].value).getTime();
	if(parseInt(document.getElementsByName('tih-pago-cuota')[0].value) > 0){
		afecha = new Date(document.getElementsByName('tih-fecha-cuota')[0].value).getTime();
	}
	var cont = 0;
	var eultimo = 0;
	for(var i=0; i<20; i++){
		if(document.getElementsByName('cit-pago')[i]){
			var cv = document.getElementsByName('cit-vencimiento')[i].value.trim();
			var cp = parseFloat(document.getElementsByName('cit-pago')[i].value);
			var ce = parseInt(document.getElementsByName('cit-estado')[i].value);
			if(cp > 0){
				var nfecha = new Date(cv).getTime();
				if(afecha < nfecha && cont == 0){
					document.getElementsByName('tih-vencimiento')[0].value = cv;
					cont = 1;
				}
			}
			if(cv.length == 10 && cp > 0 && ce == 0){
				eultimo=1;
			}
		}
	}
	if(parseFloat(document.getElementsByName('ts-saldo')[0].innerHTML) == 0){
		document.getElementsByName('tr-saldom')[0].classList.remove('cRojo');
	}
	if(eultimo == 0){
		document.getElementsByName('tih-vencimiento')[0].value = document.getElementsByName('tih-fecha-vencimiento')[0].value;
	}
}
function validarPagoCuota(n){
	document.getElementsByName('cit-efectivo')[n].value = document.getElementsByName('cit-pago')[n].value;
	document.getElementsByName('cit-digital')[n].value = 0;
	validarTotalCuotas();
}
function verListaComprobante(id){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			verListaComprobante: id
		},success : function(data){
			var height = document.getElementsByName('dl-comprobante')[0].offsetHeight;
			document.getElementsByName('dl-comprobante')[0].setAttribute('style','height:'+height+'px; width: 100px; padding-top: '+(((height)/2)-20)+'px; padding-left: 30px');
			document.getElementsByName('dl-comprobante')[0].setAttribute('class','fLeft w100 rel hoverGris');
			document.getElementsByName('dl-comprobante')[0].innerHTML = '<img class="w40 mano" src="img/svg/list2.svg" onclick="crearComprobante('+id+',0)" title="Crear comprobante">';
			document.getElementsByName('dl-lista-comprobante')[0].setAttribute('class','fLeft rel');
			document.getElementsByName('dl-lista-comprobante')[0].setAttribute('style','height:'+height+'px; width: calc(100% - 100px)');
			document.getElementsByName('dl-lista-comprobante')[0].innerHTML = data;
		}
	});
}
function firmarMensualidad(id,idc,iew){
	document.getElementsByName('str-validate-qr')[0].classList.add('oculto');
	document.getElementsByName('str-validate-firma')[0].classList.add('oculto');
	document.getElementsByName('btn-aceptar-comprobante')[0].classList.add('oculto');
	ob.loop1a = 1;
	ob.loop1b = 1;
	if(parseFloat(document.getElementsByName('tbx-c-dni')[0].value) >= 10000000 && parseFloat(document.getElementsByName('tbx-c-dni')[0].value) < 99999999){
		var dni = document.getElementsByName('tbx-c-dni')[0].value;
		dni = dni.trim();
		synHttp({
			url : "matricula", type : "POST",
			data : {
				firmarMensualidad: dni
			},success : function(data) {
				if(data.trim() == "ok"){
					mostrarQR();
				}else{
					document.getElementById('contenidoModal').innerHTML = '<div class="w-100 txtCenter fs14 p10 bgCorp h35 fwNegrita cBlanco"><span class="cNaranja">Â¿UTILIZAR LA FIRMA DEL PRIMER PAGO?</span></div><div id="d-firma" class="w-100 rel txtCenter" style="height:350px;padding:20px"><img class="bgBlanco h300" src="/archivos/firma/'+data+'.png"></div><div class="w-100 rel h50"><input type="button" class="abs btnAceptar" style="left:30px;top:10px" value="Aceptar" onclick="utilizarFirma()"><input type="button" class="abs btnPeligro" style="right:30px;top:10px" value="Cancelar" onclick="mostrarQR()"></div>';
					mostrarModal(400,436);
				}
			}
		});
	}else{
		document.getElementsByName('s-msg-alert')[0].classList.remove('cCorp');
		document.getElementsByName('s-msg-alert')[0].classList.add('cRojo');
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'Ingrese un nÃºmero de DNI de 8 dÃ­gitos.';
	}
}
function mostrarQR(){
	var dni = document.getElementsByName('tbx-c-dni')[0].value;
	dni = dni.trim();
	document.getElementById('contenidoModal').innerHTML = '<div class="w-100 txtCenter fs14 p10 bgCorp h35 fwNegrita cBlanco"><span class="cNaranja">DNI:</span> '+dni+'</div><div id="d-qr" class="w-100 rel" style="height:400px;padding:20px"></div>';
	mostrarModal(400,436);
	var codigo = parseFloat(dni);
	let qrcodeContainer = document.getElementById('d-qr');
	new QRCode(qrcodeContainer, {
		text: codigo.toString(),
		width: 350,
		height: 350,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H
	});
	setTimeout(function() {
		ob.loop1a = 2;
		loopQr();
	}, 1000);
}
function utilizarFirma(){
	cerrarModal();
	document.getElementsByName('str-validate-qr')[0].classList.add('oculto');
	document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
	document.getElementsByName('str-validate-firma')[0].classList.remove('oculto');
	document.getElementsByName('btn-firmar-comprobante')[0].classList.add('oculto');
}
function loopQr(){
	if(ob.loop1a == 2){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				loopQr : document.getElementsByName('tbx-c-dni')[0].value
			},success : function(data){
				if(data.trim() == 'ok'){
					ob.loop1a = 1;
					document.getElementsByName('str-validate-qr')[0].classList.remove('oculto');
					cerrarModal();
					setTimeout(function() {
						ob.loop1b = 2;
						loopFirma();
					}, 1000);
				}else{
					setTimeout(function() {
						loopQr();
					}, 1000);
				}
			}
		});
	}
}
function loopFirma(){
	if(ob.loop1b == 2){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				loopFirma: document.getElementsByName('tbx-c-dni')[0].value
			},success : function(data){
				if(data.trim() == 'ok'){
					ob.loop1b = 1;
					document.getElementsByName('str-validate-qr')[0].classList.add('oculto');
					document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
					document.getElementsByName('str-validate-firma')[0].classList.remove('oculto');
					document.getElementsByName('btn-firmar-comprobante')[0].classList.add('oculto');
				}else{
					setTimeout(function() {
						loopFirma();
					}, 1000);
				}
			}
		});
	}
}
function aceptarMensualidad(id,idc,iew){
	var dni = document.getElementsByName('tbx-c-dni')[0].value;
	dni = dni.trim();
	document.getElementsByName('s-msg-alert')[0].classList.remove('cCorp');
	document.getElementsByName('s-msg-alert')[0].classList.add('cRojo');
	document.getElementsByName('s-msg-alert')[0].innerHTML = '';
	document.getElementsByName('tbx-a-celular')[0].value = document.getElementsByName('tbx-a-celular')[0].value.trim();
	document.getElementsByName('tbx-c-celular')[0].value = document.getElementsByName('tbx-c-celular')[0].value.trim();
	var deuda = parseFloat(document.getElementsByName('ts-saldo')[0].innerHTML);
	if(deuda != 0){
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'Verificar que los montos a pagar sumen el monto total.';
		return;
	}
	var pt = document.getElementsByName('s-total')[0].innerHTML;
	if(pt.trim() == '0.00'){
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'El monto total no puede ser cero, seleccione un ciclo o ingrese un producto o servicio.';
		return;
	}
	if(parseInt(localStorage.getItem("ssede")) == 0){
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'Seleccione una sede para utilizar matrÃ­culas.';
		return;
	}
	if(document.getElementsByName('tih-vencimiento')[0].value.length != 10){
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'Ingrese una fecha de vencimiento con el formato correcto.';
		return;
	}
	if(parseFloat(document.getElementsByName('tbx-c-celular')[0].value) > 1){
		if(parseFloat(document.getElementsByName('tbx-c-celular')[0].value) < 900000000 || parseFloat(document.getElementsByName('tbx-c-celular')[0].value) > 999999999){
			document.getElementsByName('s-msg-alert')[0].innerHTML = 'NÃºmero de WhatsApp del estudiante es incorrecto.';
			return;
		}
	}
	if(parseFloat(document.getElementsByName('tbx-a-celular')[0].value) > 1){
		if(parseFloat(document.getElementsByName('tbx-a-celular')[0].value) < 900000000 || parseFloat(document.getElementsByName('tbx-a-celular')[0].value) > 999999999){
			document.getElementsByName('s-msg-alert')[0].innerHTML = 'NÃºmero de WhatsApp del estudiante es incorrecto.';
			return;
		}
	}
	if(dni.length < 8 || dni.length > 8){
		document.getElementsByName('s-msg-alert')[0].innerHTML = 'NÃºmero de DNI incorrecto.';
		return;
	}
	document.getElementsByName('btn-aceptar-comprobante')[0].classList.add('oculto');
	timeAceptar = setTimeout(function() {
		document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
	}, 10000);
	ob.elimg = null;
	var aula = "";
	var cadena = "";
	var ciclos = "";
	var idciclo = 0;
	var cuotas = 0;
	if(idc == 0){
		for(var i=0; i<20; i++){
			if(document.getElementById('txb-c-cantidad-'+i)){
				if(parseInt(document.getElementById('txb-c-cantidad-'+i).value) > 0){
					var can = document.getElementById('txb-c-cantidad-'+i).value;
					var des = "";
					if(document.getElementById('tc-otro-'+i)){
						des = document.getElementById('tc-otro-'+i).value;
					}
					var pre = document.getElementById('tc-precio-'+i).value;
					var aul = "";
					if(document.getElementById('tc-aula-'+i)){
						aul = document.getElementById('tc-aula-'+i).value;
						aula = aul;
					}
					var cic = "";
					if(document.getElementById('tc-ciclo-'+i)){
						if(parseInt(document.getElementById('tc-ciclo-'+i).value) > 0){
							idciclo = document.getElementById('tc-ciclo-'+i).value;
							if(ciclos == ""){
								if(parseInt(id) == 0){
									ciclos = "0-"+document.getElementById('tc-ciclo-'+i).value+"-";
								}else{
									ciclos = document.getElementById('tc-ciclo-'+i).value+"-";
								}
							}else{
								ciclos = ciclos+""+document.getElementById('tc-ciclo-'+i).value+"-";
							}
						}
						cic = document.getElementById('tc-ciclo-'+i).value;
					}
					if(parseInt(can) >= 0 && parseFloat(pre) >= 0){
						if(cadena == ""){
							cadena = can+"@#"+des+"@#"+cic+"@#"+aul+"@#"+pre;
						}else{
							cadena = cadena+"$%"+can+"@#"+des+"@#"+cic+"@#"+aul+"@#"+pre;
						}
					}
				}
			}
		}
	}
	var apellido = document.getElementsByName('tbx-c-apellido')[0].value.toUpperCase();
	var nombre = document.getElementsByName('tbx-c-nombre')[0].value.toUpperCase();
	var eiep = document.getElementsByName('tbx-c-colegio')[0].value.toUpperCase();
	var esexo = document.getElementsByName('tbx-c-sexo')[0].value;
	var ecelular = document.getElementsByName('tbx-c-celular')[0].value;
	var efnacimiento = document.getElementsByName('s-c-anio')[0].value+"-"+document.getElementsByName('s-c-mes')[0].value+"-"+document.getElementsByName('s-c-dia')[0].value;
	var elnacimiento = document.getElementsByName('tbx-l-nacimiento')[0].value;
	var adni = document.getElementsByName('tbx-a-dni')[0].value;
	var anombres = document.getElementsByName('tbx-a-nombre')[0].value.toUpperCase();
	var anumero = parseFloat(document.getElementsByName('tbx-a-celular')[0].value);
	var bdni = document.getElementsByName('tbx-a-dnib')[0].value;
	var bnombres = document.getElementsByName('tbx-a-nombreb')[0].value.toUpperCase();
	var bnumero = parseFloat(document.getElementsByName('tbx-a-celularb')[0].value);
	var carrera = document.getElementsByName('tbx-c-carrera')[0].value.toUpperCase();
	var idcolegio = document.getElementsByName('ih-colegio-id')[0].value;
	var distrito = document.getElementsByName('tbx-c-distrito')[0].value.toUpperCase();
	var iddistrito = document.getElementsByName('ih-id-distrito')[0].value;
	var c_opcional = eiep+'$%'+esexo+'$%'+ecelular+'$%'+efnacimiento+'$%'+elnacimiento+'$%'+adni+'$%'+anombres+'$%'+anumero+'$%'+carrera+'$%'+idcolegio+'$%'+distrito+'$%'+iddistrito+'$%'+bdni+'$%'+bnombres+'$%'+bnumero;
	if(cadena.length > 2 && dni.length == 8 && apellido.length > 1 && nombre.length > 1){
		var fele = document.getElementsByName('cit-vencimiento');
		var cadenacuotas = '';
		var fpago = 0;
		var ncuota = 0;
		var tipopago = 0;
		var tipoefectivo = 0;
		var tipodigital = 0;
		var txtdigital = 'TRANSFERENCIA:';
		for(var i=0; i<fele.length; i++){
			var fechac = fele[i].value;
			fechac = fechac.trim();
			var pagoc = parseFloat(document.getElementsByName('cit-pago')[i].value);
			var estadoc = parseInt(document.getElementsByName('cit-estado')[i].value);
			var digitalc = parseFloat(document.getElementsByName('cit-digital')[i].value);
			var efectivoc = parseFloat(document.getElementsByName('cit-efectivo')[i].value);
			var tipoc = parseInt(document.getElementsByName('cit-tipo')[i].value);
			if(pagoc > 0 && fechac.length != 10){
				document.getElementsByName('btn-aceptar-comprobante')[0].classList.remove('oculto');
				clearTimeout(timeAceptar);
				document.getElementsByName('s-msg-alert')[0].innerHTML = 'Ingrese una fecha correcta para el pago de cuota.';
				return;
			}
			if(i == 0){
				cadenacuotas = fechac+'&'+pagoc+'&'+estadoc+'&'+digitalc+'&'+efectivoc+'&'+tipoc;
			}else{
				cadenacuotas = cadenacuotas+'#'+fechac+'&'+pagoc+'&'+estadoc+'&'+digitalc+'&'+efectivoc+'&'+tipoc
			}
			if(digitalc > 0){
				if(tipoc == 1){
					txtdigital = 'YAPE:';
				}else if(tipoc == 2){
					txtdigital = 'PLIM:';
				}
			}
			if(estadoc == 1 && fechac.length == 10 && pagoc > 0){
				fpago += pagoc;
				ncuota = i+1;
				if(ob.numcuota == 1){
					tipoefectivo = efectivoc;
					tipodigital = digitalc;
				}else{
					if(parseInt(document.getElementsByName('tih-pago-cuota')[0].value) == 0){
						tipoefectivo = tipoefectivo+efectivoc;
						tipodigital = tipodigital+digitalc;
					}else if(document.getElementsByName('cit-estado')[i].disabled == false){
						tipoefectivo = tipoefectivo+efectivoc;
						tipodigital = tipodigital+digitalc;
					}
				}
			}
			if(estadoc == 0 && fechac.length == 10 && pagoc > 0){
				tipopago = 1;
			}
			if(fechac.length == 10 && pagoc > 0){
				cuotas++;
			}
		}
		if(localStorage.getItem("spmprint")){
			let p = localStorage.getItem("spmprint");
			let head = document.getElementsByTagName('HEAD')[0];
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.media = 'print';
			if(parseInt(p) == 0){
				if(ob.numcuota == 1){
					link.href = 'css/print_tiketera_80s.css?v=1ang';
				}else if(ob.numcuota < 4){
					link.href = 'css/print_tiketera_80m.css?v=1ang';
				}else{
					link.href = 'css/print_tiketera_80l.css?v=1ang';
				}
			}else if(parseInt(p) == 1){
				link.href = 'css/print_a5.css?v=1anc';
			}else if(parseInt(p) == 2){
				if(ob.numcuota == 1){
					link.href = 'css/print_tiketera_58s.css?v=1ang';
				}else if(ob.numcuota < 4){
					link.href = 'css/print_tiketera_58m.css?v=1ang';
				}else{
					link.href = 'css/print_tiketera_58l.css?v=1ang';
				}
			}else if(parseInt(p) == 3){
				link.href = 'css/print_a4.css?v=1anc';
			}
			head.appendChild(link);
		}
		var deudatotal = (parseFloat(document.getElementsByName('s-total')[0].innerHTML)-fpago);
		if(parseInt(document.getElementsByName('tih-pago-cuota')[0].value) > 0){
			deudatotal = 0;
		}
		var tipomatricula = parseInt(document.getElementsByName('tih-pago-cuota')[0].value);
		var observacion = document.getElementsByName('txb-c-observacion')[0].value.toUpperCase();
		if(parseFloat(tipodigital) > 0){
			if(observacion.length > 4){
				observacion = observacion+', EFECTIVO: S/ '+tipoefectivo+', '+txtdigital+' S/ '+tipodigital;
			}else{
				observacion = 'EFECTIVO: S/ '+tipoefectivo+', '+txtdigital+' S/ '+tipodigital;
			}
			document.getElementsByName('txb-c-observacion')[0].value = observacion;
		}
		synHttp({
			url : "matricula", type : "POST",
			data : {
				aceptarMensualidad : dni,
				apellidos : apellido,
				nombres : nombre,
				cadena: cadena,
				cadenacuotas: cadenacuotas,
				observacion : observacion,
				vencimiento : document.getElementsByName('tih-vencimiento')[0].value,
				saldo : deudatotal,
				ciclos : ciclos,
				idciclo : idciclo,
				aula : aula,
				total : document.getElementsByName('s-total')[0].innerHTML,
				opcional : c_opcional,
				idcaja : document.getElementsByName('sc-caja')[0].value,
				cuotas : cuotas,
				numerocuota : ncuota,
				tipopago : tipopago,
				tipomatricula : tipomatricula,
				efectivo : tipoefectivo,
				digital : tipodigital
			},success : function(data){
				clearTimeout(timeAceptar);
				document.getElementsByName('dl-lista-comprobante')[0].innerHTML = data;
				if(parseInt(iew) == 2){
					if(anumero > 900000000 && anumero < 999999999 || ecelular > 900000000 && ecelular < 999999999){
						const date = new Date();
						ob.dnicodigo = dni;
						ob.idmatricula = document.getElementsByName('ihr-idmatricula')[0].value;
						var txt_carnet = '<div name="dm-carnet" class="w-100 rel fs18"><img class="abs w-100" src="/archivos/carnet/'+document.getElementsByName('ih-idadmin')[0].value+'/'+idciclo+'.png?v='+date.getTime()+'" onload="resizeDivCarnet(this)"><div name="d-qr" class="abs bgblanco ofHidden p5" style="left:29px;top:146px;width:235px;height:235px"></div><strong class="abs" style="left:315px;top:143px">'+dni+'</strong><strong class="abs" style="left:272px;top:198px">'+apellido+'</strong><strong class="abs" style="left:272px;top:255px">'+nombre+'</strong><strong class="abs" style="left:272px;top:312px">'+carrera+'</strong></div>';
						if(tipomatricula > 0){
							txt_carnet = '<div name="dm-carnet" class="w-100 rel fs18 oculto"></div>';
						}
						document.getElementById('contenidoModal').innerHTML = '<div name="dm-comprobante" class="w-100 oculto rel">'+document.getElementsByName('da-pagina1')[0].innerHTML+'</div>'+txt_carnet;
						mostrarModal(800,heightSize()-100);
						document.getElementsByName('da-pagina1')[0].innerHTML = '';
						if(tipomatricula > 0){
							setTimeout(function() {
								validarComprobante();
							}, 500);
						}
					}else{
						setTimeout(function() {
							imprimirMensualidad();
						}, 500);
					}
				}else{
					setTimeout(function() {
						imprimirMensualidad();
					}, 500);
				}
			}
		});
	}
}

function filtrarApellidos(){
	ob.cnombres = null;
	ob.fcarrera = null;
	document.getElementsByName('db-nombres')[0].classList.add('oculto');
	var n = document.getElementsByName('tbx-c-apellido')[0].value;
	if(n.length > 1){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				filtrarApellidos : n
			},success : function(data){
				ob.capellidos = null;
				if(data.length < 60){
					document.getElementsByName('db-apellidos')[0].classList.add('oculto');
				}else{
					document.getElementsByName('db-apellidos')[0].innerHTML = data;
					document.getElementsByName('db-apellidos')[0].classList.remove('oculto');
					ob.capellidos = parseInt(document.getElementsByName('fihc-apellidos')[0].value);
				}
			}
		});
	}else{
		document.getElementsByName('db-apellidos')[0].classList.add('oculto');
	}
}
function filtrarNombres(){
	ob.fcarrera = null;
	document.getElementsByName('db-apellidos')[0].classList.add('oculto');
	var n = document.getElementsByName('tbx-c-nombre')[0].value;
	if(n.length > 1){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				filtrarNombres : n
			},success : function(data){
				ob.cnombres = null;
				if(data.length < 60){
					document.getElementsByName('db-nombres')[0].classList.add('oculto');
				}else{
					document.getElementsByName('db-nombres')[0].innerHTML = data;
					document.getElementsByName('db-nombres')[0].classList.remove('oculto');
					ob.cnombres = parseInt(document.getElementsByName('fihc-nombres')[0].value);
				}
			}
		});
	}else{
		document.getElementsByName('db-nombres')[0].classList.add('oculto');
	}
}
function seleccionarEstudiante(id,dni){
	document.getElementsByName('db-apellidos')[0].classList.add('oculto');
	document.getElementsByName('db-nombres')[0].classList.add('oculto');
	document.getElementsByName('tbx-c-dni')[0].value = dni;
	buscarPorDNI();
}
function filtrarProducto(idf){
	var n = document.getElementById('tc-otro-'+idf).value;
	if(n.length > 1){
		ob.idfp = idf;
		synHttp({
			url : "matricula", type : "POST",
			data : {
				filtrarProducto : n
			},success : function(data){
				document.getElementsByName('db-producto'+idf)[0].classList.remove('oculto');
				document.getElementsByName('db-producto'+idf)[0].innerHTML = data;
			}
		});
	}else{
		document.getElementsByName('db-producto'+idf)[0].classList.add('oculto');
	}
}
function seleccionarProducto(id,precio){
	document.getElementsByName('db-producto'+ob.idfp)[0].classList.add('oculto');
	document.getElementById('tc-otro-'+ob.idfp).value = document.getElementsByName('sfp-nombre-'+id)[0].innerHTML;
	document.getElementById('tc-precio-'+ob.idfp).value = precio;
	validarTotal();
}
function ocultarBuscadores(){
	document.getElementsByName('db-apellidos')[0].classList.add("oculto");
	document.getElementsByName('db-nombres')[0].classList.add("oculto");
	document.getElementsByName('db-carrera')[0].classList.add("oculto");
	document.getElementsByName('db-colegio')[0].classList.add("oculto");
	document.getElementsByName('db-distrito')[0].classList.add("oculto");
}
shortcut("enter", function() {
	if(ob.cnombres){
		if(ob.cnombres > 0){
			ob.cnombres = null;
			seleccionarEstudiante(document.getElementsByName('fih-id')[0].value,document.getElementsByName('fih-dni')[0].value);
		}
	}
	if(ob.capellidos){
		if(ob.capellidos > 0){
			ob.capellidos = null;
			seleccionarEstudiante(document.getElementsByName('fih-id')[0].value,document.getElementsByName('fih-dni')[0].value);
		}
	}
	if(ob.fcarrera){
		if(ob.fcarrera > 0){
			ob.fcarrera = null
			ob.ccarrerapress = 1;
			seleccionarCarrera();
			document.getElementsByName('tbx-c-celular')[0].focus();
		}
	}
	if(ob.ccolegio){
		if(ob.ccolegio > 0){
			ob.ccolegio = null;
			ob.ccolegiopress = 1;
			seleccionarColegio(document.getElementsByName('fih-id')[0].value);
			document.getElementsByName('tbx-a-dni')[0].focus();
		}
	}
	if(ob.cdistrito){
		if(ob.cdistrito > 0){
			ob.cdistrito = null;
			ob.cdistritopress = 1;
			seleccionarDistrito(document.getElementsByName('fih-iddistritod')[0].value);
			document.getElementsByName('tbx-a-dni')[0].focus();
		}
	}
});

function filtrarColegio(){
	ocultarBuscadores();
	if(ob.ccolegiopress){
		if(ob.ccolegiopress == 1){
			ob.ccolegiopress = null;
		}
		return;
	}
	var n = document.getElementsByName('tbx-c-colegio')[0].value;
	if(n.length > 1){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				filtrarColegio : n
			},success : function(data){
				ob.ccolegio = null;
				if(data.length < 60){
					document.getElementsByName('db-colegio')[0].classList.add('oculto');
				}else{
					document.getElementsByName('db-colegio')[0].innerHTML = data;
					document.getElementsByName('db-colegio')[0].classList.remove('oculto');
					ob.ccolegio = parseInt(document.getElementsByName('fihc-colegio')[0].value);
				}
			}
		});
	}else{
		document.getElementsByName('db-colegio')[0].classList.add('oculto');
	}
}
function seleccionarColegio(id){
	ob.ccolegio = null;
	document.getElementsByName('tbx-c-colegio')[0].value = document.getElementsByName('fih-nombre-'+id)[0].value;
	document.getElementsByName('ih-colegio-id')[0].value = document.getElementsByName('fih-id')[0].value;
	document.getElementsByName('tbx-c-distrito')[0].value = document.getElementsByName('fih-distrito-'+id)[0].value;
	document.getElementsByName('ih-id-distrito')[0].value = document.getElementsByName('fih-iddistrito-'+id)[0].value;
	document.getElementsByName('db-colegio')[0].classList.add("oculto");
}
function filtrarDistrito(){
	ocultarBuscadores();
	if(ob.cdistritopress){
		if(ob.cdistritopress == 1){
			ob.cdistritopress = null;
		}
		return;
	}
	var n = document.getElementsByName('tbx-c-distrito')[0].value;
	if(n.length > 1){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				filtrarDistrito : n
			},success : function(data){
				ob.cdistrito = null;
				if(data.length < 60){
					document.getElementsByName('db-distrito')[0].classList.add('oculto');
				}else{
					document.getElementsByName('db-distrito')[0].innerHTML = data;
					document.getElementsByName('db-distrito')[0].classList.remove('oculto');
					ob.cdistrito = parseInt(document.getElementsByName('fihc-distrito')[0].value);
				}
			}
		});
	}else{
		document.getElementsByName('db-distrito')[0].classList.add('oculto');
	}
}
function seleccionarDistrito(id){
	ob.ccolegio = null;
	document.getElementsByName('tbx-c-distrito')[0].value = document.getElementsByName('fih-distritod-'+id)[0].value;
	document.getElementsByName('ih-id-distrito')[0].value = id;
	document.getElementsByName('db-distrito')[0].classList.add('oculto');
}
function filtrarCarrera(){
	ocultarBuscadores();
	if(ob.ccarrerapress){
		if(ob.ccarrerapress == 1){
			ob.ccarrerapress = null;
		}
		return;
	}
	var c = document.getElementsByName('tbx-c-carrera')[0].value;
	if(c.length < 2){
		return;
	}
	synHttp({
		url : "matricula", type : "POST",
		data : {
			filtrarCarrera : c
		},success : function(data){
			ob.fcarrera = null;
			if(data.length < 60){
				document.getElementsByName('db-carrera')[0].classList.add('oculto');
			}else{
				ob.fcarrera = 1;
				document.getElementsByName('db-carrera')[0].innerHTML = data;
				document.getElementsByName('db-carrera')[0].classList.remove('oculto');
			}
		}
	});
}
function seleccionarCarrera(id){
	ob.fcarrera = null;
	document.getElementsByName('tbx-c-carrera')[0].value = document.getElementsByName('fih-carrera-'+id)[0].value;
	document.getElementsByName('db-carrera')[0].classList.add('oculto');
}

function seleccionarSede(){
	var s = document.getElementsByName('sc-sede')[0].value;
	localStorage.setItem("ssede", s);
	location.reload();
}
function cerrarCaja(){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			cerrarCaja : document.getElementsByName('sc-caja')[0].value
		},success : function(data) {
			document.getElementById('contenidoModal').innerHTML = data;
			mostrarModal(700,190);
		}
	});
}
function abrirCaja(){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			abrirCaja : document.getElementsByName('sc-sede')[0].value
		},success : function(data) {
			salirGestionar();
		}
	});
}
function confirmarCerrarCaja(){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			confirmarCerrarCaja : document.getElementsByName('sc-caja')[0].value
		},success : function(data) {
			salirGestionar();
		}
	});
}
function verComprobante(id){
	ob.imprimirduplicado = id;
	synHttp({
		url : "matricula", type : "POST",
		data : {
			verComprobante: id
		},success : function(data){
			var o = JSON.parse(data);
			document.getElementsByName('txb-c-observacion')[0].value = o[0].observacion;
			document.getElementsByName('tih-vencimiento')[0].value = o[0].vencimiento;
			vcListar(o[0],o[1],o[2]);
			document.getElementsByName('s-total')[0].innerHTML = o[0].total;
			document.getElementsByName('ts-saldo')[0].innerHTML = "0.00";
			if(parseInt(document.getElementsByName('ih-estadow')[0].value) == 0){
				document.getElementsByName('btn-aceptar-comprobante')[0].classList.add('oculto');
				document.getElementsByName('btn-firmar-comprobante')[0].classList.add('oculto');
				document.getElementsByName('btn-reenviar-comprobante')[0].classList.add('oculto');
				document.getElementsByName('btn-imprimir-comprobante')[0].classList.remove('oculto');
			}else{
				document.getElementsByName('btn-aceptar-comprobante')[0].classList.add('oculto');
				document.getElementsByName('btn-firmar-comprobante')[0].classList.add('oculto');
				document.getElementsByName('btn-reenviar-comprobante')[0].classList.remove('oculto');
				document.getElementsByName('btn-imprimir-comprobante')[0].classList.remove('oculto');
			}
			ob.actualizar = 0;
			document.getElementsByName('th-buttons')[0].classList.add('oculto');
			document.getElementsByName('txb-c-observacion')[0].disabled = true;
			document.getElementsByName('tih-vencimiento')[0].disabled = true;
			if(document.getElementsByName('sih-fecha-actual')[0]){
				document.getElementsByName('sih-fecha-actual')[0].value = o[0].fecha;
			}else{
				document.getElementsByName('ts-saldo')[0].innerHTML += '<input type="hidden" name="sih-fecha-actual" value="'+o[0].fecha+'">';
			}
			lcListar(o[0].cadenacuotas);
		}
	});
	function vcListar(o,c,a){
		var oa = o.cadena.split("$%");
		var t = '';
		for(var i=0; i<oa.length; i++){
			var r = oa[i].split("@#");
			if(r[1].length < 2){
				var aula = '';
				for(var j=0; j<a.length; j++){
					if(parseInt(r[3]) == parseInt(a[j].id)){
						aula = a[j].aula;
					}
				}
				t = '<tr class="hoverGris" name="tr-lista" id="tr-lista'+i+'"><td class="bbGris h35 txtCenter"><input type="text" class="w-95 txtCenter p5" name="txb-c-cantidad" id="txb-c-cantidad-'+i+'" value="'+r[0]+'" placeholder="1" onkeyup="validarTotal()" disabled></td><td class="bbGris"><div class="w-100" name="d-ciclo"><div class="fLeft" style="width:calc(100% - 152px);"><select class="seleccionar w-98 fs15" name="tc-ciclo" id="tc-ciclo-'+i+'" onchange="seleccionarCiclo(this,'+i+')" title="Ciclo acadÃ©mico" disabled><option value="'+r[2]+'"> '+c.nombre+' </option></select><input type="hidden" name="tc-inicio" value="'+c.inicio+'"><input type="hidden" name="tc-fin" value="'+c.fin+'"></div><div name="tdv-aula" class="fLeft w150 oculto"><select class="seleccionar w-100" name="tc-aula" id="tc-aula-'+i+'" disabled><option value="'+r[3]+'"> '+aula+' </option></select></div></div></td><td class="bbGris txtCenter"><input type="text" class="w-95 txtCenter p5 fs15" name="txb-c-precio" id="tc-precio-'+i+'" value="'+r[4]+'" placeholder="0" onkeyup="validarTotal()" disabled></td><td class="bbGris txtCenter"></td></tr>';
			}else{
				
			}
		}
		document.getElementsByName('tbl-comprobante')[0].innerHTML = t+'<input type="hidden" name="ihr-numeracion" value="'+o.numeracion+'"><input type="hidden" name="ihr-fecha" value="'+o.fecha+'">';
	}
	function lcListar(o){
		var r = o.split("#");
		document.getElementsByName('cit-agregar')[0].classList.add('oculto');
		for(var i=0; i<r.length; i++){
			var fv = r[i].split("&");
			if(fv[0].length == 10 && parseFloat(fv[1]) > 0){
				ob.numcuota++
				document.getElementsByName('ctr-'+i)[0].classList.remove('oculto');
				document.getElementsByName('cit-vencimiento')[i].value = fv[0];
				document.getElementsByName('cit-vencimiento')[i].disabled = true;
				document.getElementsByName('cit-pago')[i].value = fv[1];
				document.getElementsByName('cit-pago')[i].disabled = true;
				document.getElementsByName('cit-efectivo')[i].disabled = true;
				document.getElementsByName('cit-digital')[i].disabled = true;
				document.getElementsByName('cit-tipo')[i].disabled = true;
				document.getElementsByName('cit-remove')[i].classList.add('oculto');
				document.getElementsByName('cit-digital')[i].value = fv[3];
				document.getElementsByName('cit-efectivo')[i].value = fv[4];
				document.getElementsByName('cit-tipo')[i].value = fv[5];
				if(parseInt(fv[2]) == 1){
					document.getElementsByName('cit-estado')[i].checked = true;
					document.getElementsByName('cit-estado')[i].value = 1;
					document.getElementsByName('cit-estado')[i].disabled = true;
					document.getElementsByName('citf-estado'+i)[0].innerText = 'PAGADO';
					document.getElementsByName('cit-digital')[i].value = fv[3];
					document.getElementsByName('cit-digital')[i].disabled = true;
					document.getElementsByName('cit-efectivo')[i].value = fv[4];
					document.getElementsByName('cit-efectivo')[i].disabled = true;
					document.getElementsByName('cit-tipo')[i].value = fv[5];
					document.getElementsByName('cit-tipo')[i].disabled = true;
				}else{
					document.getElementsByName('cit-estado')[i].disabled = true;
				}
			}
		}
		ob.numcuota = ob.numcuota-1;
		if(localStorage.getItem("spmprint")){
			let p = localStorage.getItem("spmprint");
			let head = document.getElementsByTagName('HEAD')[0];
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.media = 'print';
			if(parseInt(p) == 0){
				if(ob.numcuota == 1){
					link.href = 'css/print_tiketera_80s.css?v=1ang';
				}else if(ob.numcuota < 4){
					link.href = 'css/print_tiketera_80m.css?v=1ang';
				}else{
					link.href = 'css/print_tiketera_80l.css?v=1ang';
				}
			}else if(parseInt(p) == 1){
				link.href = 'css/print_a5.css?v=1anc';
			}else if(parseInt(p) == 2){
				if(ob.numcuota == 1){
					link.href = 'css/print_tiketera_58s.css?v=1ang';
				}else if(ob.numcuota < 4){
					link.href = 'css/print_tiketera_58m.css?v=1ang';
				}else{
					link.href = 'css/print_tiketera_58l.css?v=1ang';
				}
			}else if(parseInt(p) == 3){
				link.href = 'css/print_a4.css?v=1anc';
			}
			head.appendChild(link);
		}
	}
}
function reenviarMensualidad(t){
	t.classList.add('oculto');
	var anumero = parseFloat(document.getElementsByName('tbx-a-celular')[0].value);
	var enumero = parseFloat(document.getElementsByName('tbx-c-celular')[0].value);
	if(anumero > 900000000 && anumero < 999999999 || enumero > 900000000 && enumero < 999999999){
		const date = new Date();
		var apellido = document.getElementsByName('tbx-c-apellido')[0].value.toUpperCase();
		var nombre = document.getElementsByName('tbx-c-nombre')[0].value.toUpperCase();
		var dni = document.getElementsByName('tbx-c-dni')[0].value.toUpperCase();
		dni = dni.trim();
		var idciclo = 0;
		for(var i=0; i<20; i++){
			if(document.getElementsByName('tc-ciclo')[i]){
				idciclo = document.getElementsByName('tc-ciclo')[i].value;
			}
		}
		var carrera = document.getElementsByName('tbx-c-carrera')[0].value.toUpperCase();
		ob.dnicodigo = dni;
		ob.idmatricula = ob.imprimirduplicado ;
		var txt_carnet = '<div name="dm-carnet" class="w-100 rel fs18"><img class="abs w-100" src="/archivos/carnet/'+document.getElementsByName('ih-idadmin')[0].value+'/'+idciclo+'.png?v='+date.getTime()+'" onload="resizeDivCarnet(this)"><div name="d-qr" class="abs bgblanco ofHidden p5" style="left:29px;top:146px;width:235px;height:235px"></div><strong class="abs" style="left:315px;top:143px">'+dni+'</strong><strong class="abs" style="left:272px;top:198px">'+apellido+'</strong><strong class="abs" style="left:272px;top:255px">'+nombre+'</strong><strong class="abs" style="left:272px;top:312px">'+carrera+'</strong></div>';
		document.getElementById('contenidoModal').innerHTML = '<div name="dm-comprobante" class="w-100 oculto rel">'+document.getElementsByName('da-pagina1')[0].innerHTML+'</div>'+txt_carnet;
		mostrarModal(800,heightSize()-100);
		document.getElementsByName('da-pagina1')[0].innerHTML = '';
	}
}
function imprimirMensualidad(){
	var dni = document.getElementsByName('tbx-c-dni')[0].value;
	var apellido = document.getElementsByName('tbx-c-apellido')[0].value.toUpperCase();
	var nombre = document.getElementsByName('tbx-c-nombre')[0].value.toUpperCase();
	dni = dni.trim();
	var eiep = document.getElementsByName('tbx-c-colegio')[0].value.toUpperCase();
	var esexo = document.getElementsByName('tbx-c-sexo')[0].value;
	var ecelular = document.getElementsByName('tbx-c-celular')[0].value;
	var efnacimiento = document.getElementsByName('s-c-anio')[0].value+"-"+document.getElementsByName('s-c-mes')[0].value+"-"+document.getElementsByName('s-c-dia')[0].value;
	var elnacimiento = document.getElementsByName('tbx-l-nacimiento')[0].value;
	var anombres = document.getElementsByName('tbx-a-nombre')[0].value.toUpperCase();
	var anumero = document.getElementsByName('tbx-a-celular')[0].value;
	var carrera = document.getElementsByName('tbx-c-carrera')[0].value.toUpperCase();
	if(parseInt(localStorage.getItem("spmprint")) == 1){
		//IMPRIMIR EN A5
		document.getElementsByName('dp-a5')[0].classList.remove('no-imprimir');
		document.getElementsByName('dp-a5')[0].classList.add('si-imprimir');
		document.getElementsByName('dp-a5')[0].classList.remove('oculto');
		document.getElementsByName('sp-recibo')[0].innerHTML = 'RECIBO NÂ°&nbsp;'+document.getElementsByName('ihr-numeracion')[0].value+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FECHA:&nbsp;'+document.getElementsByName('ihr-fecha')[0].value;
		document.getElementsByName('tda-estudiante')[0].innerHTML = '<table class="w-100"><tr><td class="w80">CÃ“DIGO:</td><td>'+dni+'</td></tr><tr><td>APELLIDOS:</td><td>'+apellido+'</td></tr><tr><td>NOMBRES:</td><td>'+nombre+'</td></tr><tr><td>WHATSAPP:</td><td>'+ecelular+'</td></tr></table>';
		document.getElementsByName('sp-acceso')[0].innerHTML = '<table class="w-100"><tr><th colspan="3" style="text-decoration: underline;">&nbsp;DATOS INTRANET&nbsp;</th></tr><tr><td class="p10">URL:&nbsp;&nbsp;<strong>'+window.location.host+'</strong></td><td class="p10">USUARIO:&nbsp;&nbsp;<strong>'+dni+'</strong></td><td class="p10">CONTRASEÃ‘A:&nbsp;&nbsp;<strong>'+dni+'</strong></td></tr></table>';
		document.getElementsByName('tda-apoderado')[0].innerHTML = anombres;
		document.getElementsByName('tdb-apoderado')[0].innerHTML = anumero;
		var c = document.getElementsByName('txb-c-cantidad');
		var cadena_ciclo = '';
		var textotipopago = 'EN CUOTAS';
		for(var i=0; i<c.length; i++){
			var cantidad = document.getElementsByName('txb-c-cantidad')[i].value;
			var descripcion = '';
			var precio = 0;
			if(document.getElementsByName('tc-otro')[i]){
				descripcion = document.getElementsByName('tc-otro')[i].value;
				precio = document.getElementsByName('txb-c-precio')[i].value;
			}else{
				var ci = document.getElementsByName('tc-ciclo')[i];
				descripcion = ci.options[ci.selectedIndex].text;
				cadena_ciclo = '<tr><td>CICLO:</td><td>'+ci.options[ci.selectedIndex].text+'</td></tr><tr><td>INICIO:</td><td>'+document.getElementsByName('tc-inicio')[i].value+'</td></tr><tr><td>FIN:</td><td>'+document.getElementsByName('tc-fin')[i].value+'</td></tr>';
				if(ob.numcuota == 1){
					textotipopago = 'AL CONTADO';
				}
				precio = document.getElementsByName('txb-c-precio')[i].value;
			}
			var sub = parseFloat(precio)*parseInt(cantidad);
			document.getElementsByName('tblp-productos')[0].innerHTML += '<tr><td class="bbGris txtCenter">'+cantidad+'</td><td class="bbGris p5">'+descripcion+'</td><td class="bbGris txtCenter">'+precio+'</td><td class="bbGris txtCenter">'+sub+'</td></tr>';
		}
		var tablecuotas = '';
		if(textotipopago.search('CUOTAS') >= 0){
			for(var i=0; i<20; i++){
				if(document.getElementsByName('cit-pago')[i]){
					if(parseFloat(document.getElementsByName('cit-pago')[i].value) > 0){
						var icv = document.getElementsByName('cit-vencimiento')[i].value;
						var icp = document.getElementsByName('cit-pago')[i].value;
						var ice = document.getElementsByName('cit-estado')[i].value;
						var ive = 'PAGADO';
						var ivecss = 'fwNegrita';
						if(parseInt(ice) == 0){
							ive = 'FALTA PAGAR';
							ivecss = '';
						}
						if(ice == 1){
							tablecuotas += '<tr class="txtCenter '+ivecss+'"><td class="bbGris">'+(i+1)+'</td><td class="bbGris p5">'+document.getElementsByName('cit-vencimiento')[i].value+'</td><td class="bbGris">'+icp+'</td><td class="bbGris">'+ive+'</td></tr>';
						}else{
							tablecuotas += '<tr class="txtCenter '+ivecss+'"><td class="bbGris">'+(i+1)+'</td><td class="bbGris p5">'+document.getElementsByName('cit-vencimiento')[i].value+'</td><td class="bbGris">'+icp+'</td><td class="bbGris">'+ive+'</td></tr>';
						}
					}
				}
			}
		}
		document.getElementsByName('tdb-estudiante')[0].innerHTML = '<table class="w-100"><tr><td class="w80">CARRERA:</td><td>'+carrera+'</td></tr>'+cadena_ciclo+'</table>';
		document.getElementsByName('tblp-productos')[0].innerHTML += '<tr class="fs18 fwNegrita"><td colspan="3" class="p10">TOTAL: </td><td class="txtCenter">S/. '+document.getElementsByName('s-total')[0].innerHTML+'</td></tr>';
		if(tablecuotas.length > 2){
			document.getElementsByName('sp-cuotas')[0].innerHTML = '<strong>PAGO EN PARTES:</strong><br><br><table class="w400"><tr class="bgGris"><th class="w60 p5">CUOTA</th><th>FECHA DE PAGO</th><th class="w70">MONTO</th><th class="w150">ESTADO</th></tr>'+tablecuotas+'</table>';
		}else{
			document.getElementsByName('sp-cuotas')[0].innerHTML = '<strong>PAGO AL CONTADO</strong> POR UN MONTO DE <strong>S/&nbsp;'+document.getElementsByName('s-total')[0].innerHTML+'</strong>';
		}
		document.getElementsByName('sp-observacion')[0].innerHTML = '<br>'+document.getElementsByName('txb-c-observacion')[0].value.toUpperCase();
		if(parseInt(localStorage.getItem("tduplicado")) == 1){
			document.getElementsByName('da-pagina2')[0].innerHTML = document.getElementsByName('da-pagina1')[0].innerHTML;
			document.getElementsByName('da-pagina2')[0].classList.remove('oculto');
		}
	}else{
		//IMPRIMIR EN TIKETERA
		if(parseInt(document.getElementsByName('s-hoja')[0].value) == 2){
			document.getElementsByName('dp-tiketera')[0].classList.add('fs10');
			for(var i=0; i<10; i++){
				if(document.getElementsByName('dp-title')[i]){
					document.getElementsByName('dp-title')[i].classList.add('fs11');
				}
			}
		}else{
			document.getElementsByName('dp-tiketera')[0].classList.add('fs14');
			for(var i=0; i<10; i++){
				if(document.getElementsByName('dp-title')[i]){
					document.getElementsByName('dp-title')[i].classList.add('fs15');
				}
			}
		}
		document.getElementsByName('dp-tiketera')[0].classList.remove('no-imprimir');
		document.getElementsByName('dp-tiketera')[0].classList.add('si-imprimir');
		document.getElementsByName('dp-tiketera')[0].classList.remove('oculto');
		if(parseInt(localStorage.getItem("spmprint")) == 0){
			document.getElementsByName('dp-tiketera')[0].setAttribute('style','top: 0px; width: 300px');
		}else if(parseInt(localStorage.getItem("spmprint")) == 2){
			document.getElementsByName('dp-tiketera')[0].setAttribute('style','top: 0px; width: 220px');
		}
		document.getElementsByName('si-numeracion')[0].innerHTML = document.getElementsByName('ihr-numeracion')[0].value;
		document.getElementsByName('si-apellidos')[0].innerHTML = apellido;
		document.getElementsByName('si-nombres')[0].innerHTML = nombre;
		document.getElementsByName('si-dni')[0].innerHTML = dni;
		var descripcion = '';
		var textotipopago = 'EN CUOTAS';
		for(var i=0; i<20; i++){
			if(document.getElementsByName('tc-ciclo')[i]){
				var ci = document.getElementsByName('tc-ciclo')[i];
				document.getElementsByName('dsi-ciclo')[0].classList.remove('oculto');
				document.getElementsByName('dsi-inicio')[0].classList.remove('oculto');
				document.getElementsByName('dsi-fin')[0].classList.remove('oculto');
				document.getElementsByName('si-ciclo')[0].innerHTML = ci.options[ci.selectedIndex].text;
				document.getElementsByName('si-inicio')[0].innerHTML = document.getElementsByName('tc-inicio')[i].value;
				document.getElementsByName('si-fin')[0].innerHTML = document.getElementsByName('tc-fin')[i].value;
				if(ob.numcuota == 1){
					textotipopago = 'AL CONTADO';
				}
				if(i == 0){
					descripcion = '---------------------------------------------------------<br>CANTIDAD: '+document.getElementsByName('txb-c-cantidad')[i].value+'<br>CICLO: '+ci.options[ci.selectedIndex].text+'<br>PRECIO: S/. '+document.getElementsByName('txb-c-precio')[i].value;
				}else{
					descripcion = descripcion+'<br>---------------------------------------------------------<br>CANTIDAD: '+document.getElementsByName('txb-c-cantidad')[i].value+'<br>CICLO: '+ci.options[ci.selectedIndex].text+'<br>PRECIO: S/. '+document.getElementsByName('txb-c-precio')[i].value;
				}
			}
		}
		var obs = document.getElementsByName('txb-c-observacion')[0].value.toUpperCase();
		if(textotipopago.search('CUOTAS') >= 0){
			document.getElementsByName('txb-c-observacion')[0].value = '<br><br><strong>PAGO EN CUOTAS</strong>';
			for(var i=0; i<20; i++){
				if(document.getElementsByName('cit-pago')[i]){
					if(parseFloat(document.getElementsByName('cit-pago')[i].value) > 0){
						var icv = document.getElementsByName('cit-vencimiento')[i].value;
						var icp = document.getElementsByName('cit-pago')[i].value;
						var ice = document.getElementsByName('cit-estado')[i].value;
						if(ice == 1){
							document.getElementsByName('txb-c-observacion')[0].value += '<br><strong>- CUOTA '+(i+1)+', CANCELADO POR UN MONTO DE S/ '+icp+'</strong>';
						}else{
							document.getElementsByName('txb-c-observacion')[0].value += '<br>- CUOTA '+(i+1)+', FECHA A PAGAR HASTA EL '+icv+' POR UN MONTO DE S/ '+icp+'</strong>';
						}
					}
				}
			}
		}else{
			document.getElementsByName('txb-c-observacion')[0].value = '<br><br><strong>PAGO AL CONTADO</strong> POR UN MONTO DE <strong>S/&nbsp;'+document.getElementsByName('s-total')[0].innerHTML+'</strong>';
		}
		for(var i=0; i<20; i++){
			if(document.getElementsByName('tc-otro')[i]){
				if(descripcion == ''){
					descripcion = '---------------------------------------------------------<br>CANTIDAD: '+document.getElementsByName('txb-c-cantidad')[i].value+'<br>'+document.getElementsByName('tc-otro')[i].value+'<br>PRECIO: S/. '+document.getElementsByName('txb-c-precio')[i].value;
				}else{
					descripcion += '<br>---------------------------------------------------------<br>CANTIDAD: '+document.getElementsByName('txb-c-cantidad')[i].value+'<br>'+document.getElementsByName('tc-otro')[i].value+'<br>PRECIO: S/. '+document.getElementsByName('txb-c-precio')[i].value;
				}
			}
		}
		var celular = document.getElementsByName('tbx-c-celular')[0].value;
		if(celular.length > 2){
			document.getElementsByName('si-celular')[0].innerHTML = document.getElementsByName('tbx-c-celular')[0].value;
			document.getElementsByName('dsi-celular')[0].classList.remove('oculto');
		}
		var carrera = document.getElementsByName('tbx-c-carrera')[0].value;
		if(carrera.length > 2){
			document.getElementsByName('si-carrera')[0].innerHTML = document.getElementsByName('tbx-c-carrera')[0].value;
			document.getElementsByName('dsi-carrera')[0].classList.remove('oculto');
		}
		var anombres = document.getElementsByName('tbx-a-nombre')[0].value;
		if(anombres.length > 2){
			document.getElementsByName('si-anombres')[0].innerHTML = document.getElementsByName('tbx-a-nombre')[0].value;
		}
		var acelular = document.getElementsByName('tbx-a-celular')[0].value;
		if(acelular.length > 2){
			document.getElementsByName('si-acelular')[0].innerHTML = document.getElementsByName('tbx-a-celular')[0].value;
		}
		document.getElementsByName('si-url')[0].innerHTML = 'https://'+location.hostname;
		document.getElementsByName('si-usuario')[0].innerHTML = document.getElementsByName('tbx-c-dni')[0].value;
		document.getElementsByName('si-clave')[0].innerHTML = document.getElementsByName('tbx-c-dni')[0].value;
		document.getElementsByName('si-descripcion')[0].innerHTML = descripcion;
		document.getElementsByName('si-fecha-actual')[0].innerHTML = 'FECHA: '+document.getElementsByName('sih-fecha-actual')[0].value;
		document.getElementsByName('si-total')[0].innerHTML = 'S/. '+document.getElementsByName('s-total')[0].innerHTML;
		if(obs.length > 2){
			obs = '<br><br>'+obs;
		}
		document.getElementsByName('di-observacion')[0].innerHTML = obs+document.getElementsByName('txb-c-observacion')[0].value;
		document.getElementsByName('btn-aceptar-comprobante')[0].value = 'Salir';
		document.getElementsByName('btn-aceptar-comprobante')[0].setAttribute('onclick','salirGestionar()');
		if(parseInt(localStorage.getItem("tduplicado")) == 1){
			document.getElementsByName('dd-tiketera2')[0].innerHTML = document.getElementsByName('dd-tiketera1')[0].innerHTML;
			document.getElementsByName('dd-tiketera2')[0].classList.remove('no-imprimir');
			document.getElementsByName('dd-tiketera2')[0].classList.remove('oculto');
		}
	}
	window.print();
}

function gestionarEliminarComprobante(id, fecha, nombre, deuda, total, detalle, idciclo){
	document.getElementById('contenidoModal').innerHTML = '<div class="w-100 p10 txtCenter fs16">Â¿EstÃ¡ seguro de eliminar el siguiente comprobante de<br><strong class="cCorp">'+nombre+'</strong>?</div><div class="w-100" style="height:180px"><table class="w-100 mt10"><tr class="bgGris"><th class="h30 bbGris">FECHA</th><th class="bbGris">DETALLE</th><th class="bbGris">DEUDA</th><th class="bbGris">TOTAL</th></tr><tr class="txtCenter"><td>'+fecha+'</td><td class="p10">'+detalle+'</td><td>'+deuda+'</td><td>'+total+'</td></tr></table></div><div class="w-100 h30 txtCenter"><p class="w-50 fLeft"><input type="button" class="btnAceptar" value="Aceptar" onclick="confirmarEliminarComprobante('+id+','+idciclo+')"></p><p class="w-50 fLeft"><input type="button" class="btnPeligro" value="Cancelar" onclick="cancelarEliminarComprobante('+idciclo+')"></p></div>';
	mostrarModal(650,280);
}
function confirmarEliminarComprobante(id,idciclo){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			confirmarEliminarComprobante: id
		},success : function(data){
			crearComprobante(ob.idusuario,idciclo);
			cerrarModal();
		}
	});
}
function cancelarEliminarComprobante(idciclo){
	cerrarModal();
}
function seleccionarCiclo(t,n){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			seleccionarCiclo: t.value
		},success : function(data) {
			document.getElementsByName('cit-vencimiento')[0].value = document.getElementsByName('ih-date')[0].value;
			var obj = JSON.parse(data);
			document.getElementsByName('tih-fecha-vencimiento')[0].value = obj.fin;
			document.getElementById('tc-precio-'+n).value = obj.precio;
			document.getElementsByName('tc-inicio')[n].value = obj.inicio;
			document.getElementsByName('tc-fin')[n].value = obj.fin;
			var oba = JSON.parse(obj.aulas);
			var aula = document.getElementById('tc-aula-'+n);
			aula.innerHTML = '';
			var est = 0;
			for(var i=0; i<oba.length; i++){
				var sel = '';
				var aul = 'AULA';
				if(parseInt(oba[i].maximo) <= parseInt(oba[i].cantidad)){
					aul = 'COMPLETO';
				}else if(parseInt(oba[i].maximo) > parseInt(oba[i].cantidad) && est == 0){
					sel = 'selected';
					est = 1;
				}
				aula.innerHTML += '<option value="'+oba[i].id+'" '+sel+'> '+aul+' '+oba[i].aula+' -> '+(parseInt(oba[i].maximo) - parseInt(oba[i].cantidad))+' </option>';
			}
			validarTotal();
		}
	});
}

function agregarCuota(){
	document.getElementsByName('ctr-'+ob.numcuota)[0].classList.remove('oculto');
	ob.numcuota++;
}
function eliminarCuota(n){
	document.getElementsByName('ctr-'+n)[0].classList.add('oculto');
	document.getElementsByName('cit-pago')[n].value = '';
	document.getElementsByName('cit-vencimiento')[n].value = '';
	validarTotal();
}
function salirGestionar(){
	location.reload();
}
function eliminarItem(id){
	document.getElementById('tr-lista'+id).remove();
}

function validarObservacion(t){
	var txt = t.value;
	document.getElementsByName('si-observacion')[0].innerHTML = txt;
	if(txt.length > 1){
		document.getElementsByName('di-observacion')[0].classList.remove("no-imprimir");
	}
	validarTotal();
}
function buscarCODIGO(e){
	if (event.keyCode === 13) {
		var codigo = document.getElementsByName('tbx-f-codigo')[0].value.trim();
		if(parseFloat(codigo) > 0){
			synHttp({
				url : "matricula", type : "POST",
				data : {
					buscarCODIGO : parseFloat(codigo)
				},success : function(data) {
					document.getElementsByName('tb-lista-usuarios')[0].innerHTML = data;
				}
			});
		}
    }
}
function buscarDNI(e){
	if (event.keyCode === 13) {
		var dni = document.getElementsByName('tbx-f-dni')[0].value.trim();
		if(dni.length == 8){
			synHttp({
				url : "matricula", type : "POST",
				data : {
					buscarDNI : dni
				},success : function(data) {
					document.getElementsByName('tb-lista-usuarios')[0].innerHTML = data;
				}
			});
		}
    }
}
function buscarApellidos(e){
	if (event.keyCode === 13) {
		var apno = document.getElementsByName('tbx-f-apellidos')[0].value.trim();
		if(apno.length > 1){
			synHttp({
				url : "matricula", type : "POST",
				data : {
					buscarApellidos : apno
				},success : function(data){
					document.getElementsByName('tb-lista-usuarios')[0].innerHTML = data;
				}
			});
		}
    }
}

function seleccionarHoja(t){
	localStorage.setItem("spmprint",t.value);
	let head = document.getElementsByTagName('HEAD')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'print';
	if(parseInt(t.value) == 0){
		link.href = 'css/print_tiketera_80.css';
	}else if(parseInt(t.value) == 1){
		link.href = 'css/print_a5.css';
	}else if(parseInt(t.value) == 2){
		link.href = 'css/print_tiketera_58.css';
	}else if(parseInt(t.value) == 3){
		link.href = 'css/print_a4.css';
	}
    //head.appendChild(link);
	var url = window.location;
	location.href = url;
}
function clickEstadoPago(t,n){
	if(t.checked == true){
		t.value = 1;
		document.getElementsByName('citf-estado'+n)[0].innerText = 'PAGADO';
		var cp = document.getElementsByName('cit-pago')[n].value;
		var t = `
		<tr class="hoverGris" name="tr-lista" id="tr-lista`+n+`">
			<td class="bbGris h35 txtCenter">
				<input type="text" class="w-95 txtCenter p5" name="txb-c-cantidad" id="txb-c-cantidad-`+n+`" value="1" onkeyup="validarTotal()" autocomplete="off" disabled>
			</td>
			<td class="bbGris">
				<div class="wl-100" name="d-otro">
					<div class="fLeft w-100 rel">
						<input type="text" class="w-100 fs15 p5" name="tc-otro" id="tc-otro-`+n+`" value="CUOTA `+(n+1)+` CANCELADA, DEL MONTO TOTAL S/ `+document.getElementsByName('tih-cuota-total')[0].value+`" onkeyup="filtrarProducto(`+n+`)" disabled>
						<div name="db-producto`+n+`" class="abs h200 w-100 brGris bgBlanco oculto"></div>
					</div>
				</div>
			</td>
			<td class="bbGris txtCenter">
				<input type="text" class="w-95 txtCenter fs15 p5" name="txb-c-precio" id="tc-precio-`+n+`" value="`+cp+`" autocomplete="off" disabled>
			</td>
			<td class="bbGris txtCenter">
				<img class="w20 mano oculto" src="/img/svg/remove.svg" title="Eliminar Ã­tem" onclick="eliminarItem(`+n+`)">
			</td>
		</tr>`;
		document.getElementsByName('tbl-comprobante')[0].innerHTML += t;
	}else{
		t.value = 0;
		document.getElementsByName('citf-estado'+n)[0].innerText = 'DEUDA';
		document.getElementById('tr-lista'+n).remove();
	}
	validarTotal();
}
function gestionarProductos(){
	var h = heightSize()-80;
	var w = widthSize()-80;
	synHttp({
		url : "matricula", type : "POST",
		data : {
			gestionarProductos : 1,
			height : h,
			width : w
		},success : function(data){
			document.getElementById('contenidoModal').innerHTML = data;
			mostrarModal(w,h);
			myCalendarp = new dhtmlXCalendarObject(["pit-fecha"]);
		}
	});
}
function validarRegistroProducto(){
	var n = document.getElementById('pit-nombre').value;
	var p = document.getElementById('pit-precio').value;
	if(n.length > 1 && parseFloat(p) > 0){
		document.getElementsByName('pii-guardar')[0].classList.remove('oculto');
	}else{
		document.getElementsByName('pii-guardar')[0].classList.add('oculto');
	}
}
function guardarProducto(){
	var n = document.getElementById('pit-nombre').value;
	var p = document.getElementById('pit-precio').value;
	if(n.length > 1 && parseFloat(p) > 0 && parseInt(document.getElementsByName('pit-sede')[0].value) > 0){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				guardarProducto :document.getElementsByName('pit-sede')[0].value,
				nombre : n,
				precio : p
			},success : function(data){
				gestionarProductos();
			}
		});
	}
}
function editarProducto(id){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			editarProducto : id
		},success : function(data){
			document.getElementsByName('tr-pi-'+id)[0].innerHTML = data;
		}
	});
}
function guardarEditarProducto(id){
	var n = document.getElementById('tr-it-nombre-'+id).value;
	var p = document.getElementById('tr-it-precio-'+id).value;
	if(n.length > 1 && parseFloat(p) > 0){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				guardarEditarProducto : id,
				nombre : n,
				precio : p
			},success : function(data){
				gestionarProductos();
			}
		});
	}
}
function estadoProducto(id,es){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			estadoProducto : id,
			estado : es
		},success : function(data){
			gestionarProductos();
		}
	});
}

function gestionarGastos(){
	var h = heightSize()-80;
	var w = widthSize()-80;
	synHttp({
		url : "matricula", type : "POST",
		data : {
			gestionarGastos : 1,
			height : h,
			width : w
		},success : function(data){
			document.getElementById('contenidoModal').innerHTML = data;
			mostrarModal(w,h);
		}
	});
}
function validarRegistroGasto(){
	var n = document.getElementById('pit-nombre').value;
	var p = document.getElementById('pit-precio').value;
	if(n.length > 1 && parseFloat(p) > 0){
		document.getElementsByName('pii-guardar')[0].classList.remove('oculto');
	}else{
		document.getElementsByName('pii-guardar')[0].classList.add('oculto');
	}
}
function guardarGasto(){
	var n = document.getElementById('pit-nombre').value;
	var p = document.getElementById('pit-precio').value;
	if(n.length > 1 && parseFloat(p) > 0 && parseInt(document.getElementsByName('pit-sede')[0].value) > 0){
		synHttp({
			url : "matricula", type : "POST",
			data : {
				guardarGasto :document.getElementsByName('pit-sede')[0].value,
				nombre : n,
				precio : p,
				idcaja : document.getElementsByName('sc-caja')[0].value
			},success : function(data){
				gestionarGastos();
			}
		});
	}
}
function estadoGasto(id,es){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			estadoGasto : id,
			estado : es
		},success : function(data){
			gestionarGastos();
		}
	});
}

function gestionarExportar(){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			gestionarExportar : heightSize()-100
		},success : function(data) {
			document.getElementById('contenidoModal').innerHTML = data;
			mostrarModal(550,heightSize()-100);
			myCalendarei = new dhtmlXCalendarObject(["ite-finicio"]);
			myCalendaref = new dhtmlXCalendarObject(["ite-ffin"]);
		}
	});
}
function exportarFiltro(idcaja,personal){
	synHttp({
		url : "matricula", type : "POST",
		data : {
			exportarFiltro: idcaja,
			finicio : document.getElementById('ite-finicio').value,
			ffin : document.getElementById('ite-ffin').value
		},success : function(data){
			if(data.length > 5){
				var ob = JSON.parse(data);
				var wb = XLSX.utils.book_new();
				var c_fecha = document.getElementsByName('ih-date')[0].value.split("-");
				wb.Props = {
					Title: "FILTRO",
					Subject: "FILTRO",
					Author: "SISTEMAPRE",
					CreatedDate: new Date(c_fecha[0],c_fecha[1],c_fecha[2])
				};
				wb.SheetNames.push("FILTRO");
				var arreglo_a = ['CÃ“DIGO','FECHA','DNI','CLIENTE','DETALLE','OBSERVACIÃ“N','VENCIMIENTO','EFECTIVO','DIGITAL','PAGÃ“','DEUDA','TOTAL','PERSONAL'];
				var ws_data = [arreglo_a];
				for(var i=0; i<ob.length; i++){
					var arreglo = [];
					if(ob[i].codigo){
						arreglo.push(ob[i].codigo);
						arreglo.push(ob[i].fecha);
						arreglo.push(ob[i].dni);
						arreglo.push(ob[i].nombre);
						arreglo.push(ob[i].cadena);
						arreglo.push(ob[i].observacion);
						arreglo.push(ob[i].vencimiento);
						arreglo.push(ob[i].efectivo);
						arreglo.push(ob[i].digital);
						arreglo.push(parseFloat(ob[i].efectivo)+parseFloat(ob[i].digital));
						arreglo.push(ob[i].saldo);
						arreglo.push(ob[i].total);
						arreglo.push(ob[i].personal);
					}else{
						var obj = JSON.parse(ob[i]);
						arreglo.push(obj.codigo);
						arreglo.push(obj.fecha);
						arreglo.push(obj.dni);
						arreglo.push(obj.nombre);
						arreglo.push(obj.cadena);
						arreglo.push(obj.observacion);
						arreglo.push(obj.vencimiento);
						arreglo.push(obj.efectivo);
						arreglo.push(obj.digital);
						arreglo.push(parseFloat(obj.efectivo)+parseFloat(obj.digital));
						arreglo.push(obj.saldo);
						arreglo.push(obj.total);
						arreglo.push(obj.personal);
					}
					ws_data.push(arreglo);
				}
				var ws = XLSX.utils.aoa_to_sheet(ws_data);
				wb.Sheets["FILTRO"] = ws;
				
				var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
				saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'CAJA - '+personal+' - '+idcaja+'.xlsx');
				var url = window.location;
				//location.href = url;
			}
		}
	});
}

function sendWhatsapp(){
	var nume = parseFloat(document.getElementsByName('tbx-c-celular')[0].value);
	var numa = parseFloat(document.getElementsByName('tbx-a-celular')[0].value);
	if((numa < 900000000 || numa > 999999999) || (nume < 900000000 || nume > 999999999)){
		return;
	}
	html2canvas(document.getElementsByName('dm-comprobante')[0]).then(canvas => {
		synHttp({
			url : "matricula", type : "POST",
			data : {
				sendWhatsapp : parseFloat(ob.idmatricula),
				idsede : document.getElementsByName('sc-sede')[0].value,
				imatricula : canvas.toDataURL(),
				numero : parseFloat(document.getElementsByName('tbx-a-celular')[0].value),
				numeroe : parseFloat(document.getElementsByName('tbx-c-celular')[0].value),
				dni : parseFloat(document.getElementsByName('tbx-c-dni')[0].value),
				apoderadonombre : document.getElementsByName('tbx-a-nombre')[0].value,
				apoderadodni : document.getElementsByName('tbx-a-dni')[0].value,
				cuotacomprobante : document.getElementsByName('tih-pago-cuota')[0].value
			},success : function(data){
				listarComprobantes();
			}
		});
	});
}
function imagenComprobante(){
	var num = parseFloat(document.getElementsByName('tbx-a-celular')[0].value);
	if(num < 900000000 || num > 999999999){
		return;
	}
	html2canvas(document.getElementsByName('dm-carnet')[0]).then(canvas => {
		//simulateDownloadImageClick(canvas.toDataURL(), 'WHATSAPP.png');
		synHttp({
			url : "matricula", type : "POST",
			data : {
				imagenComprobante : canvas.toDataURL(),
				imatricula : parseFloat(ob.idmatricula)
			},success : function(data){
				validarComprobante();
			}
		});
	});
}
function validarComprobante(){
	document.getElementsByName('ipa5-h')[0].setAttribute('src','/img/matricula/'+document.getElementsByName('ih-idadmin')[0].value+'/membrete.jpg');
	document.getElementsByName('ipa5-h')[0].setAttribute('style','width:100%;left:0;top:0px;z-index:0');
	document.getElementsByName('ipa5-l')[0].classList.add('oculto');
	document.getElementsByName('dpa-h')[0].classList.remove('h75');
	document.getElementsByName('dpa-h')[0].classList.add('h250');
	const date = new Date();
	var dni = document.getElementsByName('tbx-c-dni')[0].value;
	var apellido = document.getElementsByName('tbx-c-apellido')[0].value.toUpperCase();
	var nombre = document.getElementsByName('tbx-c-nombre')[0].value.toUpperCase();
	dni = dni.trim();
	var ecelular = document.getElementsByName('tbx-c-celular')[0].value;
	var anombres = document.getElementsByName('tbx-a-nombre')[0].value.toUpperCase();
	var anumero = document.getElementsByName('tbx-a-celular')[0].value;
	var carrera = document.getElementsByName('tbx-c-carrera')[0].value.toUpperCase();
	document.getElementsByName('dm-comprobante')[0].innerHTML += '<img class="abs w150" style="left:100px;bottom:100px" src="/archivos/firma/'+dni+'.png?v='+date.getTime()+'">';
	document.getElementsByName('dm-comprobante')[0].innerHTML += '<img class="abs w150" style="right:100px;bottom:100px" src="/archivos/firma/'+document.getElementsByName('ih-idadmin')[0].value+'/'+document.getElementsByName('ih-idpersonal')[0].value+'.png?v='+date.getTime()+'">';
	document.getElementsByName('dm-comprobante')[0].innerHTML += '<span class="abs" style="right:87px;bottom:85px">'+document.getElementsByName('ih-nombre-usuario')[0].value+'</span>';
	
	document.getElementsByName('dp-a5')[0].classList.remove('no-imprimir');
	document.getElementsByName('dp-a5')[0].classList.add('si-imprimir');
	document.getElementsByName('dp-a5')[0].classList.remove('oculto');
	document.getElementsByName('sp-recibo')[0].innerHTML = 'RECIBO NÂ°&nbsp;'+document.getElementsByName('ihr-numeracion')[0].value+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FECHA:&nbsp;'+document.getElementsByName('ihr-fecha')[0].value;
	document.getElementsByName('tda-estudiante')[0].innerHTML = '<table class="w-100"><tr><td class="w80">CÃ“DIGO:</td><td>'+dni+'</td></tr><tr><td>APELLIDOS:</td><td>'+apellido+'</td></tr><tr><td>NOMBRES:</td><td>'+nombre+'</td></tr><tr><td>WHATSAPP:</td><td>'+ecelular+'</td></tr></table>';
	document.getElementsByName('sp-acceso')[0].innerHTML = '<table class="w-100"><tr><th colspan="3" style="text-decoration: underline;">&nbsp;DATOS INTRANET&nbsp;</th></tr><tr><td class="p10">URL:&nbsp;&nbsp;<strong>'+window.location.host+'</strong></td><td class="p10">USUARIO:&nbsp;&nbsp;<strong>'+dni+'</strong></td><td class="p10">CONTRASEÃ‘A:&nbsp;&nbsp;<strong>'+dni+'</strong></td></tr></table>';
	document.getElementsByName('tda-apoderado')[0].innerHTML = anombres;
	document.getElementsByName('tdb-apoderado')[0].innerHTML = anumero;
	var c = document.getElementsByName('txb-c-cantidad');
	var cadena_ciclo = '';
	var textotipopago = 'EN CUOTAS';
	for(var i=0; i<c.length; i++){
		var cantidad = document.getElementsByName('txb-c-cantidad')[i].value;
		var descripcion = '';
		var precio = 0;
		if(document.getElementsByName('tc-otro')[i]){
			descripcion = document.getElementsByName('tc-otro')[i].value;
			precio = document.getElementsByName('txb-c-precio')[i].value;
		}else{
			var ci = document.getElementsByName('tc-ciclo')[i];
			descripcion = ci.options[ci.selectedIndex].text;
			cadena_ciclo = '<tr><td>CICLO:</td><td>'+ci.options[ci.selectedIndex].text+'</td></tr><tr><td>INICIO:</td><td>'+document.getElementsByName('tc-inicio')[i].value+'</td></tr><tr><td>FIN:</td><td>'+document.getElementsByName('tc-fin')[i].value+'</td></tr>';
			if(ob.numcuota == 1){
				textotipopago = 'AL CONTADO';
			}
			precio = document.getElementsByName('txb-c-precio')[i].value;
		}
		var sub = parseFloat(precio)*parseInt(cantidad);
		document.getElementsByName('tblp-productos')[0].innerHTML += '<tr><td class="bbGris txtCenter">'+cantidad+'</td><td class="bbGris p5">'+descripcion+'</td><td class="bbGris txtCenter">'+precio+'</td><td class="bbGris txtCenter">'+sub+'</td></tr>';
	}
	var tablecuotas = '';
	if(textotipopago.search('CUOTAS') >= 0){
		for(var i=0; i<20; i++){
			if(document.getElementsByName('cit-pago')[i]){
				if(parseFloat(document.getElementsByName('cit-pago')[i].value) > 0){
					var icv = document.getElementsByName('cit-vencimiento')[i].value;
					var icp = document.getElementsByName('cit-pago')[i].value;
					var ice = document.getElementsByName('cit-estado')[i].value;
					var ive = 'PAGADO';
					var ivecss = 'fwNegrita';
					if(parseInt(ice) == 0){
						ive = 'FALTA PAGAR';
						ivecss = '';
					}
					if(ice == 1){
						tablecuotas += '<tr class="txtCenter '+ivecss+'"><td class="bbGris">'+(i+1)+'</td><td class="bbGris p5">'+document.getElementsByName('cit-vencimiento')[i].value+'</td><td class="bbGris">'+icp+'</td><td class="bbGris">'+ive+'</td></tr>';
					}else{
						tablecuotas += '<tr class="txtCenter '+ivecss+'"><td class="bbGris">'+(i+1)+'</td><td class="bbGris p5">'+document.getElementsByName('cit-vencimiento')[i].value+'</td><td class="bbGris">'+icp+'</td><td class="bbGris">'+ive+'</td></tr>';
					}
				}
			}
		}
	}
	document.getElementsByName('tdb-estudiante')[0].innerHTML = '<table class="w-100"><tr><td class="w80">CARRERA:</td><td>'+carrera+'</td></tr>'+cadena_ciclo+'</table>';
	document.getElementsByName('tblp-productos')[0].innerHTML += '<tr class="fs18 fwNegrita"><td colspan="3" class="p10">TOTAL: </td><td class="txtCenter">S/. '+document.getElementsByName('s-total')[0].innerHTML+'</td></tr>';
	if(tablecuotas.length > 2){
		document.getElementsByName('sp-cuotas')[0].innerHTML = '<strong>PAGO EN PARTES:</strong><br><br><table class="w400"><tr class="bgGris"><th class="w60 p5">CUOTA</th><th>FECHA DE PAGO</th><th class="w70">MONTO</th><th class="w150">ESTADO</th></tr>'+tablecuotas+'</table>';
	}else{
		document.getElementsByName('sp-cuotas')[0].innerHTML = '<strong>PAGO AL CONTADO</strong> POR UN MONTO DE <strong>S/&nbsp;'+document.getElementsByName('s-total')[0].innerHTML+'</strong>';
	}
	document.getElementsByName('sp-observacion')[0].innerHTML = '<br>'+document.getElementsByName('txb-c-observacion')[0].value.toUpperCase();
	setTimeout(function() {
		document.getElementById('contenidoModal').classList.add('barY');
		document.getElementsByName('dm-carnet')[0].classList.add('oculto');
		document.getElementsByName('dm-comprobante')[0].classList.remove('oculto');
		document.getElementsByName('dm-comprobante')[0].setAttribute('style','height:1100px');
		sendWhatsapp();
	}, 1000);
}
function resizeDivCarnet(t){
	if(!ob.elimg){
		ob.elimg = 1;
		setTimeout(function() {
			document.getElementsByName('ipa5-h')[0].setAttribute('src','/img/matricula/'+document.getElementsByName('ih-idadmin')[0].value+'/membrete.jpg');
			document.getElementsByName('ipa5-h')[0].setAttribute('style','width:100%;left:0;top:0px;z-index:0');
			document.getElementsByName('ipa5-l')[0].classList.add('oculto');
			document.getElementsByName('dpa-h')[0].classList.remove('h75');
			document.getElementsByName('dpa-h')[0].classList.add('h250');
			var wo = parseInt(t.naturalWidth);
			var wn = parseInt(document.getElementById('contenidoModal').offsetWidth);
			var porcentaje = (wn*100/wo);
			document.getElementsByName('dm-carnet')[0].setAttribute('style','height:'+(porcentaje*t.naturalHeight/100)+'px');
			let qrcodeContainer = document.getElementsByName('d-qr')[0];
			new QRCode(qrcodeContainer, {
				text: ob.dnicodigo.toString(),
				width: 220,
				height: 220,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			});
			setTimeout(function() {
				imagenComprobante();
			}, 200);
		}, 200);
	}
}

function seleccionarSize(){
	localStorage.setItem("tsize", document.getElementsByName('s-size')[0].value);
	document.getElementsByName('dc-recibo')[0].setAttribute('style','font-size:'+document.getElementsByName('s-size')[0].value+'px !important');
	var e = document.getElementsByTagName("input");
	for(var i=0; i<e.length; i++){
		if(e[i].type != "hidden"){
			e[i].setAttribute('style','font-size:'+document.getElementsByName('s-size')[0].value+'px !important');
		}
	}
	var s = document.getElementsByTagName("select");
	for(var i=0; i<s.length; i++){
		s[i].setAttribute('style','font-size:'+document.getElementsByName('s-size')[0].value+'px !important');
	}
}
function seleccionarDuplicado(){
	localStorage.setItem("tduplicado", parseInt(document.getElementsByName('s-duplicado')[0].value));
}
function s2ab(s){ 
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf);  //create uint8array as viewer
	for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	return buf;    
}
function numeroOrdinal(n){
	var t = '';
	if(parseInt(n) == 1){
		t = 'PRIMERA';
	}else if(parseInt(n) == 2){
		t = 'SEGUNDA';
	}else if(parseInt(n) == 3){
		t = 'TERCERA';
	}else if(parseInt(n) == 4){
		t = 'CUARTA';
	}
	return t;
}