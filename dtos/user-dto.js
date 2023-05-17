const CardDto = require("./card-dto");
const {cardTypes, cardSubTypes} = require("../utils/config");
module.exports = class UserDto {
    id;
    fullName;
    phone;
    email;
    isAdmin;
    isSuperAdmin;
    isIdentified;
    cards;

    constructor(model) {
        this.id = model._id;
        this.fullName = model.fullName;
        this.phone = model.phone;
        this.email = model.email;
        this.isAdmin = model.isAdmin;
        this.isSuperAdmin = model.isSuperAdmin;
        this.isIdentified = model.isIdentified;
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

        model.cards.forEach(({balance, subtype}) => {
            UserBalance[cardSubTypes[subtype]] += balance
        })

        return UserBalance;
    }
}