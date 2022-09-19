const speakeasy = require("speakeasy");
const uuid = require("uuid");
var qrCode = require("qrcode");

async function generateTempSecret() {
    return speakeasy.generateSecret();
}

async function verifyOtp(secret, token) {
    const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token
    });

    return verified;
}

async function generateUUID() {
    return uuid.v4();
}

async function generateQRCode(secret, label) {
    return new Promise((resolve, reject) => {
        const url = secret.otpauth_url.replace("SecretKey", label);

        qrCode.toDataURL(url, function (err, data_url) {
            if (err) {
                reject(err);
            } else {
                resolve(data_url);
            }
        });
    });
}

module.exports = {
    generateTempSecret,
    verifyOtp,
    generateUUID,
    generateQRCode
};