const dayjs = require ('dayjs');

module.exports = {

    getDate(){

        const DATE = new Date();

        let y = DATE.getFullYear().toString();
        let m = (DATE.getMonth() + 1).toString();
        let d = DATE.getDate().toString();

        if(d.length === 1){
            d = '0'+d;
        }
        if(m.length === 1){
            m = '0'+m;
        }

        const date = y+"-"+m+"-"+d;

        return date;
        
    },

    redateSqls(date){
        try{
            let dd = String(date.getDate()).padStart(2, '0');
            let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = date.getFullYear();

            let fecha_format = yyyy + '-' + mm + '-' + dd;
    
            return fecha_format;
        }catch(e){
            console.log(e)
            return date;
        }
        
    }

};