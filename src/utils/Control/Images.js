const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const sharp = require('sharp');
const fs = require('fs');
const {genHash} = require(appRoot+'/utils/Crypto');


module.exports = {

    async UpImages(PARAMS){

        const images = PARAMS.data;
        const control_id = PARAMS.control_id;
        const control_codigo = PARAMS.control_codigo;
        const type = PARAMS.type;

        let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM '+type+' WHERE '+type+'_control_id = ?', [control_id]);
        
        if(contador_num_img[0].contador_num_img === null){
            contador_num_img = 0;
        }else{
            contador_num_img = contador_num_img[0].contador_num_img;
        }


        if(images.length != undefined){
            return await UPLOAD_MULTIPLE();
        }else{
            return await UPLOAD_SINGLE();
        }




        function IMAGE_NAME(CONTROL, TYPE, ID, ORDER){             
            switch(TYPE){
                case 'foto_control':
                    return CONTROL+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_documentacion':
                    return CONTROL+'-DOC-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_caja':
                    return CONTROL+'-CAJA-'+ID+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_pallet':
                    return CONTROL+'-PALLET-'+ID+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_peso':
                    return CONTROL+'-PESO-'+ID+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_accion':
                    return CONTROL+'-ACCION-'+ID+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_punto_control':
                    return CONTROL+'-PESO-'+ID+'-'+ORDER+ ".jpeg";
                break;
                case 'foto_control_punto_control_añadido':
                    return CONTROL+'-PESO-'+ID+'-'+ORDER+ ".jpeg";
                break;
            }
        }


        async function UPLOAD_SINGLE(){

            let nombre_cont = contador_num_img + 1;
            let nombre_img = control_codigo + "-"+ nombre_cont + ".jpeg"; 

            

        }

                
        async function UPLOAD_MULTIPLE(){

            for (i=0; i<images.length; i++) {

                let nombre_cont = contador_num_img + i;
                let nombre_img = IMAGE_NAME()

            }


        }


    },

    async DelImages(){

    },


};
