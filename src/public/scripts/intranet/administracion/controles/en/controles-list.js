function modTipoControl(idTipoControl, nombre, nombre_en){
	document.getElementById("formTipoControl").style.display = "block";
	document.getElementById("tipoControl").value = idTipoControl;
	document.getElementById("tipo_control_es").value = nombre;
	document.getElementById("tipo_control_en").value = nombre_en;
}

function goTipoControl(id){
	location.href ='/intranet/administracion/controles/en/tipo-control/'+id;
}

function closeForm() {
	document.getElementById("formTipoControl").style.display = "none";
}