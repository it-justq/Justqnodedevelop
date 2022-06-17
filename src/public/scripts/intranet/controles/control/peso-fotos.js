function deleteAllImg(pesoId, controlId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/'+controlId+'/peso/'+pesoId+'/fotos',
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

function deleteImg(controlId, pesoId, fotoId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/'+controlId+'/peso/'+pesoId+'/foto/'+fotoId,
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