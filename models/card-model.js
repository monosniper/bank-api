const {Schema, model} = require('mongoose');
const {cardSubTypes, cardTypes} = require("../utils/config");

const CardSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum : Object.keys(cardTypes),
        required: true
    },
    subtype: {
        type: String,
        enum : Object.keys(cardSubTypes),
        required: true
    },
    balance: {type: Number, default: 0},
    number: {type: String},
    expiry: {type: String},
    cvv: {type: String},
}, {timestamps: true});

module.exports = model('Card', CardSchema);