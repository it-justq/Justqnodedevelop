function modUser(id, campo){

	let value = document.getElementById(campo).value;
	var parametros = {id, campo, value};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        data:  parametros,
        url:   '/intranet/administracion/usuarios/en/usuario/'+id+'/preferencias',
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
                alert('ERROR: '+ JSON.stringify(response));
                location.reload();
            }
        },
        error: function(error) {
            alert('ERROR: '+ JSON.stringify(error));
            location.reload();
        }
    });

}