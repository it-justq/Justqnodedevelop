const layout = '../../views/pages/intranet/periciales/';
const modules = 'modules/intranet/periciales/';

const {getNuevoPericial, postNuevoPericial} = require(appRoot+'/utils/NuevoPericial/UtilNuevoPericial');
const {requestedGet, requestedPost} = require(appRoot+'/utils/NuevoPericial/UtilRequested');
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'nuevo-pericial';

module.exports = {

    async getPericialNuevo(req, res){
        const user = await getUserData(req);
        const cnf = await requestedGet(req);
        const data = await getNuevoPericial(cnf);
        console.log(data)

        res.render(modules+'nuevo', {layout: layout+'nuevo.hbs', csrfToken: req.csrfToken(), data: data.data, user, nav});
    },

    async postPericialNuevo(req, res){
        const user = await getUserData(req);
        const cnf = await requestedPost(req);
        const result = await postNuevoPericial(cnf);


        if(result.status === true){
            res.redirect('/intranet/pericial/'+result.informe_id)
        }else{
            res.redirect('/intranet/nuevo/pericial')
        }

    },

};