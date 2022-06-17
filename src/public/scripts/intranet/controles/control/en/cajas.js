
function uploadDatos(id, value, controlId, name){

	var parametros = {id, value, controlId, name};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/caja/mod/'+id,
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
					activeTick(id, name);
				}else{
					console.log(response);
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

function addCajas(controlId){

	let value = document.getElementById('cajas-nuevo-number').value;
	var parametros = {value, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/caja/add',
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


function delCaja(id, controlId){

	var parametros = {id, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/caja/'+id,
			headers: {
				'CSRF-Token': token
			},
			type:  'DELETE',
			cache: false,
			beforeSend: function () {
				//location.reload();
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


function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function activeTick(id, name){
	document.getElementById('tick-confirm-'+name+"_"+id).style.display="block";

	await sleep(1500);

	document.getElementById('tick-confirm-'+name+"_"+id).style.display="none";
}