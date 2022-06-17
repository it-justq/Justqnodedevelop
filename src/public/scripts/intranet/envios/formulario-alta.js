function cambioPaso(ver, ocultar){
	document.getElementById(ocultar).style.display = 'none';
    document.getElementById(ver).style.display = 'block';
}

function cambioTransporte(id){
    if(id==1){
        document.getElementById("datos_terrestre").style.display = 'block';
        document.getElementById("datos_maritimo").style.display = 'none';
        document.getElementById("datos_aereo").style.display = 'none';
    }else if (id==2){
        document.getElementById("datos_terrestre").style.display = 'none';
        document.getElementById("datos_maritimo").style.display = 'block';
        document.getElementById("datos_aereo").style.display = 'none';
    }else{
        document.getElementById("datos_terrestre").style.display = 'none';
        document.getElementById("datos_maritimo").style.display = 'none';
        document.getElementById("datos_aereo").style.display = 'block';
    }
    
}


