const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Bcrypt = require('bcrypt');

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
    meetings: [{
        type: Schema.Types.ObjectId,
        ref: 'Meetings'
    }],
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
        Bcrypt.hash(user.password_salt, 10, function(err, hash) {
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

user_schema.statics.get_all = function() {
    return this.model('Users').find({ is_active: true })
}
user_schema.statics.get_user_by_id = function(userId) {
    return this.model('Users').findById(userId)
}

user_schema.statics.get_user_by_email = function(emailId) {
    return this.model('Users').findOne({ email_id: emailId, is_active: true })
}
user_schema.statics.check_for_existing_user = function(emailId) {
    return this.model('Users').findOne({ email_id: emailId, is_active: true, is_guest: false })
}

user_schema.methods.get_display_name = () => {
    return _this.first_name + ' ' + _this.last_name;
}


module.exports = Mongoose.model('Users', user_schema);