const ScheduleService = require('../services/schedule-service');
const BankService = require('../services/bank-service');
const UserService = require("../services/user-service");
const CardModel = require("../models/card-model");
const TransactionModel = require("../models/transaction-model");
const NotificationModel = require("../models/notification-model");
const {Schema} = require("mongoose");
const {cardTypes} = require("../utils/config");

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
                title: `You received money from others (${amount / 100} ${cardTypes[recipientCard.type]})`,
                description: 'Transfer from ' + senderCard.userId.email,
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
}

module.exports = new BankController();