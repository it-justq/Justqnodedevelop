function addPesos(controlId){

	let value = document.getElementById('pesos-nuevo-number').value;
	var parametros = {value, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/peso/add',
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


function delPeso(id, controlId){


	var parametros = {id, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/peso/'+id,
			headers: {
				'CSRF-Token': token
			},
			type:  'DELETE',
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


function modPeso(value, id, controlId, type){

	var parametros = {value, id, controlId, value, type};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/peso/mod/'+id,
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
					activeTick(id, type);
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


function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function activeTick(id, type){
	document.getElementById('tick-confirm-'+type+"_"+id).style.display="block";

	await sleep(1500);

	document.getElementById('tick-confirm-'+type+"_"+id).style.display="none";
}