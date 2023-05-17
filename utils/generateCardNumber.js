function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateCardNumber(type) {
    const types = {
        visa: '4784',
        mastercard: '5784',
        mir: '2784',
        universal: '0000',
    }

    return types[type] + randomBetween(100000000000, 999999999999)
}

module.exports = generateCardNumber