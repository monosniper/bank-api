function generateCardExpiry() {
    const now = new Date();
    const expiry = new Date(now.setFullYear(now.getFullYear() + 4));

    return ("0" + (expiry.getMonth() + 1)).slice(-2) + '/' + expiry.getFullYear().toString().slice(-2);
}

module.exports = generateCardExpiry