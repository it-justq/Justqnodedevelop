const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

const { getUserData } = require(appRoot + '/utils/GetUser');

const nav = 'inicio';

module.exports = {

    getInicio(req, res) {
        const user = getUserData(req);

        if (user.idioma == 2) {

            res.render(modules + 'inicio/en/main', { layout: layout + 'inicio/en/main.hbs', user });
        }
        else {

            res.render(modules + 'inicio/main', { layout: layout + 'inicio/main.hbs', user });
        }

    },

};