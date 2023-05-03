const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const generatePassword = require('password-generator');

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
}


module.exports = new BankService();