const {Schema, model} = require('mongoose');
const {avatarBase} = require("../utils/config");

const AvatarSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    base64: {type: String, default: avatarBase}
}, {timestamps: true});

module.exports = model('Avatar', AvatarSchema);