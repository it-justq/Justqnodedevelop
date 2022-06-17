window.onload = function (){

    let area =document.getElementsByClassName("accion-textarea");

    for(i = 0; i < area.length; i ++){
    	area[i].style.height = area[i].scrollHeight+'px';

    }
	
};

function uploadDatos(id, controlId, type){


		let value = document.getElementById('accion-textarea-'+id).value;
		var parametros = {id, controlId, value};
		var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/accion/mod/'+id,
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
					activeTick(id, type);
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

function uploadDatosNew(controlId, type){

	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	
	var parametros = {controlId, type};

		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/accion/add/'+type,
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

function deleteAccion(controlId, id, type){
	
	var parametros = {controlId, id, type};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	
	if (confirm("¿Seguro que la quieres borrar?") == true) {
		$.ajax({
			data:  parametros,
			url:   '/intranet/control/'+controlId+'/accion/'+id+'/'+type,
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


function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function activeTick(id, type){
	document.getElementById('tick-confirm-'+type+"_"+id).style.display="block";

	await sleep(1500);

	document.getElementById('tick-confirm-'+type+"_"+id).style.display="none";
}


window.onload = function (){

    let area =document.getElementsByClassName("accion-textarea");

    for(i = 0; i < area.length; i ++){
    	area[i].style.height = area[i].scrollHeight+'px';

    }
	
};


function openNew(VALUE){
	switch (VALUE){
		case 'txt':
			document.getElementById('acciones-nueva-img').style.display="none";
			break;
		case 'img':
			document.getElementById('acciones-nueva-img').style.display="block";
			break;
	}
}


//PREVIEW IMG PRECARGA
document.getElementById("acciones-nueva-img-input").onchange = function(e) {
	let reader = new FileReader();
  
	reader.readAsDataURL(e.target.files[0]);
  
	reader.onload = function(){
		let preview = document.getElementById('acciones-nueva-pre-img-ct'),
			image = document.createElement('img');
  
		image.src = reader.result;
  
		preview.innerHTML = '';
		preview.append(image);
		image.id="acciones-nueva-pre-img";

	};
  }




function showImgAcciones(VALUE){
    let ct = document.getElementById('show-img-acciones-ct');
    let img_src = document.getElementById('show-img-acciones');

    ct.style.display="block";
    img_src.src='https://fotos.justq.eu/'+VALUE;
}

function closeImgAcciones(){
    let ct = document.getElementById('show-img-acciones-ct');
    let img_src = document.getElementById('show-img-acciones');

    ct.style.display="none";
    img_src.src="";
}



$(document).ready(function() {
    var elementos = document.getElementsByClassName('accion-textarea');

	/*for(i=0;i<elementos.length;i++){
		ClassicEditor.create( document.getElementById(elementos[i].id),{
			toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo' ],
			heading: {
				options: [
					{ model: 'paragraph', title: 'Párrafo', class: 'ck-heading_paragraph' },
					{ model: 'heading1', view: 'h1', title: 'Encabezado 1', class: 'ck-heading_heading1' },
					{ model: 'heading2', view: 'h2', title: 'Encabezado 2', class: 'ck-heading_heading2' },
					{ model: 'heading3', view: 'h3', title: 'Encabezado 3', class: 'ck-heading_heading3' },
					{ model: 'heading4', view: 'h4', title: 'Encabezado 4', class: 'ck-heading_heading4' },
					{ model: 'heading5', view: 'h5', title: 'Encabezado 5', class: 'ck-heading_heading5' },
					{ model: 'heading6', view: 'h6', title: 'Encabezado 6', class: 'ck-heading_heading6' }
				],
				
				
			},
			language: 'es',	

		
		}).catch( error => {
			console.error( error );
			alert("Error al generar el editor de texto")
		} );
	}*/





	var csrf_links = document.getElementsByClassName('csrf_token_input');
	for(i=0;i<csrf_links.length;i++){
		csrf_links[i].value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	}
	
});

bkLib.onDomLoaded(nicEditors.allTextAreas);
