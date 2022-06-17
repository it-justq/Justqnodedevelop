function deleteAllImg(pcId, controlId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/'+controlId+'/punto-control/'+pcId+'/fotos',
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

function deleteImg(id, pcId, controlId){    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/control/'+controlId+'/punto-control/'+pcId+'/foto/'+id,
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