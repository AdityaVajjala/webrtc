const Login = require('./controllers/LoginController')
const Auth = require('./Middleware/Authentication')

module.exports = (app, jsonDecoder) => {

    app.route('/login')
        .post(Login.challange_login)

    app.route('/signup')
        .post(Login.sign_up)

    app.route('/user')
        .get(Auth, Login.user)

    app.route('/logout')
        .get(Auth, Login.logout)

    app.route('/file')
        .get(Login.file_read)
}