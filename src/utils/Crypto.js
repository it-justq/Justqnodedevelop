const bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = {

    async encriptPassword(VALUE){
        try{
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const password = await bcrypt.hash(VALUE, salt);

            return {status: 'ok', password}
        }catch(error){
            return {status: 'error', code: error}
        }
        
    },

    async genHash(TABLE, VALUE){

        let data = TABLE+'-'+VALUE;

        let hash = crypto.createHash('sha224');
        data = hash.update(data, 'utf-8');
        gen_hash= data.digest('hex');

        return gen_hash;
    }//const {genHash} = require(appRoot+'/utils/Crypto');
}