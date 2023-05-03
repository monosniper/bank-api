const {Schema, model} = require('mongoose');

const TransactionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    type: {type: String, required: true},
    status: {type: String, default: 'pending'},
}, {timestamps: true});

module.exports = model('Transaction', TransactionSchema);