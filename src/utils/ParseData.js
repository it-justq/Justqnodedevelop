//VALUE.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
//const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async escapeData(VALUE){
        try{
            let parse = VALUE.toString();
            return parse.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        }catch(error){
            return VALUE;
        }
    },
    
    async escapeDataSlashes(VALUE){
        try{
            let parse = VALUE.toString();
            return parse.replace(/<>/gi, '');
        }catch(error){
            return VALUE;
        }
    },

    async escapeDataAcciones(VALUE){
        try{
            let parse = VALUE.toString();
            return parse.replace(/(\r\n|\n|\r)/gm, "");
            return parse.replace('text-indent', "prueba");
        }catch(error){
            return VALUE;
        }

    },

    async escapeDataSearchControles(VALUE){
        try{
            let parse = VALUE.toString();
            return parse.replace(/[`~!@#$%^&*()|+\=?;:_'"<>\{\}\[\]\\\/]/gi, ''); // -
        }catch(error){
            return VALUE;
        }
    },

    async escapeDataSlashesDot(VALUE){
        try{
            let parse = VALUE.toString();
            return parse.replace(/[`~!@#$^&*()|+\=?;:'"<>\{\}\[\]\\\/]/gi, ''); // . , _ -
        }catch(error){
            return VALUE;
        }
    },
}