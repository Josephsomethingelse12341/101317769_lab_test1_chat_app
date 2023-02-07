const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createon: {
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('findOneAndUpdate', (next) => {
    console.log("Before findOneAndUpdate")
    let now = Date.now()
    this.createon = now
    console.log(this.createon)
    next()
});
  
  
UserSchema.post('init', (doc) => {
    console.log('%s has been initialized from the db', doc._id);
});
  
UserSchema.post('validate', (doc) => {
    console.log('%s has been validated (but not saved yet)', doc._id);
});
  
UserSchema.post('save', (doc) => {
    console.log('%s has been saved', doc._id);
});
  
UserSchema.post('remove', (doc) => {
    console.log('%s has been removed', doc._id);
});

const User = mongoose.model('User', UserSchema);
module.exports = User;