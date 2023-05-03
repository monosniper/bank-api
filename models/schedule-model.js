const {Schema, model} = require('mongoose');

const ScheduleSchema = new Schema({
    type: {type: String, required: true},
    data: {type: JSON},
    startAt: {type: Date},
    completed: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('Schedule', ScheduleSchema);
