const ScheduleModel = require('../models/schedule-model');
require('dotenv').config();
const ScheduleDto = require('../dtos/schedule-dto');

class ScheduleService {
    async registerTask(data) {
        const task = await ScheduleModel.create(data);

        const taskDto = new ScheduleDto(task);

        return {
            task: taskDto
        };
    }
}


module.exports = new ScheduleService();