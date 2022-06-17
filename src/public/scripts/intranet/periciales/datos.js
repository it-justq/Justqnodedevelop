function uploadDatos(name, informe_id, value){

	var parametros = {name, informe_id, value};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		$.ajax({
			data:  parametros,
			url:   '/intranet/pericial/'+informe_id+'/datos/mod',
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
