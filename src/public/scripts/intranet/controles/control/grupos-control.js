function uploadDatos(id, controlId, value, type, subtype){

	var parametros = {id, controlId, value, type, subtype};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/control/'+controlId+'/grupos-control/mod',
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
				activeTick(id, subtype);
			}else{
				console.log(response);
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


function addPc(id, controlId){

	var parametros = {id, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/control/'+controlId+'/grupos-control/add/pc/'+id,
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
				console.log(response);
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

function uploadDatosAdded(id, controlId, value, type, subtype){

	var parametros = {id, controlId, value, type, subtype};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/control/'+controlId+'/grupos-control-added/mod/'+id,
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
				activeTick(id, subtype);
			}else{
				console.log(response);
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

function delPcAdded(id, controlId){

	var parametros = {id, controlId};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/control/'+controlId+'/grupos-control-added/delete/pc/'+id,
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
				console.log(response);
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


function sleep(milliseconds) {  
return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function activeTick(id, subtype){
document.getElementById('tick-confirm-'+subtype+"-"+id).style.display="block";

await sleep(1500);

document.getElementById('tick-confirm-'+subtype+"-"+id).style.display="none";
}