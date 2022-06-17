function goFormPlataforma(id, nombre){
	document.getElementById("formPlataforma").style.display = "block";
	document.getElementById("idPlataforma").value = id;
	document.getElementById("plataforma_mod").value = nombre;
}

function closeForm() {
	document.getElementById("formPlataforma").style.display = "none";
  }
