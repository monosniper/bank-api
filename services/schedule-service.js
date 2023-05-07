const ScheduleModel = require('../models/schedule-model');
require('dotenv').config();
const ScheduleDto = require('../dtos/schedule-dto');
const UserModel = require("../models/user-model");
const UserDto = require("../dtos/user-dto");

class ScheduleService {
    async registerTask(data) {
        const task = await ScheduleModel.create(data);

        const taskDto = new ScheduleDto(task);

        return {
            task: taskDto
        };
    }

    async getAll() {
        const schedules = await ScheduleModel.find({completed: false});
        const schedulesDtos = await schedules.map(schedule => new ScheduleDto(schedule));

        return schedulesDtos;
    }
}


module.exports = new ScheduleService();