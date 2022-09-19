const admin = require("firebase-admin");
const serviceAccount = require("../../hajdeapp-19adf-firebase-adminsdk-bs5gr-e6f4b567cb.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

function sendNotification(tokens, notification) {
    return new Promise((resolve, reject) => {
        admin.messaging().sendToDevice(tokens, notification)
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

async function pushNotification(phone, tokens, title, description) {
    const result = {
        notification: {
            body: description,
            title: title
        },
        data: {
            target: "MARKET_SCREEN"
        }
    };

    const tokensString = tokens.map((t) => t.fcmToken);
    if (tokens && tokens.length > 0) {
        await sendNotification(tokensString, result);
    }
}

module.exports = {
    sendNotification,
    pushNotification
};