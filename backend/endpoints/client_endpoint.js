const express = require('express')
const router = express.Router()
const Client = require('../data_access/client_repository')
const authZ = require('../middlewares/authorization')
const Order = require('../data_access/order_repository')
const json2csv = require('json2csv');

router.delete('/delete/:id', authZ('admin'), async (req, res) => {
  try {
    const client = new Client()
    const clientFound = await client.getClientById(req.params.id)
    const order = new Order()
    const orderCount = await order.getOrdersCountOfClient(req.params.id)

    if (clientFound) {
      if (orderCount === 0) {
        await client.deleteClient(req.params.id)
        return res.json({
          status: 'Sukses',
          message: 'Klienti është fshirë me sukses'
        })
      } else {
        return res.status(400).json({ status: 'Gabim', error: 'Klienti nuk mund te fshihet sepse ka porosi' })
      }
    } else {
      res.statusCode = 404
      return res.json({
        status: 'Dështuar',
        message: 'Klienti nuk ekziston'
      })
    }
  } catch (error) {
    res.statusCode = 500
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
})

router.put('/change-status/:id', authZ('admin'), async (req, res) => {
  try {
    const client = new Client();
    const clientFound = await client.getClientById(req.params.id);

    if (clientFound) {
      await client.changeClientStatus(req.params.id, req.body.status)
      return res.json({
        status: 'Sukses',
        message: 'Klientit statusi është ndryshuar me sukses'
      })
    } else {
      res.statusCode = 404
      return res.json({
        status: 'Dështuar',
        message: 'Klienti nuk ekziston'
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
    const client = new Client();

    const city = req.user.city;
    const country = req.user.country;

    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page
    const name = req.query.name
    const phone = req.query.phone
    const status = req.query.status !== undefined && req.query.status !== '' ? req.query.status : undefined;

    let result = await client.listAllPaginate(page, 15, name, status,phone, country, city);
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
    const client = new Client();

    const city = req.user.city;
    const country = req.user.country;

    const page = req.query.page === 0 || req.query.page === undefined ? 1 : req.query.page
    const name = req.query.name
    const phone = req.query.phone
    const status = req.query.status !== undefined && req.query.status !== '' ? req.query.status : undefined;

    let result = await client.listAllExport(page, 15, name, status,phone, country, city);
    let clients = result.clients.map(e => {
      let elem = {
        id: e._id,
        firstName: e.firstName,
        lastName: e.lastName,
        phone: e.phone,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        isVerified: e.isVerified,
        isActive: e.isActive,
        'addresses':''
      }

      e.addresses.map((el,i) => {
        elem['addresses'] += `${el.street} ${el.city} ${el.country}  Lat: ${el.coordinates.latitude} Long: ${el.coordinates.longitude} | `
      }) 
      return elem;
    });

    if(clients.length == 0) {
      clients.push({
        id: "",
        firstName: "",
        lastName: "",
        phone: "",
        createdAt: "",
        updatedAt: "",
        isVerified: "",
        isActive: "",
        'addresses':''
      })
    }

     let abc = json2csv.parse(clients);
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
    const client = new Client();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await client.countTotalClient(country, city);
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
    const client = new Client();
    
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await client.countActiveClient(country, city);
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
    const client = new Client();

    const city = req.user.city;
    const country = req.user.country || req.query.country;

    const count = await client.countInactiveClient(country, city);
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
router.get("/all", authZ("admin", 'restaurant'), async (req, res) => {
  try {
    const client = new Client();
    
    const city = req.user.city;
    const country = req.user.country || req.query.country;

    let count = [];
    if (req.user.role == 'restaurant') {
      count = await client.getClientsByRestaurant(req.user.companyId, country, city)
    } else {
      count = await client.getAll(req.user.country)
    }

    const clients = count.map(e => {
      e.fullName = `${e.phone} - ${e.fullName}`;
      return e;
    })
    return res.json({
      status: 'Sukses',
      clients: clients
    });
  } catch(err) {
    res.statusCode = 500;
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    });
  }
})
router.get("/:id", authZ("admin"), async(req, res) => {
  try {
    
    let client = new Client();
    let clientFound = await client.getClientById(req.params.id);
  
    if(clientFound) {
      return res.json({
        status:"Sukses",
        courier:clientFound
      });
    } else {
      res.statusCode = 404;
      return res.json({
          status:"Dështuar",
          error:"Klienti nuk ekziston"
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

router.get("/get-client-by-phone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const clientRepository = new Client();

    const user = await clientRepository.findUserByPhone(phone);
    return res.json(user);

  } catch (error) {
    logger.error({error}, "Error when trying to verify login");

    return res.status(500).json({
      status: "Deshtuar",
      error: error.message,
    });
  }
});

module.exports = router;