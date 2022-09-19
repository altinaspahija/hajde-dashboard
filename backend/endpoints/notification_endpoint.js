const express = require("express");
const router = express.Router();
const Notification = require("../data_access/notification_repository");
const { pushNotification } = require("../utilities/notification");
const authZ = require("../middlewares/authorization");
const Client = require("../data_access/client_repository");

router.put("/set-seen/:id", authZ("admin"), async (req, res) => {
  try {
    const notificationRep = new Notification();
    console.log(req.params.id);
    const not = await notificationRep.getNotificationById(req.params.id);
    console.log(not);
    if (not) {
      if (not.isSeen == false)
        await notificationRep.setSeenNotification(req.params.id);

      return res.json({
        status: "Sukses",
        message: "Notifikacioni është shikuar",
      });
    } else {
      res.statusCode = 404;
      return res.json({
        status: "Informat",
        error: "Notifikacioni nuk ekziston",
      });
    }
  } catch (error) {
    console.log(error);

    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server",
    });
  }
});

router.get("/list", authZ("admin"), async (req, res) => {
  try {
    const notificationRep = new Notification();
    let notifications = await notificationRep.getAdminNotification();
    let nts = notifications.length > 0 ? notifications : [];
    return res.json({
      status: "Sukses",
      notifications: nts,
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server",
    });
  }
});

router.get("/count", authZ("admin"), async (req, res) => {
  try {
    const notificationRep = new Notification();
    let count = await notificationRep.getCountSeenNotification();
    const cnts = count == 0 ? 0 : count;
    return res.json({
      status: "Sukses",
      count: cnts,
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server",
    });
  }
});

// router.post("/send-notification", authZ("admin"), async (req, res) => {
//   try {
//     const client = new Client();

//     const body = req.body;
//     if (body.senderType === "targetGroup") {
//       const targetGroups = 
//     } else if (body.senderType === "specificClient") {
//       const tokens = await client.getTokensByPhone(body.client);

//       await pushNotification(body.client, tokens, body.title, body.description);
//     } else {
//       return res.status(400).send({
//         status: "Notification u dergua",
//         success: true,
//       });
//     }

//     return res.json({
//       status: "Notification u dergua",
//       success: true,
//     });
//   } catch (error) {
//     res.statusCode = 500;
//     return res.json({
//       status: "Dështuar",
//       error: "Gabim në server",
//     });
//   }
// });

module.exports = router;
