const helpers = {};


helpers.submenu = (menu) =>{
    return format(timestamp);
};

helpers.valorNull = (valor) => {
   if(valor === 'null'){
    return "";
   }else{
    return valor;
   }
}
helpers.valorNullGc = (valor) => {
    if(valor === 'null'){
     return "NO NAME";
    }else{
     return valor;
    }
 }

helpers.replacebr = (accion) => {
    if(accion === null || accion === ''){

    return "";

   }else{

    var accion_mod = accion;
    var re = /<br>/g;

    accion_mod = accion_mod.replace(re,'\n');

    return accion_mod;
   }

}

helpers.replacebrEditor = (accion) => {
    if(accion === null || accion === ''){

    return "";

   }else{

    var accion_mod = accion;
    var re = /<br>/g;

    accion_mod = accion_mod.replace(re,'\&nbsp;');

    return accion_mod;
   }

}

helpers.precargaTipoDato = (id) => {
    if(id === 3){
        return true;
    }else{
        return false;
    }
}

helpers.listboxTipoDato = (id) => {
    if(id === 2){
        return true;
    }else{
        return false;
    }
}

helpers.textoTipoDato = (id) => {
    if(id === 1){
        return true;
    }else{
        return false;
    }
}

helpers.controlActivo = (num) => {
    if(num === 1){
        return true;
    }else{
        return false;
    }
}

helpers.esAdmin = (id) => {
    if(id === 1){
        return true;
    }else{
        return false;
    }
}

helpers.esCliente = (id) => {
    if(id === 3){
        return true;
    }else{
        return false;
    }
}

helpers.noCliente = (id) => {
    if(id != 3){
        return true;
    }else{
        return false;
    }
}

helpers.esTerrestre = (id) => {
    if(id == 1){
        return true;
    }else{
        return false;
    }
}

helpers.esMaritimo = (id) => {
    if(id == 2){
        return true;
    }else{
        return false;
    }
}

helpers.esAereo = (id) => {
    if(id == 3){
        return true;
    }else{
        return false;
    }
}

helpers.pdf_value_mostrar = (valor) => {
    if(valor === 'null'){
        return false;
    }else{
        return true;
    }
}

helpers.empty = (objeto) => {
    if(objeto === undefined){
        return false;
    }else{
        return true;
    }

}

helpers.esPrecarga = (id) => {
    if(id === 1){
        return true;
    }else{
        return false;
    }

}

helpers.esLink = (nombre) => {
    if(nombre == 'Link'){
        return true;
    }else{
        return false;
    }

}

helpers.iffcond = (v1, operator, v2, options) =>{
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
}




module.exports = helpers;