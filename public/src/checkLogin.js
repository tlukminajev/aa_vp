exports.isLogin = function(req, res, next) {
    if(req.session != null) {
        if(req.session.userId) {
            console.log('Sisse loginud on kasutaja: ' + req.session.userId);
            next();
        } else {
            console.log('Pole sisse loginud, pole sessioonimuutujat');
            return res.redirect('/signin');
        }
    } else {
        console.log('Sisselogimist pole tuvastatud, sessiooni pole');
        return res.redirect('/signin');
    }
}