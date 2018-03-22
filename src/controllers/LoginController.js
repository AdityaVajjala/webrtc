const Users = require('../db/UserModel')
const Constants = require('../constants')
const JWT = require('jsonwebtoken')
const Bcrypt = require('bcrypt')
const fs = require('fs')
exports.challange_login = (req, res) => {
    let auth = authenticate(req.body.email_id, req.body.password)
    auth.then(user => {
        generate_token(user, req, res)
    });
    auth.catch(error => {
        res.status(400)
        res.send(error)
    })
}

exports.sign_up = (req, res) => {
    let auth_user = Users.check_for_existing_user(req.body.email_id)
    auth_user.then(user => {
        if (!user) {
            userJson = {
                email_id: req.body.email_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password_salt: req.body.password
            }
            let promise = Users.create(userJson);
            promise.then(user => {
                generate_token(user, req, res)
            })
            promise.catch(error => {
                res.status(500)
                res.send('Internal server error')
            })
        } else {
            var err = {
                status: Constants.user_already_exists,
                message: Constants.user_already_exists_with_email_id
            }
            res.status(409)
            res.send(err)
        }
    })
}

exports.user = (req, res) => {
    res.status(200)
    res.send(req.session.user)
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.status(200);
    res.send({});
}

exports.file_read = (req, res) => {
    fs.readFile('1.jpg', 'utf8', function(err, te) {
        var data = {
            procressId: process.pid,
        }
        console.log(requestCount++);
        res.send(data);
    });
}

const authenticate = (email, password) => {
    return new Promise(function(resolve, reject) {
        Users.check_for_existing_user(email).exec(function(err, user) {
            if (err || !user) {
                var err = new Error(Constants.user_not_found_by_email);
                err.status = Constants.user_not_found;
                return reject(err);
            }
            Bcrypt.compare(password, user.password_salt, function(err, result) {
                if (result === true) {
                    return resolve(user);
                } else {
                    var err = new Error(Constants.password_mismatch_error_message);
                    err.status = Constants.password_mismatch;
                    return reject(err);
                }
            });
        });
    })
}

const generate_token = (user, req, res) => {
    var token = JWT.sign({ id: user._id, sign_in_time: Date.now() }, global.secret, {
        expiresIn: 86400,
    })
    token.auth = true
    req.session.user = user;
    res.status(200)
    res.send({ auth: true, token: token })
}