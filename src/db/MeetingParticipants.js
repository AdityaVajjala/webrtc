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
        type: Schema.Types.ObjectId,
        ref: 'Users'
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
        type: Schema.Types.ObjectId,
        ref: 'Users'
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

meeting_participants.post('save', function(err, participant) {
    if (!err) {
        let meeting_promise = Mongoose.model['Meetings'].find_by_id(participant.meeting_id)
        meeting_participants.then(function(meeting) {
            meeting.participants.push(participant);
            let user_promise = Mongoose.model['Users'].find_by_id(participant.user_id);
            user_promise.then(function(user) {
                user.meetings.push(meeting);
            })
        })
    }
})


module.exports = Mongoose.model('MeetingParticipants', meeting_participants);