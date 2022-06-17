function deleteAllImg(controlId){   
    if (confirm("¿Seguro que quieres borrar todas las fotos?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/'+controlId+'/fotos',
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
				alert("ERROR: "+ JSON.stringify(error));
                location.reload();
			}
        });
    }
        
}

function deleteImg(id, controlId){  
    if (confirm("¿Seguro que la quieres borrar?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/'+controlId+'/foto/'+id,
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
				alert("ERROR: "+ JSON.stringify(error));
                location.reload();
			}
        });
    }  
    
}

function showImgFotos(VALUE){
    let ct = document.getElementById('show-img-fotos-ct');
    let img_src = document.getElementById('show-img-fotos');

    ct.style.display="block";
    img_src.src='https://fotos.justq.eu/'+VALUE;
}

function closeImgFotos(){
    let ct = document.getElementById('show-img-fotos-ct');
    let img_src = document.getElementById('show-img-fotos');

    ct.style.display="none";
    img_src.src="";
}