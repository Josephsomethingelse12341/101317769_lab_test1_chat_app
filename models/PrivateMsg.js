const mongoose = require('mongoose');

const PrivateMsgSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    from_user: {
        type: String,
        required: true
    },
    to_user: {
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