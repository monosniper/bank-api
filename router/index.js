const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const BankController = require('../controllers/bank-controller');
const UploadController = require('../controllers/upload-controller');
const ScheduleController = require('../controllers/schedule-controller');
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
router.post('/users/update', UserController.updateUser);
router.post('/users/avatar', authMiddleware, UserController.getAvatar);
router.post('/users/change-avatar', authMiddleware, UserController.changeAvatar);
router.put('/users/change-password', authMiddleware, UserController.changePassword);
router.get('/users/:id/reset-password', authMiddleware, UserController.resetPassword);
router.get('/users', UserController.getUsers);
router.get('/users/me', authMiddleware, UserController.getMe);
router.post('/users/id', authMiddleware, UserController.id);
router.post('/users/id/success', authMiddleware, UserController.idSuccess);
router.post('/users/id/reject', authMiddleware, UserController.idReject);

router.get('/ids', UserController.getIds);

router.post('/transactions', BankController.getTransactions);

router.get('/schedules', ScheduleController.getAll);

router.post('/cards/order', BankController.orderCard);
router.post('/cards/balance', BankController.updateBalance);
router.post('/cards/pay', BankController.pay);
router.post('/cards/transfer', BankController.transfer);
router.post('/cards/convert', BankController.convert);
router.post('/cards/withdraw', BankController.withdraw);
router.get('/cards', BankController.get);
router.post('/cards/update', BankController.updateCard);
router.delete('/cards/:id/delete', BankController.deleteCard);

router.get('/notifications', UserController.getNotifications);
router.get('/notifications/read', UserController.readNotifications);

router.post('/upload', authMiddleware, UploadController.uploadFiles);

module.exports = router;