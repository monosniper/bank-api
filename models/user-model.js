const {Schema, model} = require('mongoose');
const {avatarBase} = require("../utils/config");

const UserSchema = new Schema({
    fullName: {type: String},
    email: {type: String, unique: true, required: true},
    phone: {type: String},
    fio: {type: String},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    isSuperAdmin: {type: Boolean, default: false},
    isIdentified: {type: Boolean, default: false},
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    avatar: {type: Schema.Types.ObjectId, ref: 'Avatar'},
}, {timestamps: true});

module.exports = model('User', UserSchema);