

exports.getToken = (req, res) => {
    console.log("dentro de funcion");
    let url =`https://traxx.anserlog.com/api/v1/login`;
    let datos = {
        user: "Justq.integracion",
        pass: "4836638478984"
      };
    
    const api = new XMLHttpRequest;
    api.open('POST', url, true);
    api.setRequestHeader('Content-type', 'application/json')
    api.send(JSON.stringify(datos));

    api.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            let message = JSON.parse(this.responseText);
            let token = message.Message;
            console.log(token);
            
            
          
        }
        else{
            
        }
        
    }
    res.render('modules/api/main', {layout: layout_es});
}

