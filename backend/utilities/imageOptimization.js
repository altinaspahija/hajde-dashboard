const sharp = require('sharp');

class ImageOptimizer {

    static optimize(inputBuffer, size) {
        return new Promise((resolve, reject) => {
            sharp(inputBuffer)
            .resize(size.width, size.height)
            .png({quality: 70})
            .toBuffer((err, buffer, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            })
        });
    }
}

module.exports = ImageOptimizer