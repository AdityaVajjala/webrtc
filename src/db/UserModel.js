const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const constants = require('../constants')

let user_schema = new Schema({
    first_name: {
        type: String,
        required: 'firstname required'
    },
    last_name: {
        type: String,
        required: 'last name required'
    },
    email_id: {
        type: String,
        required: 'email required'
    },
    password_salt: {
        type: String
    },
    is_guest: {
        type: Boolean,
        required: '',
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    modified_at: {
        type: Date,
        default: Date.now()
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

user_schema.pre('save', function(next) {
    var user = this;
    if (user.password_salt) {
        bcrypt.hash(user.password_salt, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password_salt = hash;
            next();
        });
    } else {
        user.is_guest = true
        next();
    }

});

user_schema.statics.GetAll = function() {
    return this.model('Users').find({ is_active: true })
}
user_schema.statics.GetUserById = function(userId) {
    return this.model('Users').findById(userId)
}

user_schema.statics.GetUserByEmail = function(emailId) {
    return this.model('Users').findOne({ email_id: emailId, is_active: true })
}
user_schema.statics.checkForExistingUser = function(emailId) {
    return this.model('Users').findOne({ email_id: emailId, is_active: true, is_guest: false })
}

module.exports = mongoose.model('Users', user_schema);