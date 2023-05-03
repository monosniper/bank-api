const {Schema, model} = require('mongoose');

const NotificationSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String},
    description: {type: String},
    read: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('Notification', NotificationSchema);
