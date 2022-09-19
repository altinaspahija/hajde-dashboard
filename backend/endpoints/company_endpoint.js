const express = require("express");
const router = express.Router();

const AccountRepository = require("../data_access/account_repository");
const Account = require("../data_access/account_repository");
const Company = require("../data_access/company_repository");
const Categories = require('../data_access/product_category_repository');
const CompanyCategory = require('../data_access/company_category_repository');
const Order = require("../data_access/order_repository");
const Product = require('../data_access/product_repository');
const AWS = require('aws-sdk');
const MapSubcategory = require('../data_access/map_subcategories_categories');

const authZ = require("../middlewares/authorization");
require('dotenv').config();
const json2csv = require('json2csv');
const {uploadImageToS3, deleteImageFromS3} = require("../utilities/s3Utils");

/**
 * Create company
 */
router.post("/create",  authZ("admin"), async (req, res) => {
  try {
    const companyRep = new Company();
    const categoriesRep = new Categories();
    const CompanyCategoryRep = new CompanyCategory(); 
    const exsist = await companyRep.findCompanyByName(req.body.company.company);
    const company = req.body.company;
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

      await uploadImageToS3("logo", req.body.company.logo, company, s3Bucket);
      await uploadImageToS3("cover", req.body.company.cover, company, s3Bucket);

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
        role: 'company',
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        password: req.body.user.password
      };

      let companyAccount = await accountRep.createAccount(objToSave);
      company['accountId'] = companyAccount._id
      let compId = await companyRep.createCompany(company);
      
      const cats = await categoriesRep.getAllCategories(company.phone.includes("+383") ? 'Kosovë' : 'Shqiperië');
      const castTBA = [];
      for(let cat of cats) {
        castTBA.push({
          "companyId" : compId,
          "categoryId" : cat._id,
          "isActive" : true
        });
      }

      await CompanyCategoryRep.addTheCategories(castTBA)
      return res.status(200).json({
        status: "Sukses",
        message: "Kompania u krijua me sukses"
      });
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Kompania ekziston"
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

/**
 * List all the companies
 */
router.get("/list", authZ("admin"), async function (req, res) {
  try {
    const hostCompRep = new Company();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let name = req.query.name;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status == "true" : undefined;
    let result = await hostCompRep.listAllPaginate(page, 15, name, status, country, city);
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

/**
 * Export company list to CSV
 */
router.post("/export-list", authZ("admin"), async function (req, res) {
  try {
    const hostCompRep = new Company();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let name = req.query.name;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status == "true" : undefined;
    let result = await hostCompRep.listAllExport(page, 15, name, status, country, city);
    let elem = [];
    let companies = result.companies.map(e => {
    elem = {
        company: e.company, 
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
        id: e._id,
        company: e.company, 
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
      'Content-disposition': `attachment; filename="orders_report.csv"`
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

/**
 * Update company
 */
router.put("/update/company", authZ("company"), async (req, res) => {
  try {
    const companyRep = new Company();
    const nameExsist = await companyRep.findCompanyByName(req.body.company.name);
    const exsist = await companyRep.getCompanyById(req.user.companyId);
    const company = req.body.company;
    if (exsist) {
      if (!nameExsist) {
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: 'eu-central-1',
          signatureVersion: 'v4'
        });

        const s3Bucket = new AWS.S3({
          signatureVersion: 'v4'
        });

        if (company.urlImage) {
          await deleteImageFromS3(exsist.imageURL);
          await uploadImageToS3("imageURL", company.urlImage, company, s3Bucket);
        }
        if (company.urlCover) {
          await deleteImageFromS3(exsist.coverURL);
          await uploadImageToS3("coverURL", company.urlCover, company, s3Bucket);
        }

        await companyRep.update(req.user.companyId, company);
        return res.status(200).json({
          status: "Sukses",
          message: "Informatat e kompanisë u ndryshuan me sukses"
        }); 
      } else {
        res.statusCode = 404
        return res.json({
          status: "Dështuar",
          error: "Kompania me këtë emer ekziston"
        });
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Kompania nuk ekziston"
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

/**
 * Update company by id
 */
router.put("/update/:id", authZ("admin"), async (req, res) => {
  try {
    let companyRep = new Company();
    let nameExsist = await companyRep.findCompanyByName(req.body.company.name);
    let exsist = await companyRep.getCompanyById(req.params.id);
    let company = req.body.company;
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

        if (company.urlImage && company.urlImage.startsWith('data:')) {
          await deleteImageFromS3(exsist.imageURL);
          await uploadImageToS3("imageURL", company.urlImage, company, s3Bucket);
        }
        if (company.urlCover && company.urlCover.startsWith('data:')) {
          await deleteImageFromS3(exsist.coverURL);
          await uploadImageToS3("coverURL", company.urlCover, company, s3Bucket);
        }

        const objToSave = {
          email: req.body.user.email,
          firstName: req.body.user.firstName,
          lastName: req.body.user.lastName,
        };

        await accountRep.updateCompanyInfo(exsist.accountId,objToSave);
        await companyRep.update(req.params.id, company);
        return res.status(200).json({
          status: "Sukses",
          message: "Informatat e kompanisë u ndryshuan me sukses"
        }); 
      } else {
        res.statusCode = 404
        return res.json({
          status: "Dështuar",
          error: "Kompania me këtë emer ekziston"
        });
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: "Dështuar",
        error: "Kompania nuk ekziston"
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


/**
 * Change company status
 */
router.put('/change-status/:id', authZ('admin', 'company'), async (req, res) => {
  try {
    const hostCompRep = new Company();
    const id = req.params.id;
    const accountRep = new AccountRepository();

    const result = await hostCompRep.getCompanyById(id);

    if (result != null) {
      await hostCompRep.changeCompanyStatus(id, req.body.status);
      // await accountRep.changeAccountStatus(result.accountId, req.body.status);

      return res.status(200).json({
        status: 'Sukses',
        message: 'Statusi i kompanisë ndryshua me sukses'
      });
    } else return res.status(400).json({ status: 'Gabim', message: 'Kompania nuk ekzsiton'});
  } catch (err) {
    res.statusCode = 500
    return res.json({ status: 'Dështoj', message: 'Gabim në server' });
  }
});

/**
 * Delete company
 */
router.delete("/delete/:id",  authZ("admin"), async (req, res) => {
  try {
    let hostCompRep = new Company();
    let id = req.params.id;
    let accountRep = new AccountRepository();
    let orders = new Order();
    let orderCount = await orders.getOrdersCountOfCompany(id);
    let result = await hostCompRep.getCompanyById(id);
    const product = new Product();
    const productCount = await product.getCountOfProductsOfCompany(id);

    if(result) {
      if ( orderCount === 0 ) {
        if (productCount > 0) {
          return res.status(400).json({status: 'Gabim', error: 'Kompania nuk mund te fshihet sepse ka produkte'});
        }

        await deleteImageFromS3(result.imageURL);
        await deleteImageFromS3(result.coverURL);

        await hostCompRep.deleteCompany(id);
        await accountRep.deleteAccount(result.accountId);

        return res.status(200).json({
          status: 'Sukses',
          message: 'Kompania është fshirë me sukses'
        });
      } else {
        return res.status(400).json({status: 'Gabim', error: 'Kompania nuk mund te fshihet sepse ka porosi'});
      }
    } else
      return res.status(400).json({ status: 'Gabim', error: 'Kompania nuk ekzsiton' });
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({status: 'Dështoj', error: 'Gabim në server'});
  }
});

/**
 * Get total companies count
 */
router.get('/countTotal', authZ('admin'), async function (req, res) {
  try {
    const companyRep = new Company();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await companyRep.countTotalCompany(country, city);
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

/**
 * Get active companies count
 */
router.get('/countActive', authZ('admin'), async function (req, res) {
  try {
    const companyRep = new Company();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await companyRep.countActiveCompany(country, city);
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

/**
 * Get inactive companies count
 */
router.get('/countInactive', authZ('admin'), async function (req, res) {
  try {
    const companyRep = new Company();
    
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await companyRep.countInactiveCompany(country, city);
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

/**
 * Get all companies
 */
router.get('/all', authZ('admin'), async(req, res) => {
  try {
    const companyRep = new Company();

    const cityQuery = req.query.city;
    const countryQuery = req.query.country || req.query.country;

    const city = req.user.city;
    const country = req.user.country;

    const count = await companyRep.getAllCompanies(country || countryQuery, city || cityQuery);
    return res.json({
      status: 'Sukses',
      companies: count
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json({status: 'Dështoj', message: 'Gabim në server'});
  }
})

/**
 * Get company by id
 */
router.get("/:id", authZ("admin", "company"), async(req, res) => {
  try {
    const companyRep = new Company();
    const companyFound = await companyRep.getCompanyById(req.params.id);
    return res.json({
      status: 'Sukses',
      company: companyFound
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
        itemFound = await mapSubcategoryRepo.getMappingById(item._id, companyId);
      }

      if (itemFound && itemFound.length > 0) {
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
