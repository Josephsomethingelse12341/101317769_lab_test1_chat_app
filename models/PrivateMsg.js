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

PrivateMsgSchema.pre('save', (next) => {
    console.log("Before Save")
    let now = Date.now()
     
    // Set a value for createdAt only if it is null
    if (!this.date_sent) {
      this.date_sent = now
    }
    
    // Call the next function in the pre-save chain
    next()
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

const PrivateMsg = mongoose.model('PrivateMsg', PrivateMsgSchema);
module.exports = PrivateMsg;