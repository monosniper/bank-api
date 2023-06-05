require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const scheduledFunctions = require("./schedule");
const Card = require("./models/card-model");
const ScheduleModel = require("./models/schedule-model");
const generateCardNumber = require("./utils/generateCardNumber");
const generateCardCVV = require("./utils/generateCardCVV");
const CardModel = require("./models/card-model");
const generateCardExpiry = require("./utils/generateCardExpiry");
const UserModel = require("./models/user-model");
const NotificationModel = require("./models/notification-model");
const randomBetween = require("./utils/randomBetween");

const PORT = process.env.PORT || 5000;

const app = express()

app.use(express.json({ limit: '50mb' }));
app.use(fileUpload({
    createParentPath: true
}));
app.use(cookieParser());
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true)
    }
}

app.use(cors(corsOptions));
app.use('/api', router);
app.use(errorMiddleware);
app.use(express.static('uploads', {
    setHeaders: function (res, path, stat) {
        res.set('Content-Type', 'image/png')
    }
}));

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        scheduledFunctions.initScheduledJobs();

        // Generate cards
        // const count = 20
        // for(let i = 0;i<count;i++) {
        //     const userId = '645788495d47f5d7feaada7e'
        //
        //     const number = generateCardNumber('visa').toString()
        //     const expiry = generateCardExpiry()
        //     const cvv = generateCardCVV()
        //     const balance = randomBetween(10, 30)
        //
        //     console.log(`${number} ${expiry} ${cvv} --- $${balance}`)
        //
        //     const card = await CardModel.create({
        //         userId,
        //         balance: balance * 100,
        //         title: 'Test',
        //         type: 'visa',
        //         subtype: 'visa_classic',
        //         number,
        //         expiry,
        //         cvv,
        //     })
        //
        //     await UserModel.findById(userId).then(user => {
        //         user.cards.push(card);
        //         user.save();
        //     });
        // }

        // await CardModel.updateMany({title: 'Test'}, {balance: 25000})

        await app.listen(PORT, () => {
            console.log('Server started at port ' + PORT);
        })
    } catch (e) {
        console.log(e)
    }
}

start();