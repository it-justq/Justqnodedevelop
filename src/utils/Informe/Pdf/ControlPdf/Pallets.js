const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getPallets(control, idioma){
        
        try{

            let familia, variedad;


            let DATA = await pool.query('SELECT * FROM control_pallet WHERE control_pallet_control_id = ?', [control]);                    
            DATA.fotos = await pool.query('SELECT foto_control_pallet_id, foto_control_pallet_foto_nombre FROM foto_control_pallet WHERE foto_control_pallet_control_id = ?',[control]);

            if(idioma === 'es'){
                familia = await pool.query('SELECT control_producto_familia_id, familia.familia_nombre FROM control, familia WHERE control.control_producto_familia_id = familia.familia_id AND control.control_id = ?', [control]);
            }else if(idioma === 'en'){
                familia = await pool.query('SELECT control_producto_familia_id, familia.familia_nombre_en AS familia_nombre FROM control, familia WHERE control.control_producto_familia_id = familia.familia_id AND control.control_id = ?', [control]);
            }
            variedad = await pool.query('SELECT control_producto_variedad_id, familia_variedad_nombre FROM control, familia_variedad WHERE control_producto_variedad_id = familia_variedad_id AND control_id = ?', [control]);


            for(let i=0; i<DATA.length; i++){
                DATA[i].control_pallet_producto_nombre = familia[0].familia_nombre;
                DATA[i].control_pallet_variedad_nombre = variedad[0].familia_variedad_nombre;
            }

            let mostrar_fotos = false;
            if(DATA.fotos.length > 0){
                mostrar_fotos = true;
            }

            let mostrar = false;
            if(DATA.length > 0){
                mostrar = true;
            }

            let DATA_RETURN = {pallets: DATA, mostrar, mostrar_fotos};

            return {status: 'ok', content: DATA_RETURN};
        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};
