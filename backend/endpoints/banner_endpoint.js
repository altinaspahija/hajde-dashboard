const express = require('express')
const router = express.Router()
const authZ = require('../middlewares/authorization');
const Banner = require('../data_access/banner_repository');
const AWS = require('aws-sdk');
const fileType = require('file-type');
function generate_random(from, to) {
  return Math.floor(Math.random() * to) + from;
}

router.put('/update/:id', authZ("admin"), async (req, res) => {
  try {
    const banner = new Banner();
    let  bnr = {...req.body}
    
    const foundBanner = await banner.getById(req.params.id);
    if(foundBanner) {
      if(req.body.imageUrl && req.body.imageUrl.startsWith("data")) {
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: 'eu-central-1',
          signatureVersion: 'v4'
        });
    
        const s3Bucket = new AWS.S3({
          signatureVersion: 'v4'
        });
    
        const base64Image = req.body.imageUrl.replace(/^data:.*,/, '');
        const buffer = new Buffer.from(req.body.imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const mimeType = await fileType.fromBuffer(Buffer.from(base64Image, 'base64'));
        if (mimeType.ext !== 'png' && mimeType.ext !== 'jpg' && mimeType.ext !== 'gif' && mimeType.ext !== 'jpeg') {
          return res.status(500).json({
            status: 'Deshtuar',
            error: 'Fajlli duhet të jetë një nga tipet poshtë përmendura: png, jpg, jpeg dhe gif'
          });
        }
        let imageName = `image_${generate_random(1,999999999999)}.${mimeType.ext}`;
        const data = await s3Bucket.upload({
          Bucket: process.env.BUCKET_NAME,
          Key: imageName,
          Body: buffer,
          ContentEncoding: 'base64', // required
          ContentType: `image/${mimeType.ext}`,
          ACL: 'public-read',
          Region: 'eu-central-1'
        }).promise();
        bnr.imageURL = `https://hajde-company-images.s3.eu-central-1.amazonaws.com/${data.Key}`;
      } else {
        bnr.imageURL = req.body.imageUrl;
      }
      
      await banner.update(req.params.id, bnr);
      return res.status(200).json({
        status: "Sukses",
        message: "Baneri u ndryshua me sukses"
      });
    } else {
      return res.status(404).json({
        status: "Dështuar",
        error: "Baneri me këtë id nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    console.log(error);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post('/create', authZ("admin"), async (req, res) => {
  try {
    const banner = new Banner();
    let bnr = {...req.body}
    if(!req.body.imageUrl) {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Nuk e keni ngarkuar banerin."
      });
    }
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: 'eu-central-1',
      signatureVersion: 'v4'
    });

    const s3Bucket = new AWS.S3({
      signatureVersion: 'v4'
    });

  if (req.body.imageUrl.startsWith("data")) {
      const base64Image = req.body.imageUrl.replace(/^data:.*,/, '');
      const buffer = new Buffer.from(req.body.imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const mimeType = await fileType.fromBuffer(Buffer.from(base64Image, 'base64'));
      if (mimeType.ext !== 'png' && mimeType.ext !== 'jpg' && mimeType.ext !== 'gif' && mimeType.ext !== 'jpeg') {
        return res.status(500).json({
          status: 'Deshtuar',
          error: 'Fajlli duhet të jetë një nga tipet poshtë përmendura: png, jpg, jpeg dhe gif'
        });
      }
      let imageName = `image_${generate_random(1,999999999999)}.${mimeType.ext}`;
      const data = await s3Bucket.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentEncoding: 'base64', // required
        ContentType: `image/${mimeType.ext}`,
        ACL: 'public-read',
        Region: 'eu-central-1'
      }).promise();
      bnr.imageURL = `https://hajde-company-images.s3.eu-central-1.amazonaws.com/${data.Key}`;
      delete bnr.imageUrl
    } else {
      bnr.imageURL = req.body.imageUrl;
    }

    await banner.createBanner(bnr);
    return res.status(200).json({
      status: "Sukses",
      message: "Baneri u krijua me sukses"
    });

  } catch(error) {
    res.statusCode = 500;
    console.log(error);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})





router.delete('/delete/:id', authZ('admin'), async (req, res) => {
  try {
    const banner = new Banner();
    const foundBanner = await banner.getById(req.params.id);;
    if(foundBanner) {
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
        Key: new URL(foundBanner.imageURL).pathname.replace('/','')
      };
      const fileFound = await s3Bucket.headObject(params).promise();
      if (fileFound) {
        await s3Bucket.deleteObject(params).promise();
      }
      await banner.delete(req.params.id);
      return res.status(200).json({
        status: "Sukses",
        message: "Baneri u ndryshua me sukses"
      });
    } else {
      return res.status(404).json({
        status: "Dështuar",
        error: "Baneri me këtë id nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    console.log(error);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})



router.put('/change-stauts/:id', authZ('admin'), async (req, res) => {
  try {
    const banner = new Banner();
    const foundBanner = await banner.getById(req.params.id);
    if(foundBanner) {
      await banner.changeStatus(req.params.id, req.body.status);
      return res.status(200).json({
        status: "Sukses",
        message: "Baneri u ndryshua me sukses"
      });
    } else {
      return res.status(404).json({
        status: "Dështuar",
        error: "Baneri me këtë id nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    console.log(error);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})


router.get('/list', authZ("admin"), async (req ,res ) => {
  try {
    const banner = new Banner();
    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status == "true" : undefined;
    let result = await banner.listAll(page, 15, status, req.user.country);
    return res.json(result);
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  } 
})
router.get('/:id', authZ('admin'), async (req, res) => {
  try {
    const banner = new Banner();
    const foundBanner = await banner.getById(req.params.id);
    if(foundBanner) {
      await banner.changeStatus(req.params.id, req.body.status);
      return res.status(200).json({
        status: "Sukses",
        banner: foundBanner
        
      });
    } else {
      return res.status(404).json({
        status: "Dështuar",
        error: "Baneri me këtë id nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    console.log(error);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})


module.exports = router;