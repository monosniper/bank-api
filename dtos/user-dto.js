const CardDto = require("./card-dto");
const {cardTypes} = require("../utils/config");
module.exports = class UserDto {
    id;
    fio;
    phone;
    email;
    isAdmin;
    total_balance;
    cards;

    constructor(model) {
        this.id = model._id;
        this.fio = model.username;
        this.phone = model.phone;
        this.email = model.email;
        this.isAdmin = model.isAdmin;
        this.cards = this.getCards(model);
        this.balance = this.getBalance(model);
    }

    getCards(model) {
        return model.cards ? model.cards.map(card => new CardDto(card)) : [];
    }

    getBalance(model) {
        const UserBalance = {
            usd: 0,
            uah: 0,
            rub: 0,
        }

        model.cards.forEach(({balance, type}) => {
            UserBalance[cardTypes[type]] += balance
        })

        return UserBalance;
    }
}