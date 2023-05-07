const ScheduleService = require("../services/schedule-service");

class ScheduleController {
    async getAll(req, res, next) {
        try {
            const users = await ScheduleService.getAll();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ScheduleController();