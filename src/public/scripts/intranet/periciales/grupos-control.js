function uploadDatos(id, value, informeId){

	var parametros = {id, value, informeId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/pericial/'+informeId+'/grupos-control',
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
				activeTick(id, subtype);
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
    
    async function activeTick(id, subtype){
    document.getElementById('tick-confirm-'+subtype+"-"+id).style.display="block";
    
    await sleep(1500);
    
    document.getElementById('tick-confirm-'+subtype+"-"+id).style.display="none";
    }