const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Constants = require('../constants');

let meeting_participants = new Schema({
    meeting_id: {
        type: Schema.Types.ObjectId,
        ref: 'Meetings',
        required: 'Meeting Id is required'
    },
    user_id: {
        type: String,
        required: 'User Id is required'
    },
    role_id: {
        type: String,
        required: 'Role Id is required'
    },
    display_name: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: String,
        required: 'Creator is required for meeting'
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    modified_by: {
        type: String,
    },
    modified_at: {
        type: Date
    }
})

meeting_participants.pre('save', function(next) {
    let _this = this
    if (_this.display_name) {
        next();
    } else {
        let promise = Mongoose.model('Users').find_by_id(_this.user_id);
        promise.then((user) => {
            _this.display_name = user.get_display_name();
            next();
        })
    }
});