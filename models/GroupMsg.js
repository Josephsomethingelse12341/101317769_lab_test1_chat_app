const mongoose = require('mongoose');

const GroupMsgSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    from_user: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date_sent: {
        type: Date,
        default: Date.now
    },
});