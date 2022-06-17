function showControlData(route){
	//document.getElementById("page-loader").style.display = 'block';
	//window.location.href = route;
	window.open(route, '_blank');
}

function showControlDataV2(control){
	//document.getElementById("page-loader").style.display = 'block';
	//window.location.href = 'https://extranet.justq.eu/pages/informeV2.php?numControl='+control;
	window.open('https://extranet.justq.eu/pages/informeV2.php?numControl='+control, '_blank');
}

function paginacion() {

	var current = parseInt(document.getElementById('current-page').innerText);
	var type = document.getElementById("type").innerText;
	var link = '';
	document.getElementById('next-page').href = current + 1;
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

	if(type == "total"){
		link = '/intranet/controles/en';
	}else if (type == "total-cliente"){
		alert("cliente");
		link = '/clientes/controles/en';
	}else if (type == "finalizados"){
		link = '/intranet/controles/en/finalizados';
	}
	
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