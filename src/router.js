const auth = require('./Middleware/Authentication')

module.exports = (app, jsonDecoder) => {
    const login = require('./controllers/LoginController')
    const auth = require('./Middleware/Authentication')

    app.route('/login')
        .post(login.challange_login)

    app.route('/signup')
        .post(login.sign_up)

    app.route('/username')
        .get(auth, login.user_name)
}