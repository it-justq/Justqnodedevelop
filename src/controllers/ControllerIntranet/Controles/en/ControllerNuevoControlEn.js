const layout = '../../views/pages/intranet/controles/';
const modules = 'modules/intranet/controles/';

const {getNuevoControl, postNuevoControl} = require(appRoot+'/utils/NuevoControl/UtilNuevoControl');
const {requestedGet, requestedPost} = require(appRoot+'/utils/NuevoControl/UtilRequested');
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'nuevo-control';

module.exports = {

    async getControlNuevoEn(req, res){
        const user = await getUserData(req);
        const cnf = await requestedGet(req);
        const data = await getNuevoControl(cnf);

        res.render(modules+'en/nuevo', {layout: layout+'en/nuevo.hbs', csrfToken: req.csrfToken(), user, data: data.data, status: data.status, nav});
    },

    async postControlNuevoEn(req, res){
        const user = await getUserData(req);
        const cnf = await requestedPost(req);
        const result = await postNuevoControl(cnf);

        if(result.status === true){
            res.redirect('/intranet/control/en/'+result.control_id+'/datos')
        }else{
            res.redirect('/intranet/nuevo/control/en')
        }

    },

};