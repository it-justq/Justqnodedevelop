const {idControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async requested(req){

        let control_id = await escapeData(req.params.controlId); 
        control_id = await idControl(control_id);

        let requested = {
            control: control_id,
            control_hash: await escapeData(req.params.controlId),
            idioma: await escapeData(req.params.idioma),
        };

        return requested;
    },



};
