const Users = require('../db/UserModel')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, global.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if (!req.session.user) {
            var promise = Users.findById(decoded.id);
            promise.then(user => {
                req.session.user = user;
                next();
            });
            promise.catch(err => {
                res.send('Unable to Authorize');
            });
        } else {
            next();
        }

    });
};