const ScheduleService = require('../services/schedule-service');

class BankController {
    async orderCard(req, res, next) {
        try {
            const task = await ScheduleService.registerTask({
                type: 'registerCard',
                data: req.body,
                startAt: new Date(new Date() + 1 * 60000)
            });

            return res.json(task);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BankController();