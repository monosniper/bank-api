module.exports = class UserDto {
    id;
    fio;
    phone;
    email;

    constructor(model) {
        this.id = model._id;
        this.fio = model.username;
        this.phone = model.phone;
        this.email = model.email;
    }
}