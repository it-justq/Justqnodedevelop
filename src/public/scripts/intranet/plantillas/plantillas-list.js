
function generateControlPlantilla(plantillaId){
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        url:   '/intranet/plantillas/'+plantillaId+'/nuevo/control',
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
                window.location.href = "https://www.pruebas.justq.eu/intranet/control/"+response.hash;
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


function paginacion() {

	var current = parseInt(document.getElementById('current-page').innerText);
	var total = parseInt(document.getElementById('plantillas-total').innerText);

	if(current == 1){
		document.getElementById('previous-page').style.display = "none";
	}else if(current > 1){
		document.getElementById('previous-page').href = current - 1;

	var page2 = document.getElementById('page2');
	var page3 = document.getElementById('page3');
	var page4 = document.getElementById('page4');
	var page5 = document.getElementById('page5');

	page2.innerText = current + 1;
	page3.innerText = current + 2;
	page4.innerText = current + 3;
	page5.innerText = current + 4;

	const link = '/intranet/plantillas/';

	page2.href = link+page2.innerText;
	page3.href = link+page3.innerText;
	page4.href = link+page4.innerText;
	page5.href = link+page5.innerText;

	}else{
		document.getElementById('pagination_container').style.display = "none";
	}
            

}

window.addEventListener("load", function(event) {
	paginacion();
});