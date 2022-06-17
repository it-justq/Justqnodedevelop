function uploadDatos(name, controlId, value){

	var parametros = {name, controlId, value};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/en/'+controlId+'/datos/mod',
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
					activeTick(name);
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

async function activeTick(id){
	document.getElementById('tick-confirm-'+id).style.display="block";

	await sleep(1500);

	document.getElementById('tick-confirm-'+id).style.display="none";
}



function sendMailControlCliente(controlId){

	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			url:   '/intranet/control/en/'+controlId+'/enviar/email/cliente', 
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
