function modDatos(id, tipoControlId, value, type, lan){
	var parametros = {id, tipoControlId, value, type, lan};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/administracion/controles/tipo-control/'+tipoControlId+'/editar',
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
				activeTick(id, type, lan);
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

function addGrupoControl(){
	document.getElementById("formGrupoControl").style.display = "block";
}

function addPuntoControl(grupoControlId, tipoControlId){
	let puntoControl = document.getElementById("add_pc_es_"+grupoControlId).value;
	let puntoControlEn = document.getElementById("add_pc_en_"+grupoControlId).value;
	var parametros = {grupoControlId, tipoControlId, puntoControl, puntoControlEn};
	var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

	$.ajax({
		data:  parametros,
		url:   '/intranet/administracion/controles/tipo-control/'+tipoControlId+'/grupos-control/'+grupoControlId+'/puntos-control/nuevo',
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

function closeForm() {
	document.getElementById("formGrupoControl").style.display = "none";
}

async function activeTick(id, type, lan){
    document.getElementById('tick-confirm-'+type+"-"+id+"-"+lan).style.display="block";
    
    await sleep(1500);
    
    document.getElementById('tick-confirm-'+type+"-"+id+"-"+lan).style.display="none";
}

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
    } 
