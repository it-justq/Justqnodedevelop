const pool = require('../../../Conexion/UtilDatabase_jq');
const {escapeDataSearchControles, escapeDataSlashesDot, escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getPericialesSearchList(PARAMS){

        try{
            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let pagina = PARAMS.pagina;

            let informes;
            let return_informes = [];


            let informe = '';
            let sref = '';
            let nref = '';
            let fecha = '';
            let inicio = '';
            let fin = '';
            let estado = '';
            let tecnico = '';
            let cliente = '';
            let empresa = '';

            let no_PARAMS = false;

            if(rol_id === 1){
 
            }else if(rol_id === 2){
                PARAMS.data.tecnico = '';
            }else if(rol_id === 3){
                PARAMS.data.cliente = '';
                PARAMS.data.empresa = '';
                PARAMS.data.tecnico = '';
                PARAMS.data.estado = '';
            }
            

            if(PARAMS.data.informe != '' || PARAMS.data.sref != '' || PARAMS.data.nref != '' || PARAMS.data.fecha != '' || PARAMS.data.inicio != '' || PARAMS.data.fin != '' || PARAMS.data.estado != '' || PARAMS.data.tecnico != '' || PARAMS.data.cliente != '' || PARAMS.data.empresa != ''){
                if(PARAMS.data.informe != ''){
                    let informeParse = await escapeDataSearchControles(PARAMS.data.informe);
                    informe = " informe_codigo LIKE '%"+informeParse+"%' AND ";
                }
                if(PARAMS.data.sref != ''){
                    let srefParse = await escapeDataSearchControles(PARAMS.data.sref);
                    sref = " informe_sref LIKE '%"+srefParse+"%' AND ";
                }
                if(PARAMS.data.nref != ''){
                    let nrefParse = await escapeDataSearchControles(PARAMS.data.nref);
                    nref = " informe_nref LIKE '%"+nrefParse+"%' AND ";
                }
                if(PARAMS.data.fecha != ''){
                    let fechaParse = await escapeDataSearchControles(PARAMS.data.fecha);
                    fecha = "  informe_fecha = '"+fechaParse+"' AND ";
                }
                if(PARAMS.data.inicio != ''){
                    let inicioParse = await escapeDataSearchControles(PARAMS.data.inicio);
                    inicio = " informe_fecha >= '"+inicioParse+"' AND ";
                }
                if(PARAMS.data.fin != ''){
                    let finParse = await escapeDataSearchControles(PARAMS.data.fin);
                    fin = " informe_fecha <= '"+finParse+"' AND ";
                }
                if(PARAMS.data.estado != ''){
                    let estadoParse = await escapeData(PARAMS.data.estado);
                    estado = " informe_estado = "+estadoParse+" AND ";
                }
                if(PARAMS.data.tecnico != ''){
                    let tecnicoParse = await escapeData(PARAMS.data.tecnico);
                    let tecnico_id = await pool.query('SELECT usuario_id FROM usuario WHERE usuario_id_hash = ?',[tecnicoParse]);
                    tecnico = " informe_tecnico_id = "+tecnico_id[0].usuario_id+" AND ";
                }
                if(PARAMS.data.cliente != ''){
                    let clienteParse = await escapeData(PARAMS.data.cliente);
                    let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_id_hash = ?',[clienteParse]);
                    cliente = " informe_cliente_id = "+cliente_id[0].cliente_id+" AND ";
                }
                if(PARAMS.data.empresa != ''){
                    let empresaParse = await escapeDataSlashesDot(PARAMS.data.empresa);
                    empresa = " informe_empresa LIKE '%"+empresaParse+"%' AND ";
                }

            }else{
                no_PARAMS = true;
            }


            if(rol_id === 1  && no_PARAMS === false){
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE '+informe+sref+nref+fecha+inicio+fin+estado+tecnico+cliente+empresa+' informe_borrado = 0 ORDER BY informe_fecha');
            }else if(rol_id === 2  && no_PARAMS === false){
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE '+informe+sref+nref+fecha+inicio+fin+estado+cliente+empresa+' informe_tecnico_id = ? ORDER BY informe_fecha', [usuario_id]);
            }else if(rol_id === 3  && no_PARAMS === false){
                let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [usuario_id]);
                cliente_id = cliente_id[0].cliente_id;
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE '+informe+sref+nref+fecha+inicio+fin+estado+' informe_estado = 1 AND informe_cliente_id = ? ORDER BY informe_fecha', [cliente_id]);
             }else{
                informes = [];
            }


            let total_informes = informes.length;

            if(total_informes != 0){
                for(let i = 0; i < informes.length; i ++){

                    switch(informes[i].informe_estado){
                        case 0:
                            informes[i].informe_estado_nombre = "No activo";
                            break;
                        case 1:
                            informes[i].informe_estado_nombre = "Activo";
                            break;
                    }

                    if(informes[i].informe_empresa === 'null' || informes[i].informe_empresa === null){
                        let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [informes[i].informe_cliente_id]);
                        informes[i].informe_cliente_nombre = cliente_nombre[0].cliente_nombre;
                    }else{
                        informes[i].informe_cliente_nombre = informes[i].informe_empresa;
                    }

                }

                return_informes.informes = informes;
                return_informes.status = true;
            }else{
                return_informes.status = false;

            }

            return return_informes;
        
        }catch(error){
            console.log(error)
            return {status:'error', code: 'Error al obtener los controles'};
        }

    }

};