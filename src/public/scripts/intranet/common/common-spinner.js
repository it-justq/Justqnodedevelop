function sleep(milliseconds) {  
	return new Promise(resolve => setTimeout(resolve, milliseconds));  
}  

async function spinOn(){
    document.getElementById("page-loader").style.display = 'block';
}

async function spinOff(){
    //await sleep(50);
    document.getElementById("page-loader").style.display = 'none';
}






window.addEventListener("load", spinOff);

