const {Schema, model} = require('mongoose');

const CardSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum : [
            'visa',
            'mastercard',
            'mir',
        ],
        required: true
    },
    subtype: {
        type: String,
        enum : [
            'visa_classic',
            'visa_gold',
            'visa_platinum',
            'mastercard',
            'mir_standard',
            'mir_plus',
        ],
        required: true
    },
    balance: {type: Number, default: 0},
    number: {type: String},
    expiry: {type: String},
}, {timestamps: true});

module.exports = model('Card', CardSchema);