module.exports = class NotificationDto {
    id;
    userId;
    title;
    description;
    read;
    createdAt;

    constructor(model) {
        this.id = model._id;
        this.userId = model.userId;
        this.title = model.title;
        this.description = model.description;
        this.read = model.read;
        this.createdAt = model.createdAt;
    }
}