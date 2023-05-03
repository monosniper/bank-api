const UserService = require('../services/user-service');
const ApiError = require("../exceptions/api-error");
const {validationResult} = require('express-validator');
const fs = require("fs");
const axios = require("axios");
const hmac = require("crypto-js/hmac-sha256");
const { v4 } = require('uuid');
const FormData = require('form-data');

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
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);

        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body.data);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const user = await UserService.changePassword(req.params.id, {oldPassword: req.body.oldPassword, newPassword: req.body.newPassword});
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
            console.log(notifications)
            return res.json(notifications);
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