function parse(data){
    const chars = ['a','b','c','d','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0','.','-',' '];

    for (var i = 0; i < data.length; i++) {
        let char = data.charAt(i);
        char.toLowerCase();
        if(chars.includes(char)){
            return true;
        }else{
            return false
        }
    }
}

function data_form(data){

    const msg_error = document.getElementById('msg-error-login');


    if(data.endsWith(" ") || data.startsWith(" ")){
        msg_error.style.display = 'block';
        msg_error.innerHTML = "ERROR<br><br>No puede haber espacios al principo o al final de los datos.";
        return false;
    }else if(data.length > 50){
        msg_error.style.display = 'block';
        msg_error.innerHTML = "ERROR<br><br>Límite de caracteres excedido.";
        return false;
    }else{
        if(parse(data)){
            msg_error.style.display = 'none';
            msg_error.innerHTML = ""; 
            return true;
        }else{
            msg_error.style.display = 'block';
            msg_error.innerHTML = "ERROR<br><br>Usuario o contraseña incorrectos."; 
            return false;
        }
    }
}



function makeLogin(){
    
    const l_u = document.getElementById('l_u').value;
    const l_p = document.getElementById('l_p').value;

    const form = document.getElementById('form-login');
    form.preventDefault();


    if(data_form(l_u) && data_form(l_p)){

        form.submit();

    }

}
