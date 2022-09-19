const express = require("express");
const router = express.Router();
const Courier = require("../data_access/courier_repository");
const authZ = require("../middlewares/authorization");
const Order = require("../data_access/order_repository");
const json2csv = require('json2csv');

router.post("/create", authZ("admin"), async (req, res) => {
    try {
      let courier = new Courier();
      let courierFound = await courier.getCourierByPhone(req.body.phone);
      
      if(!courierFound) {
        await courier.createCourier(req.body);
        return res.json({
          status:"Sukses",
          error:"Korieri është krijuar me sukses"
        });
      } else {
        res.statusCode = 500;
        return res.json({
            status:"Dështuar",
            error:"Korieri me këtë numër telefoni ekziston"
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


router.put("/update/:id", authZ("admin"), async (req, res) => {
  try {
    let courier = new Courier();
    let courierFound = await courier.getCourierById(req.params.id);
    let courierPhoneFound = await courier.getCourierByPhone(req.body.phone);
    if(courierFound) {

      if(courierFound.phone != req.body.phone && courierPhoneFound != null) {
        res.statusCode = 500
        return res.json({
          status: "Dështuar",
          error: "Korieri me këtë numër telefoni ekziston"
        });
      }

      await courier.updateCourier(req.params.id,req.body);
        return res.json({
          status:"Sukses",
          error:"Korieri është ndryshuar me sukses!"
        });
      
    } else {
      res.statusCode = 404;
      return res.json({
          status:"Dështuar",
          error:"Korieri nuk ekziston"
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


router.delete('/delete/:id', authZ('admin'), async (req, res) => {
  try {
    const courier = new Courier()
    const order = new Order()
    const courierFound = await courier.getCourierById(req.params.id)
    const orderCount = await order.getOrdersCountOfCourier(req.params.id)
    if (courierFound) {
      if (orderCount === 0) {
        await courier.deleteCourier(req.params.id)
        return res.json({
          status: 'Sukses',
          message: 'Korieri është fshirë me sukses'
        })
      } else {
        return res.status(400).json({ status: 'Gabim', error: 'Korieri nuk mund te fshihet sepse ka porosi' })
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: 'Dështuar',
        message: 'Korieri nuk ekziston'
      })
    }
  } catch (error) {
    res.statusCode = 500
    return res.st.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
})

router.put('/change-status/:id', authZ('admin'), async (req, res) => {
  try {
    const courier = new Courier()
    const courierFound = await courier.getCourierById(req.params.id)

    if (courierFound) {
      await courier.changeCourierStatus(req.params.id, req.body.status)
      return res.json({
        status: 'Sukses',
        message: 'Korierit statusi është ndryshuar me sukses'
      })
    } else {
      res.statusCode = 404
      return res.json({
        status: 'Dështuar',
        message: 'Korieri nuk ekziston"'
      })
    }
  } catch (error) {
    res.statusCode = 500
    return res.st.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
})

router.get('/list', authZ('admin'), async function (req, res) {
  try {
    const courier = new Courier()

    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page;
    const name = req.query.name;
    const itemPerPage = req.query.itemPerPage || 15;
    const phone = req.query.phone;
    const status = req.query.status !== undefined && req.query.status !== '' ? req.query.status : undefined;

    const result = await courier.listAllPaginate(page, parseInt(itemPerPage), name, status, phone, req.user.country)
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


router.post('/export-list', authZ('admin'), async function (req, res) {
  try {
    const courier = new Courier()

    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page
    const name = req.query.name
    const phone = req.query.phone
    const status = req.query.status !== undefined && req.query.status !== '' ? req.query.status : undefined

    const result = await courier.listAllExport(page, 15, name, status, phone, req.user.country)
    let  couriers = result.couriers.map(e => {
      return {
        id : e._id,
        courierId : e.courierId,
        firstName: e.firstName,
        lastName: e.lastName,
        phone: e.phone,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt, 
      }
    });
    if(couriers.length == 0) {
      couriers.push({
        id : "",
        courierId : "",
        firstName: "",
        lastName: "",
        phone: "",
        createdAt: "",
        updatedAt: "", 
      })
    }

    let abc = json2csv.parse(couriers);
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

router.get('/countTotal', authZ('admin'), async function (req, res) {
  try {
    const courier = new Courier();
    const country = req.query.country || req.query.country;
    const count = await courier.courierTotalCount(country);
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

router.get('/countActive', authZ('admin'), async function (req, res) {
  try {
    const courier = new Courier();
    const country = req.query.country || req.query.country;
    const count = await courier.courierActiveCount(country);

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
    const courier = new Courier();
    const country = req.query.country || req.query.country;

    const count = await courier.courierInactiveCount(country);

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

router.get("/:id", authZ("admin"), async(req, res) => {
  try {
    
    let courier = new Courier();
    let courierFound = await courier.getCourierById(req.params.id);
  
    if(courierFound) {
      return res.json({
        status:"Sukses",
        courier:courierFound
      });
    } else {
      res.statusCode = 404;
      return res.json({
          status:"Dështuar",
          error:"Korieri nuk ekziston"
      });
    }

  } catch(error) {
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});



module.exports = router;