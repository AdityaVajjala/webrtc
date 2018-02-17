const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let meeting_roles = new Schema({
    role_name: {
        type: String,
        required: 'Role name is required.'
    }
})

module.exports = Mongoose.model('Meeting_Roles', meeting_roles);