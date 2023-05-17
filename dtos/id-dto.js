const UserDto = require("./user-dto");
module.exports = class IdDto {
    id;
    photos;
    user;

    constructor(model) {
        this.id = model._id;
        this.photos = model.photos;
        this.user = new UserDto(model.user);
    }
}