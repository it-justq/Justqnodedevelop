function goUser(id){
	location.href ='/intranet/administracion/usuarios/usuario/'+id;
}



function paginacion() {

	var current = parseInt(document.getElementById('current-page').innerText);

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

	const link = '/intranet/administracion/usuarios/';

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