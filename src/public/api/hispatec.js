




/*document.addEventListener("DOMContentLoaded", () => {  
    document.querySelector('#boton')  
      .addEventListener('click', function() {  
        obtenerToken();
      })  
  });



  

function obtenerToken(){
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
            
            //window.open("https://traxx.anserlog.com/info?NumeroDC=3200496739");
            
            //window.onload = function(){
              //localStorage.setItem('Token', token);
            //}
          
          document.getElementById('iframe').contentWindow.addEventListener("message", (event) => {
            console.log(event);
            localStorage.setItem(event.data.key, event.data.value);
          });
          
          
          //document.getElementById('iframe').contentWindow.postMessage({key: "Token", value: token}, "https://traxx.anserlog.com");
          //document.getElementById('iframe').contentWindow.addEventListener("message", (event) => {
          //document.getElementById("iframe").src= "https://traxx.anserlog.com/info?NumeroDC=3200496739";
            //window.localStorage.setItem(event.data.key, event.data.value);
          //}, false);

            
            
          
          
        //}
        
window.open("https://pruebas/api/hispatec/prueba");  // }

}*/



function obtenerToken(container){
  
  let url =`https://mojito-pro-api.azurewebsites.net/api/shipment/sharenew`;
  let datos = {
      ContainerRef: container,
	    CanUpload: true,
      CanDelete: true
    };
  
  const api = new XMLHttpRequest;
  api.open('POST', url, true);
  api.setRequestHeader('Content-type', 'application/json');
  api.setRequestHeader("Authorization", "Basic " + btoa("ITJustQuality:YKMQq8#k"));
  api.send(JSON.stringify(datos));

  api.onreadystatechange = function(){
      if(this.status == 200 && this.readyState == 4){
          let message = JSON.parse(this.responseText);
          let url = message.url;
          return url;
          
          
      }
      else{
          
      }
  }
}