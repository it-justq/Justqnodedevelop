function uploadDatos(id, controlId, value, type){

	var parametros = {id, controlId, value, type};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/precarga/mod/'+id,
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
					activeTick(id);
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