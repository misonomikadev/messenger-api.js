const crypto = require('crypto');
const aes = require("aes-js");
function encryptState(data, key) {
    let hashEngine = crypto.createHash("sha256");
    let hashKey = hashEngine.update(key).digest();
    let bytes = aes.utils.utf8.toBytes(data);
    let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
    let encryptedData = aesCtr.encrypt(bytes);
    return aes.utils.hex.fromBytes(encryptedData);
}
function decryptState(data, key) {
    let hashEngine = crypto.createHash("sha256");
    let hashKey = hashEngine.update(key).digest();
    let encryptedBytes = aes.utils.hex.toBytes(data);
    let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
    let decryptedData = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedData);
}
module.exports = {
    encryptState:encryptState,
    decryptState:decryptState
}