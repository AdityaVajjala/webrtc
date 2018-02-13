var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express()
var routes = require('./src/router.js')
var config = require('./config')

var port = process.env.PORT || 8888

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));
const conn = process.env.db_connection_string || config.db_connection_string
global.Promise = require('bluebird')
mongoose.Promise = global.Promise
mongoose.connect(conn)

global.secret = config.secert
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.listen(port)

routes(app)