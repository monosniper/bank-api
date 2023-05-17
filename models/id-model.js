const {Schema, model} = require('mongoose');

const IdSchema = new Schema({
    photos: [{ type: String }],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = model('Id', IdSchema);