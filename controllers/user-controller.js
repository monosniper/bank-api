const UserService = require('../services/user-service');
const ApiError = require("../exceptions/api-error");
const {validationResult} = require('express-validator');
const fs = require("fs");
const axios = require("axios");
const hmac = require("crypto-js/hmac-sha256");
const { v4 } = require('uuid');
const FormData = require('form-data');
const UserDto = require("../dtos/user-dto");

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
            }

            const {email, phone, password} = req.body;
            const userData = await UserService.register(email, phone, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.headers;
            const userData = await UserService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);

        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const {id, data} = req.body

            if(id) {
                const user = await UserService.updateUser(id, data);
                return res.json(new UserDto(user));
            }
        } catch (e) {
            next(e)
        }
    }

    async changeAvatar(req, res, next) {
        try {
            const {user, base64} = req.body
            return await UserService.changeAvatar(user, base64);
        } catch (e) {
            next(e)
        }
    }

    async id(req, res, next) {
        try {
            const {user, photos} = req.body
            return await UserService.id(user, photos);
        } catch (e) {
            next(e)
        }
    }

    async idSuccess(req, res, next) {
        try {
            return await UserService.idSuccess(req.body.id);
        } catch (e) {
            next(e)
        }
    }

    async idReject(req, res, next) {
        try {
            return await UserService.idReject(req.body.id);
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const {id, data} = req.body
            const {oldPassword, newPassword} = data
            const user = await UserService.changePassword(id, {oldPassword, newPassword});
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async resetPassword(req, res, next) {
        try {
            const user = await UserService.resetPassword(req.params.id);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async getNotifications(req, res, next) {
        try {
            const notifications = await UserService.getNotifications(req.query.id);
            return res.json(notifications);
        } catch (e) {
            next(e)
        }
    }

    async readNotifications(req, res, next) {
        try {
            return await UserService.readNotifications(req.query.userId)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e)
        }
    }

    async getIds(req, res, next) {
        try {
            const ids = await UserService.getAllIds();
            return res.json(ids);
        } catch (e) {
            next(e)
        }
    }

    async getMe(req, res, next) {
        try {
            const me = await UserService.getMe(req.user.id)
            return res.json(new UserDto(me));
        } catch (e) {
            next(e)
        }
    }

    async getAvatar(req, res, next) {
        try {
            const avatar = await UserService.getAvatar(req.body.user)
            return res.json(avatar);
        } catch (e) {
            next(e)
        }
    }

    async forget(req, res, next) {
        try {
            const user = await UserService.resetPasswordByEmail(req.query.email);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();