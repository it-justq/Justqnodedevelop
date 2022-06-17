const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {escapeData} = require(appRoot+'/utils/ParseData');

const {GenControl} = require(appRoot+'/utils/Plantilla/GenControl');
const {GenDatos} = require(appRoot+'/utils/Plantilla/GenDatos');
const {GenGc} = require(appRoot+'/utils/Plantilla/GenGc');
const {GenPrecarga} = require(appRoot+'/utils/Plantilla/GenPrecarga');
const {GenAcciones} = require(appRoot+'/utils/Plantilla/GenAcciones');
const {GenPesos} = require(appRoot+'/utils/Plantilla/GenPesos');
const {GenPallets} = require(appRoot+'/utils/Plantilla/GenPallets');
const {GenCajas} = require(appRoot+'/utils/Plantilla/GenCajas');
const {GenDocumentacion} = require(appRoot+'/utils/Plantilla/GenDocumentacion');
const {GenFotos} = require(appRoot+'/utils/Plantilla/GenFotos');


module.exports = {

    async getPlantillasList(pagina){

        try{

            if(pagina > 1){
                inicio_pagina = (pagina - 1) * 15;
            }else{
                    inicio_pagina = 0;
            }

            let plantillas = await pool.query('SELECT plantilla_id_hash as plantilla_id, plantilla_usuario_id, plantilla_cliente_id, plantilla_control_id, plantilla_tipo, plantilla_nombre FROM plantilla ORDER BY plantilla_fecha_alta DESC LIMIT 15 OFFSET ?', [inicio_pagina]);
            let plantillas_total = await pool.query('SELECT count(*) as total FROM plantilla');
            
            for(let i=0; i<plantillas.length; i++){

                let cliente = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [plantillas[i].plantilla_cliente_id]);
                let tecnico = await pool.query('SELECT usuario_nombre FROM usuario WHERE usuario_id = ?', [plantillas[i].plantilla_usuario_id]);

                plantillas[i].plantilla_cliente_nombre = cliente[0].cliente_nombre;
                plantillas[i].plantilla_usuario_nombre = tecnico[0].usuario_nombre;

                if(plantillas[i].plantilla_tipo === 1){
                    plantillas[i].plantilla_tipo_nombre = 'Relativa';
                }else if(plantillas[i].plantilla_tipo === 2){
                    plantillas[i].plantilla_tipo_nombre = 'Absoluta';
                }
                
            }

            plantillas.total = plantillas_total[0].total;

            plantillas.status = 'ok';
            return plantillas;

        }catch(error){
            return {status: 'error', code: 'Error al obtener las plantillas'};
        }
    },

    async postNuevoControlPlantillaData(hash, id){

        try{

            let error_gen = false;
            let control_id_hash;

            let plantilla_hash = await escapeData(hash);
            
            let user_id = parseInt(id);

            let plantilla = await pool.query('SELECT * FROM plantilla WHERE plantilla_id_hash = ?', [plantilla_hash]);
            
            if(plantilla.length != 0){
                plantilla = plantilla[0];

                let tipo = await pool.query("SELECT control_tipo_id FROM control WHERE control_id = ?", [plantilla.plantilla_control_id]);
                tipo = parseInt(tipo[0].control_tipo_id);
                

                let resultGenControl = await GenControl(tipo);
                if(resultGenControl.status === 'ok'){

                    let resultGenDatos = await GenDatos(resultGenControl.control_codigo, parseInt(plantilla.plantilla_control_id),  parseInt(plantilla.plantilla_datos), user_id);
                    control_id_hash = resultGenDatos.hash;
                    if(resultGenDatos.status === 'ok'){

                        let control_id = resultGenDatos.control_id;
                        
                        if(tipo === 1){
                            let resultGenPrecarga = await GenPrecarga(plantilla.plantilla_control_id, control_id, parseInt(plantilla.plantilla_precarga));
                        }
                        
                        let resultGenGc = await GenGc(plantilla.plantilla_control_id, control_id, parseInt(plantilla.plantilla_gc));

                        if(parseInt(plantilla.plantilla_acciones) === 1){
                            let resultGenAcciones = await GenAcciones(plantilla.plantilla_control_id, control_id);
                        }
                        if(parseInt(plantilla.plantilla_pesos) === 1){
                            let resultGenPesos = await GenPesos(plantilla.plantilla_control_id, control_id);
                        }
                        if(parseInt(plantilla.plantilla_pallets) === 1){
                            let resultGenPallets = await GenPallets(plantilla.plantilla_control_id, control_id);
                        }
                        if(parseInt(plantilla.plantilla_cajas) === 1){
                            let resultGenCajas = await GenCajas(plantilla.plantilla_control_id, control_id);
                        }
                        if(parseInt(plantilla.plantilla_documentacion) === 1){
                            let resultGenDocumentacion = await GenDocumentacion(plantilla.plantilla_control_id, control_id);
                        }
                        if(parseInt(plantilla.plantilla_fotos) === 1){
                            let resultGenFotos = await GenFotos(plantilla.plantilla_control_id, control_id);
                        }
                        
                    }else{

                    }

                }else{

                }
            }

            return {status: 'ok', hash: control_id_hash};
        }catch(error){
            console.log(error)
            return {status: 'error', code: 'Error al crear el control'};
        }
    }

};