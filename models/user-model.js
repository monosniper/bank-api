const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    phone: {type: String},
    fio: {type: String},
    password: {type: String, required: true},
}, {timestamps: true});

module.exports = model('User', UserSchema);
