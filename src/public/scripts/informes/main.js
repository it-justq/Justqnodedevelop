window.onload = function() {
    let links = document.getElementsByClassName("tablinks");
    links[0].click();
}

function openTab(evt, tab) {

	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("content");

	for (i = 0; i < tabcontent.length; i++) {
	   	tabcontent[i].style.display = "none";	
	}
	
	tablinks = document.getElementsByClassName("tablinks");
	
	for (i = 0; i < tablinks.length; i++) {
    	tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById('tab-'+tab).style.display = "block";
	evt.currentTarget.className += " active";
}
