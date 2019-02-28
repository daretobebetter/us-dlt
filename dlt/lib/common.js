

class EncryptDecrypt {
    constructor(key) {
        this.algorithm = 'aes-256-ctr';
        this.key = key ? key : '2E150B033917E7FF959456A497586FFF';
        this.inputEncoding = 'utf8';
        this.outputEncoding = 'hex';
    }

    encrypt(value) {
        const {
            createCipher
        } = require('crypto');
        const cipher = createCipher(this.algorithm, this.key);
        let crypted = cipher.update(value, this.inputEncoding, this.outputEncoding);
        crypted += cipher.final(this.outputEncoding);
        return crypted;
    }

    decrypt(value) {
        const {
            createDecipher
        } = require('crypto');
        const decipher = createDecipher(this.algorithm, this.key);
        let dec = decipher.update(value, this.outputEncoding, this.inputEncoding);
        dec += decipher.final(this.inputEncoding);
        return dec;
    }
    encryptIv(value) {
        const {
            createCipheriv,
            randomBytes
        } = require('crypto');
        const iv = new Buffer.from(randomBytes(16));
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        let crypted = cipher.update(value, this.inputEncoding, this.outputEncoding);
        crypted += cipher.final(this.outputEncoding);
        return `${iv.toString('hex')}:${crypted.toString()}`;
    }

    decryptIv(value) {
        const {
            createDecipheriv
        } = require('crypto');
        const textParts = value.split(':');

        //extract the IV from the first half of the value
        const IV = new Buffer.from(textParts.shift(), this.outputEncoding);

        //extract the encrypted text without the IV
        const encryptedText = new Buffer.from(textParts.join(':'), this.outputEncoding);

        //decipher the string
        const decipher = createDecipheriv(this.algorithm, this.key, IV);
        let decrypted = decipher.update(encryptedText, this.outputEncoding, this.inputEncoding);
        decrypted += decipher.final(this.inputEncoding);
        return decrypted.toString();
    }
}
module.exports.EncryptDecrypt = EncryptDecrypt;