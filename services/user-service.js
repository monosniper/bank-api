const UserModel = require('../models/user-model');
const NotificationModel = require('../models/notification-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const NotificationDto = require('../dtos/notification-dto');
const ApiError = require('../exceptions/api-error');
const generatePassword = require('password-generator');

class UserService {
    async register(email, phone, password) {
        if (await UserModel.findOne({phone})) {
            throw ApiError.BadRequest('Пользователь с данным номером телефона уже существует');
        }

        if (await UserModel.findOne({email})) {
            throw ApiError.BadRequest('Пользователь с данным E-mail уже существует');
        }

        const hashPassword = await bcrypt.hash(password, 1);

        const user = await UserModel.create({phone, email, password: hashPassword});

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async login(email, password) {
        const user = await UserModel.findOne({email: email});

        if (!user) {
            throw ApiError.BadRequest('Пользователя с такой почтой не существует');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals) {
            throw ApiError.BadRequest('Данные для входа не верны');
        }

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenData = TokenService.findToken(refreshToken);

        if (!userData || !tokenData) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async getAllUsers() {
        const users = await UserModel.find();
        const usersDtos = await users.map(user => new UserDto(user));

        return usersDtos;
    }

    async getNotifications(userId) {
        const notifications = await NotificationModel.find({userId});
        const notificationsDtos = await notifications.map(notification => new NotificationDto(notification));

        return notificationsDtos;
    }

    async updateUser(id, data) {
        function validated(data) {

            const validatedData = {};

            Object.entries(data).map(([key, value]) => {
                if([
                    'fio',
                    'email',
                    'phone',
                ].indexOf(key) !== -1) validatedData[key] = value;
            })

            return validatedData;
        }

        const user = await UserModel.findByIdAndUpdate(id, validated(data), {new: true});

        return new UserDto(user);
    }

    async changePassword(id, data) {
        const {oldPassword, newPassword} = data;
        const user = await UserModel.findById(id);

        if(oldPassword !== newPassword) {
            const isPassEquals = await bcrypt.compare(oldPassword, user.password);

            if(isPassEquals) {
                user.password = await bcrypt.hash(newPassword, 1);
                user.save();
            } else {
                throw ApiError.BadRequest('Старый пароль не верный');
            }
        } else {
            throw ApiError.BadRequest('Новый пароль не может быть таким же как старый');
        }


        return new UserDto(user);
    }

    async resetPassword(id) {
        const user = await UserModel.findById(id);

        const newPassword = generatePassword(12)

        user.password = await bcrypt.hash(newPassword, 1);
        user.save();

        try {
            await MailService.sendResetPasswordMail(user.email, user.username, newPassword)
        } catch (e) {
            console.log(e)
        }

        return new UserDto(user);
    }

    async resetPasswordByEmail(email) {
        const newPassword = generatePassword(12)
        const password = await bcrypt.hash(newPassword, 1)
        const user = await UserModel.findOneAndUpdate({email}, {password}, {new: true});

        try {
            await MailService.sendResetPasswordMail(user.email, user.username, newPassword)
        } catch (e) {
            console.log(e)
        }

        return new UserDto(user);
    }
}


module.exports = new UserService();