const express = require("express");
const router = express.Router();
const passport = require('passport');
const AccountRepository = require("../data_access/account_repository");
const Account = require("../data_access/account_repository");
const Restaurant = require("../data_access/restaurant_repository");
const Categories = require('../data_access/product_category_repository');
const CompanyCategory = require('../data_access/company_category_repository');
const Order = require("../data_access/order_repository");
const Product = require('../data_access/product_repository');
const MapSubcategory = require('../data_access/map_subcategories_categories');

const AWS = require('aws-sdk');
const fileType = require('file-type');
function generate_random(from, to) {
  return Math.floor(Math.random() * to) + from;
}

const authZ = require("../middlewares/authorization");
require('dotenv').config();
const json2csv = require('json2csv');
const {uploadImageToS3, deleteImageFromS3} = require("../utilities/s3Utils");

router.post("/create",  authZ("admin"), async (req, res) => {
  try {
    const restaurantRep = new Restaurant();
    const categoriesRep = new Categories();
    console.log(req.body.restaurant.name);
    const exsist = await restaurantRep.findRestaurantByName(req.body.restaurant.name);
    const restaurant = {accountId: '', ...req.body.restaurant};
    if (!exsist) {

      AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: 'eu-central-1',
        signatureVersion: 'v4'
      });

      const s3Bucket = new AWS.S3({
        signatureVersion: 'v4'
      });

      const { cover, logo } = req.body.restaurant;
      if (logo && logo.startsWith("data:image/")) {
        await uploadImageToS3("logo", logo, restaurant, s3Bucket);
      }
      if (cover && cover.startsWith("data:image/")) {
        await uploadImageToS3("cover", cover, restaurant, s3Bucket);
      }
      
      const accountRep = new Account();
      const accountFound = await accountRep.getAccountByEmail(req.body.user.email);

      if (accountFound != null) {
        res.statusCode = 500;
        return res.json({
          status: 'Dështuar',
          error: 'Përdoruesi me këtë email ekziston'
        });
      }

      const objToSave = {
        email: req.body.user.email,
        role: 'restaurant',
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        password: req.body.user.password
      };

      const companyAccount = await accountRep.createAccount(objToSave);
      restaurant['accountId'] = companyAccount;

      await restaurantRep.createRestaurant(restaurant);

      return res.status(200).json({
        status: "Sukses",
        message: "Restauranti u krijua me sukses"
      });
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Restauranti ekziston"
      });
    }
  } catch (error) {
    console.log("error =>",error);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/list", authZ("admin"), async function (req, res) {
  try {
    const restaurantRep = new Restaurant();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let name = req.query.name;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status == "true" : undefined;
    let result = await restaurantRep.listAllPaginate(page, 15, name, status, country, city);
    return res.json(result);
  }
  catch (err) {
    res.statusCode = 500;
    console.log(err);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/export-list", authZ("admin"), async function (req, res) {
  try {
    const restaurantRep = new Restaurant();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let name = req.query.name;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status == "true" : undefined;
    let result = await restaurantRep.listAllExport(page, 15, name, status, country, city);
    let elem = [];
    let companies = result.restaurants.map(e => {
    elem = {
        name: e.name, 
        'phone': e.phone,
        'description': e.description,
        'imageURL': e.imageURL,
        'url': e.url,
        'currency': e.currency,
        'deliveryTime': e.deliveryTime,
        'createdAt': e.createdAt,
        'updatedAt': e.updatedAt,
        'addresses':''
      }; 
      
      e.address.map((el,i) => {
        elem['addresses'] += `${el.street} ${el.city} ${el.country}  Lat: ${el.latitude} Long: ${el.longitude} | `
      }) 
      return elem;
    })
    if(companies.length == 0) {
      elem.push({
        'id': e._id,
        'name': e.name, 
        'phone': e.phone,
        'description': e.description,
        'imageURL': e.imageURL,
        'url': e.url,
        'currency': e.currency,
        'accountId': e.accountId,
        'deliveryTime': e.deliveryTime,
        'createdAt': e.createdAt,
        'updatedAt': e.updatedAt,
        'addresses':''
      })
    }
    let abc = json2csv.parse(companies);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="restaurant_report.csv"`
    });

   res.end(abc);
    
  }
  catch (err) {
    res.statusCode = 500;
    console.log(err);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.put("/update/restaurant", authZ("restaurant"), async (req, res) => {
  try {
    const restaurantRep = new Restaurant();
    const nameExsist = await restaurantRep.findRestaurantByName(req.body.restaurant.name);
    const exsist = await restaurantRep.getRestaurantById(req.user.companyId);
    const restaurant = req.body.restaurant;
    if (exsist) {
      if (!nameExsist) {
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: 'eu-central-1',
          signatureVersion: 'v4'
        });
        console.log(exsist);
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: new URL(exsist.imageURL).pathname.replace('/','')
        };

        const s3Bucket = new AWS.S3({
          signatureVersion: 'v4'
        });

        if (req.body.restaurant.logo || req.body.restaurant.cover) {    
          AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: 'eu-central-1',
            signatureVersion: 'v4'
          });

          const s3Bucket = new AWS.S3({
            signatureVersion: 'v4'
          });

          await uploadImageToS3("logo", req.body.restaurant.logo, restaurant, s3Bucket);
          await uploadImageToS3("cover", req.body.restaurant.cover, restaurant, s3Bucket);
        }
      
        await restaurantRep.update(req.user.companyId, restaurant);
        return res.status(200).json({
          status: "Sukses",
          message: "Informatat e restaurantit u ndryshuan me sukses"
        }); 
      } else {
        res.statusCode = 404
        return res.json({
          status: "Dështuar",
          error: "Restauranti me këtë emer ekziston"
        });
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Restauranti nuk ekziston"
      });
    }
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: error.message
    });
  }
});

router.put("/update/:id", authZ("admin", "restaurant"), async (req, res) => {
  try {
    const restaurantRep = new Restaurant();
    let nameExsist = await restaurantRep.findRestaurantByName(req.body.restaurant.name);
    let exsist = await restaurantRep.getRestaurantById(req.params.id);
    let restaurant = req.body.restaurant;
    if(exsist) {
      if (!nameExsist) {
        let accountRep = new Account();
        let accountFound = await accountRep.getAccountByEmail(req.body.user.email);
        if (req.body.user.email != exsist.account.email && accountFound != null ) {
          res.statusCode = 500;
          return res.json({
            status: "Dështuar",
            error: "Përdoruesi me këtë email ekziston"
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

        if (restaurant.logo && restaurant.logo.startsWith("data:image/")) {
          await deleteImageFromS3(exsist.imageURL);
          await uploadImageToS3("imageURL", restaurant.logo, restaurant, s3Bucket);
        }
        if (restaurant.cover && restaurant.cover.startsWith("data:image/")) {
          await deleteImageFromS3(exsist.coverURL);
          await uploadImageToS3("coverURL", restaurant.cover, restaurant, s3Bucket);
        }

        if(req.body.user) {
          const objToSave = {
            email: req.body.user.email,
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
          };
  
          await accountRep.updateCompanyInfo(exsist.accountId,objToSave);
        }
        
        await restaurantRep.update(req.params.id, restaurant);

        const companyCategoryRepo = new CompanyCategory();
        const found = await companyCategoryRepo.findByCompanyId(req.params.id);
        if (found.length) {
          await companyCategoryRepo.updateCompanyCategory(req.params.id, req.body.categoryId);
        } else {
          await companyCategoryRepo.createOne(req.params.id, req.body.categoryId);
        }

        return res.status(200).json({
          status: "Sukses",
          message: "Informatat e restaurantit u ndryshuan me sukses"
        }); 
      } else {
        res.statusCode = 404
        return res.json({
          status: "Dështuar",
          error: "Restauranti me këtë emer ekziston"
        });
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Restauranti nuk ekziston"
      });
    }
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: error.message
    });
  }
});



router.put('/change-status/:id', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const restaurantRep = new Restaurant();
    const id = req.params.id;
    const accountRep = new AccountRepository();

    const result = await restaurantRep.getRestaurantById(id);

    if (result != null) {
      await restaurantRep.changeRestaurantStatus(id, req.body.status);
      // await accountRep.changeAccountStatus(result.accountId, req.body.status);

      return res.status(200).json({
        status: 'Sukses',
        message: 'Statusi i restauranti ndryshua me sukses'
      });
    } else return res.status(400).json({ status: 'Gabim', message: 'Restauranti nuk ekzsiton'});
  } catch (err) {
    res.statusCode = 500
    return res.json({ status: 'Dështoj', message: 'Gabim në server' });
  }
});

router.delete("/delete/:id",  authZ("admin"), async (req, res) => {
  try {
    const restaurantRep = new Restaurant();
    let id = req.params.id;
    let accountRep = new AccountRepository();
    let orders = new Order();
    let orderCount = await orders.getOrdersCountOfCompany(id);
    let result = await restaurantRep.getRestaurantById(id);
    const product = new Product();
    const productCount = await product.getCountOfProductsOfCompany(id);

    if(result) {
      if ( orderCount === 0 ) {
        if (productCount > 0) {
          return res.status(400).json({status: 'Gabim', error: 'Restauranti nuk mund te fshihet sepse ka produkte'});
        }
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: 'eu-central-1',
          signatureVersion: 'v4'
        });

        if (result.imageURL) {
          await deleteImageFromS3(result.imageURL);
        }
        if (result.coverURL) {
          await deleteImageFromS3(result.coverURL);
        }

        await restaurantRep.deleteRestaurant(id);
        await accountRep.deleteAccount(result.accountId);

        return res.status(200).json({
          status: 'Sukses',
          message: 'Kompania është fshirë me sukses'
        });
      } else {
        return res.status(400).json({status: 'Gabim', error: 'Restauranti nuk mund te fshihet sepse ka porosi'});
      }
    } else
      return res.status(400).json({ status: 'Gabim', error: 'Restauranti nuk ekzsiton' });
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({status: 'Dështoj', error: 'Gabim në server'});
  }
});

router.get('/countTotal', authZ('admin'), async function (req, res) {
  try {
    const restaurantRep = new Restaurant();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await restaurantRep.countTotalRestaurant(country, city);
    return res.json({
      status: 'Sukses',
      count: count
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/countActive', authZ('admin'), async function (req, res) {
  try {
    const restaurantRep = new Restaurant();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await restaurantRep.countActiveRestaurant(country, city);
    return res.json({
      status: 'Sukses',
      count: count
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});

router.get('/countInactive', authZ('admin'), async function (req, res) {
  try {
    const restaurantRep = new Restaurant();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await restaurantRep.countInactiveRestaurant(country, city);
    return res.json({
      status: 'Sukses',
      count: count
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});
router.get('/all', authZ('admin'), async(req, res) => {
  try {
    const restaurantRep = new Restaurant();

    const cityQuery = req.query.city;
    const countryQuery = req.query.country || req.query.country;

    const city = req.user.city;
    const country = req.user.country;

    const count = await restaurantRep.getAllRestaurant(country || countryQuery, city || cityQuery);
    return res.json({
      status: 'Sukses',
      restuarants: count
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({status: 'Dështoj', message: 'Gabim në server'});
  }
})

router.get("/:id", authZ("admin", "restaurant"), async(req, res) => {
  try {
    const restaurantRep = new Restaurant();
    const companyFound = await restaurantRep.getRestaurantById(req.params.id);
    return res.json({
      status: 'Sukses',
      restuarants: companyFound
    })
  } catch (err) {
    res.statusCode = 500;
    return res.json({status: 'Dështoj', message: 'Gabim në server'});
  }
});

router.get("/mapped-subcategories/:id", authZ("admin"), async(req, res) => {
  try {
    const mapSubcategoryRepo = new MapSubcategory();

    const mappedData = await mapSubcategoryRepo.getMapingByCompany(req.params.id);
    return res.json({
      status: 'Sukses',
      data: mappedData
    })
  } catch (err) {
    res.statusCode = 500;
    return res.json({status: 'Dështoj', message: 'Gabim në server'});
  }
});

router.post("/mapped-subcategories/:id", authZ("admin"), async(req, res) => {
  try {
    const mapSubcategoryRepo = new MapSubcategory();

    const companyId = req.params.id;
    const mappedData = req.body;

    const existingMappedData = await mapSubcategoryRepo.getMapingByCompany(req.params.id);
    let existingIDs = existingMappedData.map(obj => {
      return obj._id;
    })
    let updatedIDs = [];

    for (let item of mappedData) {
      let itemFound = false;
      if (item._id != '') {
        itemFound = await mapSubcategoryRepo.getMappingById(item._id);
      }

      if (itemFound) {
        const data = {
          ...item,
          companyId: companyId
        };
        await mapSubcategoryRepo.updateItem(item._id, data);
        updatedIDs.push(item._id);
      } else {
        let data = {
          ...item,
          companyId: companyId
        };
        delete data._id;
        await mapSubcategoryRepo.createItem(data);
      }
    }

    let difference = existingIDs.filter(x => updatedIDs.indexOf(String(x)) === -1);
    for (let deleteItem of difference) {
      await mapSubcategoryRepo.delete(deleteItem);
    }

    return res.json({
      status: 'Sukses',
    })
  } catch (err) {
    res.statusCode = 500;
    return res.json({status: 'Dështoj', message: 'Gabim në server'});
  }
});

module.exports = router;
