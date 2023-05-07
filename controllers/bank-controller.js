const ScheduleService = require('../services/schedule-service');
const BankService = require('../services/bank-service');
const UserService = require("../services/user-service");

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

    async updateBalance(req, res, next) {
        try {
            const {cardId, balance} = req.body
            await BankService.updateBalance(cardId, balance)
            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async pay(req, res, next) {
        try {
            const {cardId, amount, type, description} = req.body
            await BankService.pay(cardId, amount-amount*2, type, description)
            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async getTransactions(req, res, next) {
        try {
            const {userId, cardId} = req.body
            const transactions = await BankService.getTransactions(userId, cardId);
            return res.json(transactions);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new BankController();