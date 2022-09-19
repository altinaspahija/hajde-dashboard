const { S3, config } = require('aws-sdk');
const { scheduleJob, scheduledJobs } = require('node-schedule');
const { getData } = require('../importer/xlsx-csv-importer');
const Order = require('../data_access/order_repository');
const Product = require('../data_access/product_repository');

const ObjectId = require("mongoose").Types.ObjectId;
const mappingSub = require('../data_access/map_subcategories_categories')
const Subcategories = require('../data_access/product_subcategory_repository')
const mappingSubS = new mappingSub();
const subcategories = new Subcategories();
const product = new Product();
const orderRepo = new Order();
module.exports.startCron = async () => {
  config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'eu-central-1',
    signatureVersion: 'v4'
  });
  ;
  function getCurrentKey(s3Bucket) {
    return new Promise((resolve, reject) => {
      s3Bucket.listObjectsV2({ Bucket: 'hajde-company-images', Prefix: 'files/', Delimiter: '/', StartAfter: 'files/' }, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Contents[0].Key);
      })
    })
  }


  function getFileFromBucker(s3Bucket, file) {
    return new Promise((resolve, reject) => {
      s3Bucket.getObject({ Bucket: 'hajde-company-images', Key: file }, async (e, d) => {
        if (e) return reject(e);
        return resolve(d)
      })
    })
  }

  scheduleJob('CRON', "0 2 * * *", async () => {
    try {
      const s3Bucket = new S3({ apiVersion: 'v4' })
      const key = await getCurrentKey(s3Bucket);
      var buffers = [];
      
      const file = s3Bucket.getObject({ Bucket: 'hajde-company-images', Key: key }).createReadStream();
      file.on('data', function(data) {
        buffers.push(data);
      });

      file.on('end', async function() {
        var buffer = Buffer.concat(buffers);
        var rows = await getData(buffer);
        let objs =[]

        for(let elem of rows) {
          let subcat = await mappingSubS.getMapingByCategory(elem['Category code'], elem['Group code']);
          const cat = await subcategories.getSubcategoryById(subcat.subcategoryId);
          objs.push({
            productCode: elem.productCode,
            name: elem.name,
            price: parseFloat(elem.price),
            unit: elem.unit,
            description: elem.description,
            imageURL: elem.imageURL,
            subcategoryId: ObjectId(subcat.subcategoryId),
            categoryId: ObjectId(cat.categoryId),
            isAvailable: true,
            companyId: ObjectId("5ff6fb76639963e2c4ee0133")
          })
        }
        const currentProducts = await (await product.listAll('5ff6fb76639963e2c4ee0133')).products;
        const ids = objs.map(i => i.productCode.toString());
      
        const productsTBD = [];
        for (const currentProduct of currentProducts) {
          if (ids.indexOf(`${currentProduct.productCode}`) == -1) {
            const order = await orderRepo.findOrdersOfProduct(currentProduct._id);
            if (order.length > 1) {
              productsTBD.push({
                productId: currentProduct._id,
                outOfStock: true,
                companyId: ObjectId(currentProduct.companyId),
              });
            } else {
              productsTBD.push({
                productId: currentProduct._id,
                companyId: ObjectId(currentProduct.companyId),
              });
            }
          }
        }
        console.log(objs.length)
        console.log(productsTBD.length)
        await product.insertAll(objs, productsTBD);
        console.log("done")
      })
      
    } catch (error) {
      console.log(error)
    }
  })
}

