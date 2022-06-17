function goFormVariedad(id, nombre){
	document.getElementById("formVariedad").style.display = "block";
	document.getElementById("idVariedad").value = id;
	document.getElementById("variedad_mod").value = nombre;
}

function closeForm() {
	document.getElementById("formVariedad").style.display = "none";
}