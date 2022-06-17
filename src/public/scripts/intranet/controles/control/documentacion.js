function deleteAllImg(controlId){ 
    if (confirm("¿Seguro que quieres borrar todas las fotos?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/'+controlId+'/documentacion', 
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
}

function deleteImg(id, controlId){    
    if (confirm("¿Seguro que la quieres borrar?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/'+controlId+'/documentacion/'+id,
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
    
    
}

function showImgDocumentacion(VALUE){
    let ct = document.getElementById('show-img-documentacion-ct');
    let img_src = document.getElementById('show-img-documentacion');

    ct.style.display="block";
    img_src.src='https://fotos.justq.eu/'+VALUE;
}

function closeImgDocumentacion(){
    let ct = document.getElementById('show-img-documentacion-ct');
    let img_src = document.getElementById('show-img-documentacion');

    ct.style.display="none";
    img_src.src="";
}