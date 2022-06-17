function deleteAllImg(controlId){   
    if (confirm("Are you sure you want to delete all photos?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/en/'+controlId+'/fotos',
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
    if (confirm("Are you sure you want to delete it?") == true) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            url:   '/intranet/control/en/'+controlId+'/foto/'+id,
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