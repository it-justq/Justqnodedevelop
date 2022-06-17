const {Translate} = require('@google-cloud/translate').v2;

module.exports = {

    async translateText(VALUE, from, to){
        const key = process.env.API_TRANSLATE;
        const translate = new Translate({key});

        const target = to;
        
        try{
            const [translation] = await translate.translate(VALUE, target);
            return translation;
        }catch(error){
            return VALUE;
        }

        
        
    },
    //const {translateText} = require(appRoot+'/utils/Traductor');
    //await translateText('HOLA','es','en')
   
};