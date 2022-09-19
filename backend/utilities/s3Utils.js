const fileType = require("file-type");
const AWS = require("aws-sdk");
const {generate_random_uuid} = require("./randomNumber");
const ImageOptimizer = require("./imageOptimization");

async function uploadImageToS3(name, data, company, s3Bucket) {
    if (data) {
        const base64Image = data.replace(/^data:.*,/, '');
        const buffer = new Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const optimizedBuffer = await ImageOptimizer.optimize(buffer, { width: 320, height: 280 });
        const mimeType = await fileType.fromBuffer(Buffer.from(base64Image, 'base64'));
        if (mimeType.ext !== 'png' && mimeType.ext !== 'jpg' && mimeType.ext !== 'gif' && mimeType.ext !== 'jpeg') {
            return res.status(500).json({
                status: 'Deshtuar',
                error: 'Fajlli duhet të jetë një nga tipet poshtë përmendura: png, jpg, jpeg dhe gif'
            });
        } else {
            let imageName = `image_${generate_random_uuid()}.${mimeType.ext}`;
            const data = await s3Bucket.upload({
                Bucket: process.env.BUCKET_NAME,
                Key: imageName,
                Body: optimizedBuffer,
                ContentEncoding: 'base64', // required
                ContentType: `image/${mimeType.ext}`,
                ACL: 'public-read',
                Region: 'eu-central-1'
            }).promise();
            company[name] = `https://hajde-company-images.s3.eu-central-1.amazonaws.com/${data.Key}`;
        }
    }
}

async function deleteImageFromS3(name) {
    try {
        if (name) {
            AWS.config.update({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: 'eu-central-1',
                signatureVersion: 'v4'
            });
            const s3Bucket = new AWS.S3({
                signatureVersion: 'v4'
            });

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: new URL(name).pathname.replace('/','')
            };
            const fileFound = await s3Bucket.headObject(params).promise();
            if (fileFound) {
                await s3Bucket.deleteObject(params).promise();
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadImageToS3,
    deleteImageFromS3
};