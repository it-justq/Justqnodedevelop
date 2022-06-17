const layout = '../../views/pages/intranet/controles/';
const modules = 'modules/intranet/controles/';

const {getNuevoControl, postNuevoControl} = require(appRoot+'/utils/NuevoControl/UtilNuevoControl');
const {requestedGet, requestedPost} = require(appRoot+'/utils/NuevoControl/UtilRequested');
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'nuevo-control';

module.exports = {

    async getControlNuevo(req, res){
        const user = await getUserData(req);
        const cnf = await requestedGet(req);
        const data = await getNuevoControl(cnf);

        res.render(modules+'nuevo', {layout: layout+'nuevo.hbs', csrfToken: req.csrfToken(), user, data: data.data, status: data.status, nav});
    },

    async postControlNuevo(req, res){
        const user = await getUserData(req);
        const cnf = await requestedPost(req);
        const result = await postNuevoControl(cnf);

        if(result.status === true){
            res.redirect('/intranet/control/'+result.control_id+'/datos')
        }else{
            res.redirect('/intranet/nuevo/control')
        }

    },

};