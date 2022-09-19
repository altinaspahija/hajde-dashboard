const express = require("express");
const { datacatalog, auth } = require("googleapis/build/src/apis/datacatalog");
const router = express.Router();
const Order = require("../data_access/order_repository");
const Product = require("../data_access/product_repository");
const Company = require("../data_access/company_repository");
const Restaurant = require('../data_access/restaurant_repository');
const Client = require("../data_access/client_repository");
const authZ = require("../middlewares/authorization");
const Menu = require('../data_access/menu_repository');
const json2csv = require('json2csv');
const UserToOffer = require('../data_access/userToOffer_repository'); 
const Offer = require("../data_access/offer_repository");
var ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const MenuRepository = require("../data_access/menu_repository");
const mongoose = require('mongoose');
const maskNumber = require("../utilities/numberUtils");

const { pushNotification } = require("../utilities/notification");

const dateInPast = function(firstDate, secondDate) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }

  return false;
};

router.get("/list", authZ("admin"), async function (req, res) {
  try {
    const order = new Order();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let courier = req.query.courier;
    let company = req.query.company;
    let orderNumber = req.query.orderNumber;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let clietName = req.query.clientName;
    let result = await order.listAllPaginate(page, 15,orderNumber, status, courier, company, fromDate, toDate, clietName, country, city);
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

    const city = req.user.city;
    const country = req.user.country;

    const order = new Order();
    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let courier = req.query.courier;
    let company = req.query.company;
    let orderNumber = req.query.orderNumber;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let clietName = req.query.clientName;
    let result = await order.listAllExport(page, 15,orderNumber, status, courier, company, fromDate, toDate, clietName, country, city);
    let csvData = result.orders.map(e => {

      let orderDate = "";
      let lastUpdate = "";
      let estimatedArrival = "";

      if (e.orderDate) {
        orderDate = moment(e.orderDate).format('DD-MM-YYYY HH:mm');
      }

      if (e.lastUpdate) {
        lastUpdate = moment(e.lastUpdate).format('DD-MM-YYYY HH:mm');
      }

      if (e.estimatedArrival) {
        estimatedArrival = moment(e.estimatedArrival).format('DD-MM-YYYY HH:mm');
      }

      return {
        "orderNumber": e.orderNumber,
        'receiver_firstName': e.receiver.firstName,
        'receiver_lastName': e.receiver.lastName,
        'receiver_phone': e.receiver.phone,
        'receiver_address_country': e.address.country,
        'receiver_address_city': e.address.city,
        'receiver_address_stree:': e.address.street,
        'receiver_address_longitude': e.address.longitude,
        'receiver_address_latitude': e.address.latitude,
        'courier_name': e.courier.name,
        'courier_phone': e.courier.phone,
        'supplier_name': e.supplier.name,
        'status': e.status,
        'total': e.total,
        'discount': e.discount,
        'transport': e.transport,
        'currency': e.currency,
        'orderDate': orderDate,
        'lastUpdate': lastUpdate,
        'estimatedArrival': estimatedArrival,
        'clientComment': e.clientComment,
        'courierComment': e.courierComment,
        'issue': e.issue,
      }
    })
    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="orders_report.csv"`
    });

   res.end(abc);
     
  }
  catch (err) {
    console.log(err);
    res.statusCode = 500;

    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/list-company", authZ("company", "restaurant"), async function (req, res) {
  try {
    const order = new Order();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let courier = req.query.courier;
    let companyId = req.user.companyId;
    let orderNumber = req.query.orderNumber;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    let result = await order.listAllPaginateCompany(companyId,page, 15,orderNumber,status, courier, fromDate, toDate, country, city);
    
    for(const order of result.orders) {
      order.orderNumber = maskNumber(order.orderNumber, 3);  
    }
    
    return res.json(result);
  }
  catch (err) { 
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/export-list-company", authZ("company", "restaurant"), async function (req, res) {
  try {
    const order = new Order();

    const city = req.user.city;
    const country = req.user.country;

    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let courier = req.query.courier;
    let companyId = req.user.companyId;
    let orderNumber = req.query.orderNumber;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    let result = await order.listAllExportCompany(companyId,page, 15,orderNumber,status, courier, fromDate, toDate, country, city);
    
    let csvData = result.orders.map(e => {
      return {
        "orderNumber": e.orderNumber,
        'courier_phone': e.courier.phone,
        'supplier_name': e.supplier.name,
        'status': e.status,
        'total': e.total,
        'currency': e.currency,
        'orderDate': e.orderDate,
        'lastUpdate': e.lastUpdate,
        'estimatedArrival': e.estimatedArrival,
        'clientComment': e.clientComment,
        'courierComment': e.courierComment,
        'issue': e.issue,
      }
    })
    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="orders_report.csv"`
    });

   res.end(abc);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/count/company", authZ("company", "admin", "restaurant"), async (req, res) => {
    try {
      let orderRep = new Order();

      let count = await orderRep.getOrdersCountOfCompany(req.user.companyId);
      return res.json({
        status:"Sukses",
        count:count
      });
    } catch(error) {
      res.statusCode = 500;
      return res.json({
        status: "Dështuar",
        error: "Gabim në server"
      });
    }
});

router.get("/count/company/:id", authZ("company", "admin", "restaurant"), async (req, res) => {
  try {
    let orderRep = new Order();
    let count = await orderRep.getOrdersCountOfCompany(req.params.id);
    return res.json({
      status:"Sukses",
      count:count
    });
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/count/all", authZ("admin"), async (req, res) => {
  try {
    let orderRep = new Order();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    let count = await orderRep.getOrdersCount(country, city);
    return res.json({
      status:"Sukses",
      count:count
    });
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/revenue/all", authZ("admin"), async (req, res) => {
  try {
    
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let revenueData = await orderRep.getTotalRevenue(fromDate, toDate, country, city);
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/revenue/all/eur", authZ("admin"), async (req, res) => {
  try {
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let revenueData = await orderRep.getTotalRevenueEur(fromDate, toDate, country, city);
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/revenue/company", authZ("company", "restaurant"), async (req, res) => {
  try {

    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
   
    let revenueData = await orderRep.getCompanyTotalRevenue(req.user.companyId, fromDate, toDate);
    
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
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

router.get("/revenue/company/:id", authZ("company", 'admin', "restaurant"), async (req, res) => {
  try {
    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let revenueData = await orderRep.getCompanyTotalRevenue(req.params.id, fromDate, toDate);
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/revenue/courier/:id", authZ("admin"), async (req, res) => {
  try {
    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let revenueData = await orderRep.getCourierTotalRevenue(req.params.id, fromDate, toDate);
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/revenue/courier/eur/:id", authZ("admin"), async (req, res) => {
  try {
    let orderRep = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let revenueData = await orderRep.getCourierTotalRevenueEur(req.params.id, fromDate, toDate);
    if(revenueData.length > 0) {
      return res.json({
        status:"Sukses",
        revenue:revenueData[0].totalSum
      });
    } else {
      return res.json({
        status:"Sukses",
        revenue: 0
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get('/countAllTotal', authZ('admin'), async function (req, res) {
  try {
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    const count = await order.countOrderAllTotal(fromDate, toDate, country, city);
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

router.get('/countCompanyTotal', authZ('company', "restaurant"), async function (req, res) {
  try {
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyTotal(req.user.companyId, fromDate, toDate, country, city);
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

router.get('/countCompanyTotal/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyTotal(req.params.id, fromDate, toDate);
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

router.get('/countCourierTotal/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierTotal(req.params.id, fromDate, toDate);
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

router.get('/countAllInProgress', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const country = req.user.country || req.query.country;
    const city = req.user.city;
    const count = await order.countOrderAllInProgess(fromDate, toDate, country, city);
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

router.get('/countCompanyInProgress', authZ('company', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyInProgess(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyInProgress/:id', authZ('company',"admin", "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyInProgess(req.params.id, fromDate, toDate);
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

router.get('/countCourierInProgress/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierInProgess(req.params.id, fromDate, toDate);
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

router.get('/countAllCompleted', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const country = req.query.country || req.query.country;

    const count = await order.countOrderAllCompleted(fromDate, toDate, country);
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

router.get('/countCompanyCompleted', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyCompleted(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyCompleted/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyCompleted(req.params.id, fromDate, toDate);
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

router.get('/countCourierCompleted/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierCompleted(req.params.id, fromDate, toDate);
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

router.get('/countAllIssue', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const country = req.query.country || req.query.country;

    const count = await order.countOrderAllIssue(fromDate, toDate, country);
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

router.get('/countCompanyIssue', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyIssue(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyIssue/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyIssue(req.params.id, fromDate, toDate);
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

router.get('/countCourierIssue/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierIssue(req.params.id, fromDate, toDate);
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

router.get('/countAllRejected', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    
    const city = req.user.city;
    const country = req.user.country || req.query.country;;

    const count = await order.countOrderAllRejected(fromDate, toDate, country, city);
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

router.get('/countCompanyRejected', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyRejected(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyRejected/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyRejected(req.params.id, fromDate, toDate);
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

router.get('/countCourierRejected/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierRejected(req.params.id, fromDate, toDate);
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

router.get('/countAllPending', authZ('admin'), async function (req, res) {
  try {
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const order = new Order();
    const country = req.user.country || req.query.country;
    const count = await order.countOrderAllPending(fromDate, toDate, country);
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

router.get('/countCompanyPending', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyPending(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyPending/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyPending(req.params.id, fromDate, toDate);
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

router.get('/countCourierPending/:id', authZ('admin'), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierPending(req.params.id, fromDate, toDate);
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

router.get('/countAllCancelled', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const country = req.query.country || req.query.country;
    const city = req.query.city;

    const count = await order.countOrderAllCancelled(fromDate, toDate, country, city);
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

router.get('/countCompanyCancelled', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyCancelled(req.user.companyId, fromDate, toDate);
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

router.get('/countCompanyCancelled/:id', authZ('company', 'admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    const count = await order.countOrderCompanyCancelled(req.params.id, fromDate, toDate);
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

router.get('/countCourierCancelled/:id', authZ('admin', "restaurant"), async function (req, res) {
  try {
    const order = new Order();
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const count = await order.countOrderCourierCancelled(req.params.id, fromDate, toDate);
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

router.put('/reject/:id', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const order = new Order();
    const client = new Client();
    const orderFound = await order.getOrderById(req.params.id);
    if (orderFound) {
      if (req.user.role !== "admin") {
        if (orderFound.status !== 'PENDING') {
          res.statusCode = 500;
          return res.json({
            status: 'Dështuar',
            error: 'Porosia që e keni zgjehdur ta refuzoni duhet jetë në statusin "Në pritje"'
          });
        }
      }

      try {
        const phone = orderFound.receiver.phone;
        const status = "ISSUE";
        const description = getStatusDescription(status);
  
        const tokens = await client.getTokensByPhone(phone);
  
        await pushNotification(phone, tokens, "Hajde", description);
      } catch (error) {
        console.log(error); 
      }

      await order.rejectedOrder(req.params.id, req.body.issue);
      return res.json({
      status: 'Sukses'
      });
    } else {
      res.statusCode = 404;
      return res.json({
        status: 'Dështuar',
        error: 'Porosia nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
});

router.put('/approve/:id', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const order = new Order();
    const client = new Client();

    const orderFound = await order.getOrderById(req.params.id);
    if (orderFound) {
      if (orderFound.status !== 'PENDING') {
        res.statusCode = 500;
        return res.json({
          status: 'Dështuar',
          error: 'Porosia që e keni zgjehdur ta aprovoni duhet jetë në statusin "Në pritje"'
        });
      }

      try {
        const phone = orderFound.receiver.phone;
        const status = "CONFIRM";
        const description = getStatusDescription(status);
  
        const tokens = await client.getTokensByPhone(phone);
  
        await pushNotification(phone, tokens, "Hajde", description);
      } catch (error) {
        console.log(error); 
      }

      await order.approveOrder(req.params.id);

      return res.json({
      status: 'Sukses'
      });
    } else {
      res.statusCode = 404;
      return res.json({
        status: 'Dështuar',
        error: 'Porosia nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
})

router.put('/ready/:id', authZ('admin', 'restaurant'), async (req, res) => {
  try {
    const order = new Order();
    const client = new Client();

    const orderFound = await order.getOrderById(req.params.id);
    if (orderFound) {
      if (orderFound.status !== 'CONFIRM') {
        res.statusCode = 500;
        return res.json({
          status: 'Dështuar',
          error: 'Porosia që e keni zgjehdur ta aprovoni duhet jetë në statusin "E konfirmuar"'
        });
      }

      try {
        const phone = orderFound.receiver.phone;
        const status = "READY";
        const description = getStatusDescription(status);
  
        const tokens = await client.getTokensByPhone(phone);
  
        await pushNotification(phone, tokens, "Hajde", description);
      } catch (error) {
        console.log(error); 
      }

      await order.readyOrder(req.params.id);

      return res.json({
      status: 'Sukses'
      });
    } else {
      res.statusCode = 404;
      return res.json({
        status: 'Dështuar',
        error: 'Porosia nuk ekziston'
      });
    }
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
})

router.get("/:id", authZ("admin","company", "restaurant"), async (req, res) => {
  try {
    let order = new Order();
    let orderFound = await order.getOrderById(req.params.id);
    console.log(orderFound)


    if(Object.keys(orderFound.products[0]).length == 0) {
      delete orderFound.products;
      orderFound.products = [];
     
    } 
    
    if(orderFound) {
      orderFound.orderNumber = maskNumber(orderFound.orderNumber, 3);  

      return res.json({
        status:"Sukses",
        order:orderFound
      });
    } else {
      return res.json({
        status:"Dështuar",
        error:"Porosia nuk ekziston"
    });
    }
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});


router.put("/:id/addProduct", authZ("admin", "restaurant"), async (req, res) => {
  try {
    let order = new Order();
    let product = new Product();
    let orderFound = await order.getOrderById(req.params.id);
    const menu = new Menu();
    if(orderFound) {
      if(orderFound.status === "PENDING" || orderFound.status === "IN_PROGRESS") {
        console.log("test =>",req.body)
        if(orderFound.type == "restaurant") {
          let productFound = await menu.getProductById(req.body.productId);
          console.log("test =>",productFound);
          if(productFound) {
             await order.addProduct(req.params.id, {...req.body, price: productFound.price, increaseValue: (productFound.price * req.body.quantity)});
             return res.json({
              status:"Sukses",
              message:"Produkti u shtua me suksese"
            });
          } else {
            res.statusCode = 404;
            return res.json({
              status:"Dështuar",
              error:"Produkti nuk ekziston"
          });
          }
        } else if(orderFound.type == "market") {
          let productFound = await product.getProductById(req.body.productId);
          if(productFound) {
             await order.addProduct(req.params.id, {...req.body, price: productFound.price, increaseValue: (productFound.price * req.body.quantity)});
             return res.json({
              status:"Sukses",
              message:"Produkti u shtua me suksese"
            });
          } else {
            res.statusCode = 404;
            return res.json({
              status:"Dështuar",
              error:"Produkti nuk ekziston"
          });
          }
        }
       
        

      } else {
        res.statusCode = 500;
        return res.json({
          status:"Dështuar",
          error:"Porosia duhet jetë në pritje ose në progress për ta shtuar një produkt"
      });
      }

    } else {
      res.statusCode = 404;
      return res.json({
        status:"Dështuar",
        error:"Porosia nuk ekziston"
    });
    }

  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

router.put("/:id/delete-typed-product", authZ("admin", 'restaurant'), async (req, res) => {
  try {
    let order = new Order();
    await order.deleteTypeProduct(req.params.id, req.body);
    return res.json({
      status:"Sukses",
      message:"Produkti u shtua me suksese"
    });
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get("/:id/get-specific-product/:productId", authZ("admin", 'company', "restaurant") , async (req, res)  => {
  try {
    let order = new Order();
    let product = await order.getSpecificProduct(req.params.id, req.params.productId);
    
    return res.json({
      status:"Sukses",
      message:"Produkti u shtua me suksese"
    });
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

router.delete("/:id/delete-specific-product/:productId", authZ("admin", 'restaurant'), async (req, res)  => {
  try {
    
    let order = new Order();
    let productData = await order.getSpecificProduct(req.params.id, req.params.productId);
    let product = productData[0].products[0];
    await order.removeProduct(req.params.id, {productId: product._id, decreaseValue: (product.price * product.quantity)});

    return res.json({
      status:"Sukses",
      message:"Produkti u shtua me suksese"
    });
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

router.put("/:id/update-specific-product/:productId", authZ("admin", 'restaurant'), async (req, res)  => {
  try {
    
    let order =  new Order();
    let productSrv = new Product();
    let menuSrv = new MenuRepository();
    let productData = await order.getSpecificProduct(req.params.id, req.params.productId);
    let product = productData[0].products[0];

    let productFound;
    if (req.body.supplierType === "market") {
      productFound = await productSrv.getProductById(req.body.productId);
    } else {
      productFound = await menuSrv.getProductById(req.body.productId);
    }

    if(product) {
      await order.updateProductinOrder(req.params.id,  req.params.productId, {
        productId: req.body.productId, 
        price: productFound.price, 
        quantity: req.body.quantity,
        oldPrice: product.price * product.quantity
      });

      return res.json({
        status:"Sukses",
        message:"Produkti u shtua me suksese"
      });
    } else {
      throw new Error("Produkti nuk u gjet !"); 
    }
    
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

router.post("/export-csv",  authZ("admin"), async(req, res) => {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    const city = req.user.city;
    const country = req.user.country;

    const countOrderAll = await order.countOrderAllTotal(fromDate, toDate, country, city);
    const countOrderAllInProgess = await order.countOrderAllInProgess(fromDate, toDate, country, city);
    const countOrderAllCompleted = await order.countOrderAllCompleted(fromDate, toDate, country, city);
    const countOrderAllIssue = await order.countOrderAllIssue(fromDate, toDate, country, city);
    const countOrderAllRejected = await order.countOrderAllRejected(fromDate, toDate, country, city);
    const countOrderAllPending = await order.countOrderAllPending(fromDate, toDate, country, city);
    const countOrderAllCancelled = await order.countOrderAllCancelled(fromDate, toDate, country, city);
    const revenueData = await order.getTotalRevenue(fromDate, toDate, country, city);
    const revenueDataEur = await order.getTotalRevenueEur(fromDate, toDate, country, city);

    let csvData = {
      "total_number_of_orders": countOrderAll,
      "total_number_of_orders_in_progress": countOrderAllInProgess,
      "total_number_of_orders_completed": countOrderAllCompleted,
      "total_number_of_orders_with_issue": countOrderAllIssue,
      "total_number_of_orders_rejected": countOrderAllRejected,
      "total_number_of_orders_in_pending": countOrderAllPending,
      "total_number_of_orders_in_cancelled": countOrderAllCancelled,
      "revenue_of_orders_in_leke": revenueData.length > 0 ? revenueData[0].totalSum: 0,
      "revenue_of_orders_in_euro": revenueDataEur.length > 0 ? revenueDataEur[0].totalSum : 0
    };

    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });

   res.end(abc);

  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/company/export-csv-withoutid", authZ("company", "restaurant"), async(req, res) => {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    const countOrderAll = await order.countOrderCompanyTotal(req.user.companyId, fromDate, toDate);
    const countOrderAllInProgess = await order.countOrderCompanyInProgess(req.user.companyId, fromDate, toDate);
    const countOrderAllCompleted = await order.countOrderCompanyCompleted(req.user.companyId, fromDate, toDate);
    const countOrderAllIssue = await order.countOrderCompanyIssue(req.user.companyId, fromDate, toDate);
    const countOrderAllRejected = await order.countOrderCompanyRejected(req.user.companyId, fromDate, toDate);
    const countOrderAllPending = await order.countOrderCompanyPending(req.user.companyId, fromDate, toDate);
    const countOrderAllCancelled = await order.countOrderCompanyCancelled(req.user.companyId, fromDate, toDate);
    const revenueData = await order.getCompanyTotalRevenue(req.user.companyId, fromDate, toDate);

    let csvData = {
      "total_number_of_orders": countOrderAll,
      "total_number_of_orders_in_progress": countOrderAllInProgess,
      "total_number_of_orders_completed": countOrderAllCompleted,
      "total_number_of_orders_with_issue": countOrderAllIssue,
      "total_number_of_orders_rejected": countOrderAllRejected,
      "total_number_of_orders_in_pending": countOrderAllPending,
      "total_number_of_orders_in_cancelled": countOrderAllCancelled,
      "revenue_of_orders_in_leke": revenueData.length > 0 ? revenueData[0].totalSum: 0
    };

    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });

   res.end(abc);

  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/company/export-csv/:id", authZ("admin"), async(req, res) => {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    const countOrderAll = await order.countOrderCompanyTotal(req.params.id, fromDate, toDate);
    const countOrderAllInProgess = await order.countOrderCompanyInProgess(req.params.id, fromDate, toDate);
    const countOrderAllCompleted = await order.countOrderCompanyCompleted(req.params.id, fromDate, toDate);
    const countOrderAllIssue = await order.countOrderCompanyIssue(req.params.id, fromDate, toDate);
    const countOrderAllRejected = await order.countOrderCompanyRejected(req.params.id, fromDate, toDate);
    const countOrderAllPending = await order.countOrderCompanyPending(req.params.id, fromDate, toDate);
    const countOrderAllCancelled = await order.countOrderCompanyCancelled(req.params.id, fromDate, toDate);
    const revenueData = await order.getCompanyTotalRevenue(req.params.id, fromDate, toDate);

    let csvData = {
      "total_number_of_orders": countOrderAll,
      "total_number_of_orders_in_progress": countOrderAllInProgess,
      "total_number_of_orders_completed": countOrderAllCompleted,
      "total_number_of_orders_with_issue": countOrderAllIssue,
      "total_number_of_orders_rejected": countOrderAllRejected,
      "total_number_of_orders_in_pending": countOrderAllPending,
      "total_number_of_orders_in_cancelled": countOrderAllCancelled,
      "revenue_of_orders_in_leke": revenueData.length > 0 ? revenueData[0].totalSum: 0
    };

    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });

   res.end(abc);

  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/courier/export-csv/:id", authZ("admin"), async(req, res) => {
  try {
    const order = new Order();
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    const countOrderAll = await order.countOrderCourierInProgess(req.params.id, fromDate, toDate);
    const countOrderAllInProgess = await order.countOrderCourierCompleted(req.params.id, fromDate, toDate);
    const countOrderAllCompleted = await order.countOrderCourierCompleted(req.params.id, fromDate, toDate);
    const countOrderAllIssue = await order.countOrderCourierIssue(req.params.id, fromDate, toDate);
    const countOrderAllRejected = await order.countOrderCourierRejected(req.params.id, fromDate, toDate);
    const countOrderAllPending = await order.countOrderCourierPending(req.params.id, fromDate, toDate);
    const countOrderAllCancelled = await order.countOrderCourierCancelled(req.params.id, fromDate, toDate);
    const revenueData = await order.getCourierTotalRevenue(req.params.id, fromDate, toDate);
    const revenueDataEuro = await order.getCourierTotalRevenueEur(req.params.id, fromDate, toDate);

    let csvData = {
      "total_number_of_orders": countOrderAll,
      "total_number_of_orders_in_progress": countOrderAllInProgess,
      "total_number_of_orders_completed": countOrderAllCompleted,
      "total_number_of_orders_with_issue": countOrderAllIssue,
      "total_number_of_orders_rejected": countOrderAllRejected,
      "total_number_of_orders_in_pending": countOrderAllPending,
      "total_number_of_orders_in_cancelled": countOrderAllCancelled,
      "revenue_of_orders_in_leke": revenueData.length > 0 ? revenueData[0].totalSum: 0,
      "revenue_of_orders_in_euro": revenueDataEuro.length > 0 ? revenueDataEuro[0].totalSum: 0
    };

    let abc = json2csv.parse(csvData);
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-disposition': `attachment; filename="statisc_report.csv"`
    });

   res.end(abc);

  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.post("/create", authZ('admin', 'restaurant', 'company'), async (req, res) => {
  try {
    const order = new Order();
    const product = new Product();
    const client = new Client();
    const company = new Company();
    const restaurant = new Restaurant();
    const offers = new Offer();
    const userToOffer = new UserToOffer();
    let companyFound;

    let clientFound;
    if (req.body.company) {
      clientFound = await client.getClientByPhone(req.body.clientId);
      if (!clientFound && req.body.clientId) {
        clientFound = await client.create({
          firstName: "",
          lastName: "",
          fullName: "",
          phone: req.body.clientId,
          password: "",
          isActive: false,
          virtual: true,
          addresses: [{
              street: req.body.address.street,
              city: req.body.address.city,
              country: req.body.address.country,
              coordinates: {
                  longitude: 0,
                  latitude: 0
              },
              isDefault: true
        }]
        });
      }
    } else {
      clientFound = await client.getClientById(req.body.clientId);
    }
    
    clientFound = JSON.parse(JSON.stringify(clientFound));

    const menu = new Menu();
    const objectId = new ObjectID();

    if(req.body.type == "restaurant") {
      companyFound = await restaurant.getRestaurantById(req.body.companyId);
      
    } else if(req.body.type == "market") {
      companyFound = await company.getCompanyById(req.body.companyId);
    } else if(req.body.type == "company") {
      companyFound = await company.getCompanyById(req.body.companyId);
    }

    let userOffers = [];
    if (clientFound) {
      userOffers = await offers.getOfferByUserId( clientFound._id);
    }
    let hajdeOffers = await offers.getHajdeOffers();
    let companyOffers = await offers.getOfferByCompanyId(req.body.companyId)

   
    const products = [];
    let totalPrice = 0;
    let country = companyFound.phone.includes('+383') ? "Kosovë" : "Shqiperië";
    let address;
    const transport = req.body.transport || 0;

    if (req.body.price && req.body.price > 0) {
      totalPrice = req.body.price;
    } else {
      for(let prod of req.body.products) {

        if(req.body.type == "restaurant") {
          const productFound = await menu.getProductById(prod.product_id);
          if(productFound) {
            products.push({
              productId: productFound._id,
              price: productFound.price,
              quantity: prod.quantity
            })
            totalPrice += (productFound.price * prod.quantity);
          }
          
        } else if(req.body.type == "market") {
          const productFound = await product.getProductById(prod.product_id);
          if(productFound) {
            products.push({
              productId: productFound._id,
              price: productFound.price,
              quantity: prod.quantity
            })
            totalPrice += (productFound.price * prod.quantity);
          }
        }
    
       
      }
    }

    if (req.body.clientId && req.body.address) {
      address = req.body.address;
    }

    let courier;
    if (req.body.courier) {
      courier = req.body.courier;
      courier.courierId = mongoose.Types.ObjectId(courier.courierId);
    }

    let data = {
      _id: objectId,
      isConfirmed: true,
      orderNumber: (100000 + Math.floor(Math.random() * 900000)),
      offerId: req.body.offerId,
      status: "PENDING",
      receiver: {
        firstName: clientFound && clientFound.firstName ? clientFound.firstName : "-",
        lastName: clientFound && clientFound.lastName ? clientFound.lastName : "-",
        receiverId: clientFound && clientFound._id ? clientFound._id: null,
        phone: clientFound && clientFound.phone ? clientFound.phone : null,
      },
      address,
      supplier: {
        supplierId: companyFound._id,
        name: req.body.type == "restaurant" ? companyFound.name  : companyFound.company
      },
      courier: courier,
      products,
      total: totalPrice + transport,
      currency: companyFound.currency,
      clientComment:req.body.clientComment,
      type:req.body.type,
      whoOrder: req.body.whoOrder,
      transport: transport
    }

    for(let offrs of userOffers) {
      
      if(country != offrs.country) continue;
      if(!offrs.isActive) continue;
      if(offrs.hadPerion && dateInPast(offrs.endDate, Date.now())) continue; 
      
      if(data.total >= offrs.amountOffer.minValue) {
        let discountValue = (data.total * offrs.amountOffer.discountAmount / 100);
        if( discountValue > offrs.amountOffer.maxDiscount) {
          if((offrs.isActive)) {
            await userToOffer.createUserToOffer({
              userId: clientFound._id,
              offerId:  offrs._id,
              orderId:  objectId,
              totalBeforeDiscount:data.total ,
              totalAfterDiscount:  data.total - offrs.amountOffer.maxDiscount,
              discount: offrs.amountOffer.maxDiscount
            })
            data.total = data.total - offrs.amountOffer.maxDiscount
          }
         
        } else {
          if((offrs.isActive)) {
            await userToOffer.createUserToOffer({
              userId: clientFound._id,
              offerId:  offrs._id,
              orderId:  objectId,
              totalBeforeDiscount:data.total ,
              totalAfterDiscount:  data.total - discountValue,
              discount:discountValue
            })
            data.total = data.total - discountValue
         }
      }
    }
      
    }


    for(let offrs of hajdeOffers) {
        
        if(country != offrs.country) continue;
        if(!offrs.isActive) continue;
        if(offrs.hadPerion && dateInPast(offrs.endDate, Date.now())) continue; 
        const orderCount = await order.getCountCompeltedOrdersById(clientFound._id);
        const orderCountWeekly = await order.getCountCompletedOrdersByIdWeekly(clientFound._id);
        if(data.total >= offrs.amountOffer.minValue) {

          if(offrs.offerType == "percentDiscount") {
            if(
              (offrs.targetGroup == "activeUsers" && clientFound.isActive) ||
              (offrs.targetGroup == "nonActiveUsers" && orderCount == 0) ||
              (offrs.targetGroup == "newUsers" && orderCount == 0) ||
              (offrs.targetGroup == "activeUserWithOneBuy" && orderCount == 1) ||
              (offrs.targetGroup == "activeUsersWithManyBuysForWeek" && orderCountWeekly >= 1) ||
              (offrs.targetGroup == "activeRepetitiveUsersNonWeekly" && orderCountWeekly == 0) ||
              (offrs.isActive) ||
              (offrs.targetGroup == "allUsers")
            ) {
              let discountValue = (data.total * offrs.amountOffer.discountAmount / 100);
              if( discountValue > offrs.amountOffer.maxDiscount) {
                data.total = data.total - offrs.amountOffer.maxDiscount
                await userToOffer.createUserToOffer({
                  userId: clientFound._id,
                  offerId:  offrs._id,
                  orderId:  objectId,
                  totalBeforeDiscount:data.total ,
                  totalAfterDiscount:  data.total - offrs.amountOffer.maxDiscount,
                  discount: offrs.amountOffer.maxDiscount
                })
              } else {
                await userToOffer.createUserToOffer({
                  userId: clientFound._id,
                  offerId:  offrs._id,
                  orderId:  objectId,
                  totalBeforeDiscount:data.total ,
                  totalAfterDiscount:  data.total - discountValue,
                  discount:discountValue
                })
                data.total = data.total - discountValue
              }
               
            }
          } 

          if(offrs.offerType == "AmountDiscount") {
            if(
              (offrs.targetGroup == "activeUsers" && clientFound.isActive) ||
              (offrs.targetGroup == "nonActiveUsers" && orderCount == 0) ||
              (offrs.targetGroup == "newUsers" && orderCount == 0) ||
              (offrs.targetGroup == "activeUserWithOneBuy" && orderCount == 1) ||
              (offrs.targetGroup == "activeUsersWithManyBuysForWeek" && orderCountWeekly >= 1) ||
              (offrs.targetGroup == "activeRepetitiveUsersNonWeekly" && orderCountWeekly == 0) ||
              (offrs.isActive) ||
              (offrs.targetGroup == "allUsers")
              
            ) {
           
              await userToOffer.createUserToOffer({
                userId: clientFound._id,
                offerId:  offrs._id,
                orderId:  objectId,
                totalBeforeDiscount:data.total ,
                totalAfterDiscount:  data.total - offrs.amountOffer.discountAmount,
                discount: offrs.amountOffer.discountAmount
              })
               data.total = data.total -  offrs.amountOffer.discountAmount
            }
          } 
        
        }
        
      }
      for(let offrs of companyOffers) {
        
        if(country != offrs.country) continue;
        if(!offrs.isActive) continue;
        if(offrs.hadPerion && dateInPast(offrs.endDate, Date.now())) continue; 
        const orderCount = await order.getCountCompeltedOrdersById(clientFound._id);
        const orderCountWeekly = await order.getCountCompletedOrdersByIdWeekly(clientFound._id);
               
        if(data.total >= offrs.amountOffer.minValue) {
          if(offrs.offerType == "percentDiscount") {

            if(
              (offrs.targetGroup == "activeUser" && clientFound.isActive) ||
              (offrs.targetGroup == "nonActiveUsers" && orderCount == 0) ||
              (offrs.targetGroup == "newUsers" && orderCount == 0) ||
              (offrs.targetGroup == "activeUserWithOneBuy" && orderCount == 1) ||
              (offrs.targetGroup == "activeUsersWithManyBuysForWeek" && orderCountWeekly >= 1) ||
              (offrs.targetGroup == "activeRepetitiveUsersNonWeekly" && orderCountWeekly == 0) ||
              (offrs.isActive) ||
              (offrs.targetGroup == "allUsers")
            ) {
              let discountValue = (data.total * offrs.amountOffer.discountAmount / 100);
              if( discountValue > offrs.amountOffer.maxDiscount) {
                await userToOffer.createUserToOffer({
                  userId: clientFound._id,
                  offerId:  offrs._id,
                  orderId:  objectId,
                  totalBeforeDiscount:data.total ,
                  totalAfterDiscount:  data.total - offrs.amountOffer.maxDiscount,
                  discount: offrs.amountOffer.maxDiscount
                })
                data.total = data.total - offrs.amountOffer.maxDiscount
              } else {
                await userToOffer.createUserToOffer({
                  userId: clientFound._id,
                  offerId:  offrs._id,
                  orderId:  objectId,
                  totalBeforeDiscount:data.total ,
                  totalAfterDiscount:  data.total - discountedPrice,
                  discount:discountedPrice
                })
                data.total = data.total - discountedPrice
              }

            }
           
          } 

          if(offrs.offerType == "AmountDiscount") {
            if(
              (offrs.targetGroup == "activeUser" && clientFound.isActive) ||
              (offrs.targetGroup == "nonActiveUsers" && orderCount == 0) ||
              (offrs.targetGroup == "newUsers" && orderCount == 0) ||
              (offrs.targetGroup == "activeUserWithOneBuy" && orderCount == 1) ||
              (offrs.targetGroup == "activeUsersWithManyBuysForWeek" && orderCountWeekly >= 1) ||
              (offrs.targetGroup == "activeRepetitiveUsersNonWeekly" && orderCountWeekly == 0) ||
              (offrs.isActive) ||
              (offrs.targetGroup == "allUsers")
            ) {
              console.log(offrs);
              await userToOffer.createUserToOffer({
                userId: clientFound._id,
                offerId:  offrs._id,
                orderId:  objectId,
                totalBeforeDiscount:data.total ,
                totalAfterDiscount:  data.total - offrs.amountOffer.discountAmount,
                discount: offrs.amountOffer.discountAmount
              })
              data.total = data.total -  offrs.amountOffer.discountAmount
            }
          } 
        }

        if(data.total >=  offrs.productOffer.minValue)  {
          if(offrs.offerType == "ExtraFreeProduct") {
            if(
              (offrs.targetGroup == "activeUsers" && clientFound.isActive) ||
              (offrs.targetGroup == "nonActiveUsers" && orderCount == 0) ||
              (offrs.targetGroup == "newUsers" && orderCount == 0) ||
              (offrs.targetGroup == "activeUserWithOneBuy" && orderCount == 1) ||
              (offrs.targetGroup == "activeUsersWithManyBuysForWeek" && orderCountWeekly >= 1) ||
              (offrs.targetGroup == "activeRepetitiveUsersNonWeekly" && orderCountWeekly == 0) ||
              (offrs.isActive) ||
              (offrs.targetGroup == "allUsers")
            ) {
              if(req.body.type == "restaurant") {
                const productFound = await menu.getProductById(offrs.productOffer.productId);
                if(productFound) {
                  await userToOffer.createUserToOffer({
                    userId: clientFound._id,
                    offerId:  offrs._id,
                    orderId:  objectId,
                    productId: productFound._id,
                  })
                  data.products.push({
                    productId: productFound._id,
                    price: 0,
                    quantity: 1,
                    offerFreeProduct: true
                  })
                  
                }
                
              } else if(req.body.type == "market") {
                const productFound = await product.getProductById(offrs.productOffer.productId);
                if(productFound) {
                  await userToOffer.createUserToOffer({
                    userId: clientFound._id,
                    offerId:  offrs._id,
                    orderId:  objectId,
                    productId: productFound._id,
                  })
                  data.products.push({
                    productId: productFound._id,
                    price: 0,
                    quantity: 1,
                    offerFreeProduct: true
                  })
                 
                }
              }
            }
          }
          
        }
      
      }

    await order.addOrder(data);
    return res.json({
      status:"Sukses",
      message:"Porosia u shtua me suksese",
      
    });

  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      message: error.message
    });
  }
});

function getStatusDescription(status) {
  let description = "";
  
  if (status === "ISSUE") {
    description = "Porosia nuk do te proçesohet";
  } else if (status === "CANCELLED") {
      description = "Porosia u anullua";
  } else if (status === "IN_PROGRESS") {
      description = "Porosia është duke u dërguar";
  } else if (status === "PENDING") {
      description = "Porosia është në pritje";
  } else if (status === "COMPLETED") {
      description = "Porosia u dorëzua";
  } else if (status === "CONFIRM") {
      description = "Porosia filloi të përgatitet";
  } else if (status === "READY") {
      description = "Porosia është gati";
  }

  return description;
}

module.exports = router;