const UserDto = require("./user-dto");
const CardDto = require("./card-dto");

module.exports = class TransactionDto {
    id;
    user;
    card;
    amount;
    type;
    description;
    status;
    createdAt;

    constructor(model) {
        this.id = model._id;
        this.user = model.user;
        // this.user = this.getUser(model);
        this.card = this.getCard(model);
        this.amount = model.amount;
        this.type = model.type;
        this.description = model.description;
        this.status = model.status;
        this.createdAt = model.createdAt;
    }

    getUser(model) {
        return model.user ? new UserDto(model.user) : null;
    }

    getCard(model) {
        return model.card ? new CardDto(model.card) : null;
    }
}