const {Schema, model} = require('mongoose');

const TransactionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    card: {type: Schema.Types.ObjectId, ref: 'Card'},
    amount: {type: Number, required: true},
    type: {type: String, required: true},
    description: {type: String},
    status: {type: String, default: 'Success'},
}, {timestamps: true});

module.exports = model('Transaction', TransactionSchema);