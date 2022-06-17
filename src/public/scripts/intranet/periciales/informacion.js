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
