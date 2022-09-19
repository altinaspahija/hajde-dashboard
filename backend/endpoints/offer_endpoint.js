const express = require('express');
const router =  express.Router();
const Offer = require('../data_access/offer_repository');
const Order = require('../data_access/order_repository');
const authZ = require('../middlewares/authorization');
const socketConnection = require("../config/socket");
const notificationTypes = require("../config/constants");
const numberUtils = require("../utilities/randomNumber");

router.get("/potential-winners", authZ("admin"), async(req, res) => {
  try {
    const order = new Order();    
    
    const from = req.query.from;  
    const to = req.query.to;  
    const country = req.query.country;  
    const minimumValue = req.query.minimumValue;

    if (!from) {
      throw new Error("From period is missing");
    }
    if (!to) {
      throw new Error("To period is missing");
    }
    if (!country) {
      throw new Error("Country period is missing");
    }
    if (!minimumValue) {
      throw new Error("Minimum value period is missing");
    }

    const potentialWinners = await order.getPotentialWinners(from, to, country, minimumValue);
    const random = numberUtils.randomIntFromInterval(0, potentialWinners.length);

    return res.json({
      winner: potentialWinners[random]._id
    });
  }
  catch (err) {
    res.statusCode = 500;
    console.log(err);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})

router.post('/create', authZ('admin'), async (req, res) => {
  try {
    const offer = new Offer();  
    let result = await offer.createOffer(req.body);
   
    res.json({
      success: true,
      message: 'Oferta u krijua'
    });
  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: error.message
    });
  }
})

router.put('/:id/change-status', authZ('admin'), async (req, res) => {
  try {
    const offer = new Offer();  
    await offer.changeStatus(req.params.id, req.body.status);
    res.json({
      success: true,
      message: 'Statusi u ndryshia'
    });
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
})

router.put('/:id/update', authZ('admin'), async (req, res) => {
  try {
    const offer = new Offer();  
    await offer.updateOffer(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Oferta u ndryshua me sukses'
    });
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
})

router.delete('/:id/delete', authZ('admin'), async (req, res) => {
  try {
    const offer = new Offer();  
    await offer.deleteById(req.params.id);
    res.json({
      success: true,
      message: 'Oferta ështe fshirë me sukses'
    });
  } catch(error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: err.message
    });
  }
})





router.get("/list", authZ("admin"), async function (req, res) {
  try {
    const offer = new Offer();
    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let offerType = req.query.offerType;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    
    let result = await offer.listAllPaginate(page, 15, offerType, status, fromDate, toDate, req.user.country);
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

router.get('/:id', authZ('admin'), async (req, res) => {
  try {
    const offer = new Offer();    
    let result = await offer.getOfferById(req.params.id);
    return res.json({
      offer: result
    });
  }
  catch (err) {
    res.statusCode = 500;
    console.log(err);
    return res.json({
      status: "Dështuar",
      error: "Gabim në server"
    });
  }
})


module.exports = router;