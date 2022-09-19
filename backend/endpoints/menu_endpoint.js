const express = require('express');
const router =  express.Router();
const Menu  = require('../data_access/menu_repository');
const Restaurant = require('../data_access/restaurant_repository');
const importer = require('../importer/importer');
const Order = require('../data_access/order_repository');
const json2csv = require('json2csv');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { google } = require('googleapis')
const privatekey = require('../service_keys/service_key.json');
const uuid = require('uuid');
const authZ = require('../middlewares/authorization');
const ProductCategory  = require('../data_access/product_category_repository');
const CompanyCategory = require("../data_access/company_category_repository");

router.post('/import', authZ('restaurant'), async (req, res) => {
  try {
    if (!req.body.sheetUrl) throw new Error('Nuk e keni shtypur linkun e sheet-it');
    const data = await importer(req.body, req.user.companyId);
    const product = new Menu();
    const orderRepo = new Order();
    
    const currentProducts = await (await product.listAll(req.user.companyId)).products;
    const ids = data.map(i => i.productCode);
    const productsTBD = [];
    for (const currentProduct of currentProducts) {
      if (!ids.includes(currentProduct.productCode)) {
        const order = await orderRepo.findOrdersOfProduct(currentProduct._id);
        if (order.length > 1) {
          productsTBD.push({
            productId: currentProduct._id,
            outOfStock: true,
            restaurantId: currentProduct.restaurantId
          });
        } else {
          productsTBD.push({
            productId: currentProduct._id,
            restaurantId: currentProduct.restaurantId
          });
        }
      }
    }
    await product.insertAll(data, productsTBD);
    res.json({
      success: true,
      message: 'Importing completed'
    });
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
});

router.post('/import/:restaurantId', authZ('admin'), async (req, res) => {
  try {
    if (!req.body.sheetUrl) throw new Error('Nuk e keni shtypur linkun e sheet-it');
    const data = await importer(req.body, req.params.restaurantId);
    const product = new Menu();
    const orderRepo = new Order();
    
    const currentProducts = await (await product.listAll(req.params.restaurantId)).products;
    const ids = data.map(i => i.productCode);
    const productsTBD = [];
    for (const currentProduct of currentProducts) {
      if (!ids.includes(currentProduct.productCode)) {
        const order = await orderRepo.findOrdersOfProduct(currentProduct._id);
        if (order.length > 1) {
          productsTBD.push({
            productId: currentProduct._id,
            outOfStock: true
          });
        } else {
          productsTBD.push({
            productId: currentProduct._id
          });
        }
      }
    }
    await product.insertAll(data, productsTBD);
    res.json({
      success: true,
      message: 'Importing completed'
    });
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
});

router.post('/create', authZ('restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const productFound = await product.getProductByProductCode(req.body.productCode);
    const restaurant = new Restaurant();
    let currentCompany = await restaurant.getRestaurantById(req.user.companyId);
  
    console.log(currentCompany);
    
    if (currentCompany.currency) {
      if (!productFound) {
        const data = {
          ...req.body,
          restaurantId: req.user.companyId
        };
        await product.createProduct(data);
        res.json({
          status: 'Sukses',
          error: 'Produkti është shtuar me sukses'
        });
      } else {
        res.statusCode = 404;
        res.json({
          status: 'Dështuar',
          error: 'Produkti ekziston'
        });
      }
    } else {
      throw new Error('Për ta importuar produktet duhesh konfigurosh llojin  valutës');
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.put('/update/:id', authZ('restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const productFound = await product.getProductById(req.params.id);
    const productCodeFound = await product.getProductByProductCode(req.body.productCode);

    if (productFound) {
      if (!productCodeFound || productFound.productCode === req.body.productCode) {
        const data = {
          ...req.body,
          restaurantId: req.user.companyId
        };
        await product.update(req.params.id, data);
        res.json({
          status: 'Sukses',
          error: 'Produkti është shtuar me sukses'
        });
      } else {
        res.json({
          status: 'Dështuar',
          error: 'Produkti me këtë kod ekziston'
        });
      }
    } else {
      res.statusCode = 404;
      res.json({
        status: 'Dështuar',
        error: 'Produkti nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.post('/list-admin', authZ('admin'), async (req, res) => {
  try {
    const product = new Menu();
    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page;
    const name = req.query.name;
    const restaurantId = req.body.companyId;
    const productCode = req.query.productCode;
    const status = req.query.status;
    const result = await product.listAllPaginate(page, 15, restaurantId, name, productCode, status);
    return res.json(result);
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/list-admin-all/:id', authZ('admin'), async (req, res) => {
  try {
    const product = new Menu();
    const restaurantId = req.params.id;
    const result = await product.listAll(restaurantId);
    return res.json(result);
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.post('/export-list-admin/:id', authZ('admin'), async (req, res) => {
  try {
    const product = new Menu();
    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page;
    const name = req.query.name;
    const restaurantId = req.params.id;

    const status = req.query.status;
    const result = await product.listAll( restaurantId);
    const csvData = result.products.map(e => {
      return {
        "id": e._id,
        "productCode": e.productCode,
        "categoryId": e.categoryId,
        "restaurantId": e.restaurantId,
        "createdAt": e.createdAt,
        "description": e.description,
        "imageURL": e.imageURL,
        "isAvailable": e.isAvailable,
        "name": e.name,
        "price": e.price,
        "subcategoryId": e.subcategoryId,
        "unit": e.unit,
        "updatedAt": e.updatedAt,
      }
    })
    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });
    res.end(abc);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/list-company', authZ('restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page;
    const name = req.query.name;
    const status = req.query.status;
    const restaurantId = req.user.companyId;

    const productCode = req.query.productCode;
    const result = await product.listAllPaginate(page, 15, restaurantId, name, productCode, status);
    return res.json(result);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.post('/export-list-company', authZ('restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const restaurantId = req.user.companyId;
    const result = await product.listAll( restaurantId);
    const csvData = result.products.map(e => {
      return {
        "id": e._id,
        "productCode": e.productCode,
        "categoryId": e.categoryId,
        "restaurantId": e.restaurantId,
        "createdAt": e.createdAt,
        "description": e.description,
        "imageURL": e.imageURL,
        "isAvailable": e.isAvailable,
        "name": e.name,
        "price": e.price,
        "subcategoryId": e.subcategoryId,
        "unit": e.unit,
        "updatedAt": e.updatedAt,
      }
    })
    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });
    res.end(abc);
  } catch (error) {
    console.log(error)
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get("/list-all/:restaurantId", authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const products = await product.listAll(req.params.restaurantId);

    res.json({
      success:true,
      products
    });    
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.delete('/delete/:id', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const productFound = await product.getProductByIdWithouLookup(req.params.id);
    if (productFound) {
      const order = new Order();
      const orderFound = await order.findOrdersOfProduct(req.params.id, productFound.restaurantId);
      if (orderFound.length > 0) {
        res.statusCode = 500;
        return res.json({
          status: 'Dështuar',
          error: 'Nuk mundeni ta fshini produktin sepse ekziston me një porosi!'
        });
      }

      await product.delete(req.params.id);
      res.json({
        status: 'Sukses',
        message: 'Produkti është fshirë me suksese'
      });
    } else {
      res.statusCode = 404;
      res.json({
        status: 'Dështuar',
        error: 'Produkti nuk ekziston'
      });
    }
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/getCountOfCompany/:id', authZ('admin', 'company', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const countOfProducts = await product.getCountOfProductsOfCompany(req.params.id);
    res.json({
      status: 'Sukses',
      count: countOfProducts
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/getCountAll', authZ('admin', 'company', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const countOfProducts = await product.getCountOfProducts();
    res.json({
      status: 'Sukses',
      count: countOfProducts
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.get('/:id', authZ('admin', 'company', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const restaurant = new Restaurant();
    let productFound;
    console.log(req.user.role)
    if(req.user.role == "company") {
       productFound = await product.getProductById(req.params.id);
    } else if(req.user.role == "restaurant")  {
      productFound = await product.getProductResById(req.params.id);
    } else {
      let prod = await product.getProductByIdWithouLookup(req.params.id);
      const rest = await restaurant.getRestaurantById(prod.restaurantId);

      if(rest) {
        productFound = await product.getProductResById(req.params.id);
      } else {
        productFound = await product.getProductById(req.params.id);
      }
    }
    if (productFound) {
      res.json({
        status: 'Sukses',
        product: productFound
      });
    } else {
      res.statusCode = 404;
      res.json({
        status: 'Dështuar',
        error: 'Produkti nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.put('/:id/changeStatus', authZ('admin', 'company', 'restaurant'), async (req, res) => {
  try {
    const product = new Menu();
    const productFound = await product.getProductById(req.params.id);
    if (productFound) {
      await product.updateStatus(req.params.id, req.body.status);
      res.json({
        status: 'Sukses',
        product: productFound
      });
    } else {
      res.statusCode = 404;
      res.json({
        status: 'Dështuar',
        error: 'Produkti nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.post('/generate-google-sheet', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const doc = new  GoogleSpreadsheet();
    await doc.useServiceAccountAuth({
      client_email: privatekey.client_email,
      private_key: privatekey.private_key
    });

    await doc.createNewSpreadsheetDocument({ title: `GeneratedTemplate_${uuid.v1()}`});
    
    const jwtClient = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    );

    const drive = new google.drive({version: 'v3', auth:jwtClient});
    await drive.permissions.create({
      resource: {
        type:'anyone',
        role:'writer'
      },
      fileId:doc.spreadsheetId,
      fields: 'id'
    });
    doc.sheetsById[1]
    const sheet = doc.sheetsById[0];
    await sheet.setHeaderRow(['productCode','name','price','description','imageURL', 'unit','Category code','Group code'])
    const row  = await sheet.addRow({
        'productCode':'-',
        'name':'-',
        'price':'-',
        'description':'-',
        'imageURL':'-',
        'unit':'-',
        'Category code': '-',
        'Group code': '-'
      });

    await row.save()
  
    res.json({
      spreadsheetUrl:`https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}`
    })
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

router.put('/make-recommend/:id',   authZ('admin', 'restaurant'), async (req, res) => {
   try {
    const product = new Menu();
    const productFound = await product.getProductById(req.params.id);
    if (productFound) {
      await product.makeRecommended(req.params.id, req.body.recommend)
      res.json({
        status: 'Sukses',
        product: productFound
      });
    } else {
      res.statusCode = 404;
      res.json({
        status: 'Dështuar',
        error: 'Produkti nuk ekziston'
      });
    }
   } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
   }
})

router.post('/get-products', authZ('restaurant'), async (req, res) => {
  try {
    const companyCategoryRepo = new CompanyCategory();
    const restaurantRepo = new Restaurant();
    const menuRepo = new Menu();

    const restaurant = await restaurantRepo.getRestaurantById(req.user.companyId);
    const products = await menuRepo.listAll(restaurant._id);
    const categories = await companyCategoryRepo.getAllCategoriesOfCompany(restaurant._id);

    res.json({
      success: true,
      categories: categories,
      products: products.products,
    });
  } catch (err) {
    console.log('err', err);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
});

router.post('/update-products', authZ('restaurant'), async (req, res) => {
  try {
    const products = req.body.products;
    const productRepo = new Menu();
    const restaurantId = req.user.companyId;

    let product;
    for (product of products) {
      const productFound = await productRepo.getProductById(product._id);

      if (productFound) {
        const data = {
          ...product,
          restaurantId: restaurantId
        };
        await productRepo.update(product._id, data);
      } else {
        const data = {
          ...product,
          restaurantId: restaurantId
        };
        await productRepo.createProduct(data);
      }
    }

    return res.json({
      status: 'Sukses',
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
});

module.exports = router;
 