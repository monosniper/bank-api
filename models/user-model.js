const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    phone: {type: String},
    fio: {type: String},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
}, {timestamps: true});

module.exports = model('User', UserSchema);
