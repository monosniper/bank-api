const UserDto = require("./user-dto");

module.exports = class TransactionDto {
    id;
    user;
    amount;
    type;
    status;
    createdAt;

    constructor(model) {
        this.model = model;
        this.id = model._id;
        this.user = this.getUser();
        this.amount = model.amount;
        this.type = model.type;
        this.status = model.status;
        this.createdAt = model.createdAt;
    }

    getUser() {
        return this.model.user ? new UserDto(this.model.user) : null;
    }
}