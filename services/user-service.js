const UserModel = require('../models/user-model');
const IdModel = require('../models/id-model');
const AvatarModel = require('../models/avatar-model');
const NotificationModel = require('../models/notification-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const NotificationDto = require('../dtos/notification-dto');
const ApiError = require('../exceptions/api-error');
const generatePassword = require('password-generator');
const {avatarBase} = require("../utils/config");
const {Schema} = require("mongoose");
const IdDto = require("../dtos/id-dto");

class UserService {
    async register(email, phone, password) {
        if (await UserModel.findOne({phone})) {
            throw ApiError.BadRequest('User with this phone number already exists');
        }

        if (await UserModel.findOne({email})) {
            throw ApiError.BadRequest('User with this email address already exists');
        }

        const hashPassword = await bcrypt.hash(password, 1);

        const user = await UserModel.create({phone, email, password: hashPassword});
        await AvatarModel.create({
            user: user._id,
            base64: avatarBase
        });

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async login(email, password) {
        const user = await UserModel.findOne({email: email}).populate('cards');

        if (!user) {
            throw ApiError.BadRequest('Can\'t find user with this email');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals) {
            throw ApiError.BadRequest('Can\t find user with this credentials');
        }

        const avatar = await AvatarModel.findOne({user: user._id});

        if(!avatar) await AvatarModel.create({
            user: user._id,
            base64: avatarBase
        });

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

        const user = await UserModel.findById(userData.id).populate('cards');
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async getAllUsers() {
        const users = await UserModel.find().populate('cards');
        const usersDtos = await users.map(user => new UserDto(user));

        return usersDtos;
    }

    async getAllIds() {
        const ids = await IdModel.find().populate('user');
        const idsDtos = await ids.map(id => new IdDto(id));

        return idsDtos;
    }

    async getNotifications(userId) {
        const notifications = await NotificationModel.find({userId});
        const notificationsDtos = await notifications.map(notification => new NotificationDto(notification));

        return notificationsDtos;
    }

    async readNotifications(userId) {
        return await NotificationModel.updateMany({userId}, {read: true})
    }

    async updateUser(id, data) {
        if (await UserModel.findOne({phone: data.phone, _id: { $ne: id }})) {
            throw ApiError.BadRequest('User with this phone number already exists');
        }

        if (await UserModel.findOne({email: data.email, _id: { $ne: id }})) {
            throw ApiError.BadRequest('User with this email address already exists');
        }

        const user = await UserModel.findByIdAndUpdate(id, data, {new: true, populate: 'cards'});

        return new UserDto(user);
    }

    async changeAvatar(user, base64) {
        return AvatarModel.findOneAndUpdate({user}, {base64});
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
                throw ApiError.BadRequest('Old password is incorrect');
            }
        } else {
            throw ApiError.BadRequest('New password can not be the same as the old one');
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

    async getMe(id) {
        return await UserModel.findById(id).populate('cards')
    }

    async id(userId, photos) {
        return await IdModel.create({
            user: userId,
            photos
        })
    }

    async idSuccess(_id) {
        const id = await IdModel.findById(_id)
        const userId = id.user
        await IdModel.deleteOne({_id})
        await UserModel.updateOne({_id: userId}, {isIdentified: true})
        return await NotificationModel.create({
            userId,
            title: 'Identification',
            description: 'The verification was successful, the status of your account has been changed to "Identified"',
        })
    }

    async idReject(_id) {
        const id = await IdModel.findById(_id)
        const userId = id.user
        await IdModel.deleteOne({_id})
        return await NotificationModel.create({
            userId,
            title: 'Identification',
            description: 'The check failed, try again',
        })
    }

    async getAvatar(user) {
        return await AvatarModel.findOne({user})
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