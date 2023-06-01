const randomBetween = require("./randomBetween");

function generateCardCVV(type) {
    return randomBetween(111, 999)
}

module.exports = generateCardCVV