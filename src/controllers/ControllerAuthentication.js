const passport = require('passport');
//const dateFormat = require('dateformat');
const fs = require('fs');

var logger = fs.createWriteStream('../logs/server.log', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

module.exports = {

	getLogin(req, res){
		res.render(modules+'/Authentication/login', {layout: layout+'Authentication/login.hbs', csrfToken: req.csrfToken()});
	},

	postLogin(req, res, next){
		let indexpage = '/intranet';

		if(req.session.returnTo){
			indexpage = req.session.returnTo;
			delete req.session.returnTo;
		}

	    passport.authenticate('local.signin', {
	        successRedirect: indexpage,
	        failureRedirect: '/intranet/login'
	    })(req, res, next);

	    const date = new Date();
	    logger.write(date+' -->POST /login (IP:'+req.headers['x-forwarded-for']+')<-- \n');
	},

	getLogout(req, res){
	    req.logout();

	    req.session.destroy(function (err) {
	        if (!err) {
	        	res.clearCookie("connect.sid");
	            res.redirect('/');
	        } else {
	            console.log(err);
	        }

	    });
	}

};