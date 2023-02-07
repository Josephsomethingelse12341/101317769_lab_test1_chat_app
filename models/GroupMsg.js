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

PrivateMsgSchema.pre('findOneAndUpdate', (next) => {
    console.log("Before findOneAndUpdate")
    let now = Date.now()
    this.date_sent = now
    console.log(this.date_sent)
    next()
});
  
  
PrivateMsgSchema.post('init', (doc) => {
    console.log('%s has been initialized from the db', doc._id);
});
  
PrivateMsgSchema.post('validate', (doc) => {
    console.log('%s has been validated (but not saved yet)', doc._id);
});
  
PrivateMsgSchema.post('save', (doc) => {
    console.log('%s has been saved', doc._id);
});
  
PrivateMsgSchema.post('remove', (doc) => {
    console.log('%s has been removed', doc._id);
});

const GroupMsg = mongoose.model('GroupMsg', GroupMsgSchema);
module.exports = GroupMsg;