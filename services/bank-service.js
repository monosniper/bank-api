const TransactionModel = require('../models/transaction-model');
const CardModel = require('../models/card-model');
require('dotenv').config();
const TransactionDto = require('../dtos/transaction-dto');

class BankService {
    async getTransactions(userId, cardId) {
        const filter = {}

        if(userId) filter.user = userId
        if(cardId) filter.card = cardId

        const transactions = await TransactionModel.find(filter).populate('card').populate('user');
        const transactionsDtos = await transactions.map(transaction => new TransactionDto(transaction));

        return transactionsDtos;
    }

    async updateBalance(cardId, balance) {
        return await CardModel.updateOne({_id: cardId}, {balance})
    }

    async getCardHolderName(number) {
        const card = await CardModel.findOne({number}).populate('userId')
        return card.userId.email
    }

    async updateCard(id, data) {
        return CardModel.updateOne({_id: id}, data);
    }

    async deleteCard(_id) {
        return CardModel.deleteOne({_id});
    }

    async pay(cardId, amount, type, description) {
        const card = await CardModel.findById(cardId)

        await TransactionModel.create({
            user: card.userId,
            card: cardId,
            amount: amount - amount * 2,
            description,
            type,
        })

        card.balance = card.balance - amount

        return await card.save()
    }
}


module.exports = new BankService();