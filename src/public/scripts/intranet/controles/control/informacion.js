function abrirInformacionControl(evt, tab) {

	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("informacion-part");

	for (i = 0; i < tabcontent.length; i++) {
	   	tabcontent[i].style.display = "none";	
	}
	
	tablinks = document.getElementsByClassName("ct-1-tablinks");
	
	for (i = 0; i < tablinks.length; i++) {
    	tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
  
	document.getElementById('informacion-part-'+tab).style.display = "block";
	evt.currentTarget.className += " active";
}




function uploadDatos(controlId, value, type){

	var parametros = {controlId, value, type};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/informacion/mod',
			headers: {
				'CSRF-Token': token
			},
			type:  'POST',
			cache: false,
			beforeSend: function () {
				//location.reload();
			},
			success:  function (response) {
				
				if(response.status === 'ok'){
					location.reload();
				}else{
					alert('ERROR: '+response.code);
				}
			},
			error: function(error) {
				alert("ERROR: "+error);
			}
		});

}


function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function activeTick(id){
	document.getElementById('tick-confirm-'+id).style.display="block";

	await sleep(1500);

	document.getElementById('tick-confirm-'+id).style.display="none";
}



function sendMailControlCliente(controlId){

	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			url:   '/intranet/control/'+controlId+'/enviar/email/cliente', 
			headers: {
				'CSRF-Token': token
			},
			type:  'POST',
			cache: false,
			beforeSend: function () {
				//location.reload();
			},
			success:  function (response) {
				
				if(response.status === 'ok'){
					alert(response.code);
                    location.reload();
				}else{
					alert('ERROR: '+response.code);
				}

			},
			error: function(error) {
				alert("ERROR: "+error);
			}
		});

}


function deleteControl(controlId, tecnicoId){
	window.alert('Si borras el control no se podrán recuperar los datos')
	if(window.confirm("¿Borrar el control?")) {

		var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		var parametros = {confirmed: 'true', controlId, tecnicoId};

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/eliminar', 
			headers: {
				'CSRF-Token': token
			},
			type:  'POST',
			cache: false,
			beforeSend: function () {
				spinOn();
			},
			success:  function (response) {
				
				if(response.status === 'ok'){
					window.location.href = '/intranet/controles';
				}else{
					alert('ERROR: '+ JSON.stringify(response.code));
                	location.reload();
				}

			},
			error: function(error) {
				alert('ERROR: '+ JSON.stringify(error));
				location.reload();
			}
		});
		
	}
}


function deletePlantilla(controlId, plantillaId){
	if(window.confirm("¿Borrar la plantilla?")) {

		var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			url:   '/intranet/control/'+controlId+'/delete/plantilla/'+plantillaId, 
			headers: {
				'CSRF-Token': token
			},
			type:  'delete',
			cache: false,
			beforeSend: function () {
				spinOn();
			},
			success:  function (response) {
				
				if(response.status === 'ok'){
					location.reload();
				}else{
					alert('ERROR: '+ JSON.stringify(response.code));
                	location.reload();
				}

			},
			error: function(error) {
				alert('ERROR: '+ JSON.stringify(error));
				location.reload();
			}
		});
		
	}
}