module.exports = class UserDto {
    id;
    type;
    data;
    startAt;
    completed;

    constructor(model) {
        this.id = model._id;
        this.type = model.type;
        this.data = model.data;
        this.startAt = model.startAt;
        this.completed = model.completed;
    }
}