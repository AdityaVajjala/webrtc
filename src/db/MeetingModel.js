const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let meeting_schema = new Schema({
    meeting_name: {
        type: String,
        required: 'Meeting name is required'
    },
    meeting_description: {
        type: String,
        required: 'Meeting description is required'
    },
    start_time: {
        type: Date,
        required: 'Meeting Start Time is required'
    },
    end_time: {
        type: String,
        required: 'Meeting end time is required'
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
    modified_at: {
        type: Date
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'MeetingParticipants'
    }]
})

meeting_schema.pre('save', function(next) {
    var meeting = this;
    if (meeting.modified_by) {
        meeting.modified_at = Date.now();
    }
    next();
});

meeting_schema.post('save', function(err, meeting) {
    if (!err) {
        let promise = Mongoose.model('Users').findById(meeting.created_by)
        promise.then((user) => {
            user.meetings.push(meeting)
            user.save
        })
    }

})

meeting_schema.statics.get_all = function() {
    return this.model('Meetings').find({ is_active: true })
}

meeting_schema.statics.get_meeting_by_id = function(meeting_id) {
    return this.model('Meetings').findById(meeting_id)
}
meeting_schema.statics.get_meetings_for_user = function(user_id) {
    return this.model('Meetings').findOne({ created_by: user_id, is_active: true })
}

module.exports = Mongoose.model('Meetings', meeting_schema);