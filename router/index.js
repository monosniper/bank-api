const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const BankController = require('../controllers/bank-controller');
const UploadController = require('../controllers/upload-controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/users/create',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    body('phone').isMobilePhone(),
    UserController.register);
router.post('/users/login', UserController.login);
router.post('/users/logout', authMiddleware, UserController.logout);
router.get('/users/refresh', UserController.refresh);
router.get('/users/forget', UserController.forget);
router.get('/users', authMiddleware, UserController.getUsers);
router.post('/users/:id/update', authMiddleware, UserController.updateUser);
router.post('/users/:id/change-password', authMiddleware, UserController.changePassword);
router.get('/users/:id/reset-password', authMiddleware, UserController.resetPassword);

router.post('/cards/order', BankController.orderCard);

router.get('/notifications', UserController.getNotifications);

router.post('/upload', authMiddleware, UploadController.uploadFiles);

module.exports = router;