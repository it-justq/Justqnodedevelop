function deleteAllImg(cajaId, controlId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/en/'+controlId+'/caja/'+cajaId+'/fotos',
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

function deleteImg(controlId, cajaId, fotoId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/en/'+controlId+'/caja/'+cajaId+'/foto/'+fotoId,
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