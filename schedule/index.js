const CronJob = require("node-cron");
const ScheduleModel = require("../models/schedule-model");
const CardModel = require("../models/card-model");
const NotificationModel = require("../models/notification-model");

exports.initScheduledJobs = () => {
    const scheduledJobFunction = CronJob.schedule("*/1 * * * *", async () => {
        console.log("Schedule started");

        const schedule = (task) => {
            return {
                registerCard: async () => {
                    const cardNames = {
                        'visa_classic': "Visa Classic",
                        'visa_gold': "Visa Gold",
                        'visa_platinum': "Visa Platinum",
                        'mastercard': "MasterCard",
                        'mir_standard': "Mir Standard",
                        'mir_plus': "Mir Plus",
                    }

                    if (task.data.userId) {
                        await CardModel.create(task.data)
                        await NotificationModel.create({
                            userId: task.data.userId,
                            title: 'Congrats!',
                            description: 'Your card ('+cardNames[task.data.subtype]+') has been successfully created and you can now see it on the main screen',
                        })

                        task.completed = true
                        await task.save()
                    }
                }
            }[task.type]()
        }

        const allTasks = await ScheduleModel.find({
            completed: false,
            startAt: { $lte: new Date()}
        });

        allTasks.map(schedule)
    });

    scheduledJobFunction.start();
}