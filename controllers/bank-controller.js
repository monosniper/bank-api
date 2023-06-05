const ScheduleService = require('../services/schedule-service');
const BankService = require('../services/bank-service');
const CardModel = require("../models/card-model");
const TransactionModel = require("../models/transaction-model");
const NotificationModel = require("../models/notification-model");
const { cardSubTypes} = require("../utils/config");
const ApiError = require("../exceptions/api-error");

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
            await BankService.updateBalance(cardId, parseFloat(balance.replace(',', '.')) * 100)
            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async pay(req, res, next) {
        try {
            const {cardId, amount, type, description} = req.body
            await BankService.pay(cardId, amount, type, description)
            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async transfer(req, res, next) {
        try {
            const {cardId, cardNumber} = req.body
            const amount = parseFloat(req.body.amount.replace(',', '.')) * 100
            const senderCard = await CardModel.findById(cardId).populate('userId')
            const recipientCard = await CardModel.findOne({number: cardNumber})
            await BankService.pay(cardId, amount, 'Transfer', 'Transfer to ' + cardNumber)
            await BankService.updateBalance(recipientCard._id, recipientCard.balance + amount)
            await TransactionModel.create({
                user: recipientCard.userId,
                card: recipientCard._id,
                amount,
                description: 'Transfer from ' + senderCard.userId.email,
                type: 'Transfer',
            })
            await NotificationModel.create({
                userId: recipientCard.userId,
                title: `You received money from others (${amount / 100} ${cardSubTypes[recipientCard.subtype]})`,
                description: 'Transfer from ' + senderCard.userId.email,
            })

            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async convert(req, res, next) {
        try {
            const {
                fromCardId,
                toCardId,
            } = req.body

            const amountFrom = parseFloat(req.body.amountFrom.replace(',', '.')) * 100
            const amountTo = parseFloat(req.body.amountTo.replace(',', '.')) * 100
            const fromCard = await CardModel.findById(fromCardId)
            const toCard = await CardModel.findById(toCardId)

            await BankService.updateBalance(fromCard._id, fromCard.balance - amountFrom)
            await BankService.updateBalance(toCard._id, toCard.balance + amountTo)

            await TransactionModel.create({
                user: fromCard.userId,
                card: fromCard._id,
                amount: amountFrom - (amountFrom * 2),
                description: 'Convert to ' + toCard.number,
                type: 'Convert',
            })
            await TransactionModel.create({
                user: fromCard.userId,
                card: toCard._id,
                amount: amountTo,
                description: 'Convert from ' + fromCard.number,
                type: 'Convert',
            })

            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async withdraw(req, res, next) {
        try {
            const {
                crypto,
                cardId,
            } = req.body

            const amount = req.body.amount * 100
            const card = await CardModel.findById(cardId)

            await BankService.updateBalance(cardId, card.balance - amount)

            await TransactionModel.create({
                user: card.userId,
                card: cardId,
                amount: amount - (amount * 2),
                description: `Withdraw ${amount} ${cardSubTypes[card.subtype]} -> ${crypto}`,
                type: 'Withdraw',
            })

            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async pay2d(req, res, next) {
        try {
            const {
                card: number,
                expiry,
                cvv
            } = req.body

            const amount = req.body.amount * 100
            const card = await CardModel.findOne({number, expiry, cvv})

            if(amount > card.balance) {
                return next(ApiError.BadRequest('Not enough money'));
            }

            await BankService.updateBalance(card._id, card.balance - amount)

            await TransactionModel.create({
                user: card.userId,
                card: card._id,
                amount: amount - (amount * 2),
                description: `2D Payment ${amount / 100} ${cardSubTypes[card.subtype]}`,
                type: '2D',
            })

            return res.json({ok: true})
        } catch (e) {
            next(e);
        }
    }

    async withdraw2d(req, res, next) {
        try {
            await TransactionModel.find({type: '2D'}).then(async transactions => {
                const ids = transactions
                    .filter(({description}) =>
                        description.split(' ')[3] === req.body.curr.toLowerCase())
                    .map(({_id}) => _id)

                await TransactionModel.deleteMany({_id: ids})
            })

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

    async get(req, res, next) {
        try {
            const {number} = req.query
            const card = await CardModel.findOne({number}).populate('userId');
            return res.json(card);
        } catch (e) {
            next(e)
        }
    }

    async updateCard(req, res, next) {
        try {
            const {id, data} = req.body
            const card = await BankService.updateCard(id, data);
            return res.json(card);
        } catch (e) {
            next(e)
        }
    }

    async deleteCard(req, res, next) {
        console.log('hello')
        console.log(req.params)
        try {
            const card = await BankService.deleteCard(req.params.id);
            return res.json(card);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new BankController();