module.exports = class CardDto {
    id;
    title;
    type;
    subtype;
    balance;
    number;
    expiry;
    cvv;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.type = model.type;
        this.subtype = model.subtype;
        this.balance = model.balance;
        this.number = model.number;
        this.expiry = model.expiry;
        this.cvv = model.cvv;
    }
}