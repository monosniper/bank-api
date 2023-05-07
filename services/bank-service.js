const UserModel = require('../models/user-model');
const TransactionModel = require('../models/transaction-model');
const CardModel = require('../models/card-model');
require('dotenv').config();
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const TransactionDto = require('../dtos/transaction-dto');

class BankService {
    async registerCard(data) {
        const user = await UserModel.create({phone, email, password: hashPassword});

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async getTransactions(userId, cardId) {
        const filter = {}

        if(userId) filter.user = userId
        if(cardId) filter.card = cardId

        const transactions = await TransactionModel.find(filter).populate('card');
        const transactionsDtos = await transactions.map(transaction => new TransactionDto(transaction));

        return transactionsDtos;
    }

    async updateBalance(cardId, balance) {
        return await CardModel.updateOne({_id: cardId}, {balance})
    }

    async pay(cardId, amount, type, description) {
        const card = await CardModel.findById(cardId)
        console.log(card)
        await TransactionModel.create({
            user: card.userId,
            card: cardId,
            amount,
            description,
            type,
        })

        card.balance = card.balance - amount

        return await card.save()
    }
}


module.exports = new BankService();