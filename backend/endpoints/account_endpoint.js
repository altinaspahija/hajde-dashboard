const express = require("express");
const router = express.Router();
const Account = require("../data_access/account_repository");
const bcrypt = require("bcrypt");
const authZ = require("../middlewares/authorization");

require('dotenv').config();

/**
 * Change account password
 */
router.put("/change-password", authZ("admin","company", "restaurant"), async (req, res) => {
  try {
    const account = new Account();
    const accountFound = await account.getAccountById(req.user._id);
    if(accountFound) {
      const oldPasswordVerified = await bcrypt.compare(req.body.oldPassword, accountFound.password);

      if(oldPasswordVerified) {
        await account.updatePassword(accountFound._id, req.body.password);
        return res.status(200).json({
          status:"Sukses",
          message:"Fjalëkalimi u ndryshua me sukses"
        });
      } else {
        res.statusCode = 404
        return res.json({
            status:"Dështuar",
            error:"Fjalëkalimi është i gabuar"
        });
      }

    } else {
      res.statusCode = 404
      return res.json({
          status:"Dështuar",
          error:"Përdoruesi nuk ekziston"
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

/**
 * Update account
 */
router.put("/update", authZ("admin", "company", "restaurant"), async (req, res) => {
  try {
    const account = new Account();
    const accountFound = await account.getAccountById(req.user._id);
    if(accountFound) {
      await account.updateInfo(accountFound._id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      return res.status(200).json({
        status:"Sukses",
        message:"Informatat e përdoruesit u ndryshuan me sukses"
      });
    } else {
      res.statusCode = 404;
      return res.json({
          status:"Dështuar",
          error:"Përdoruesi nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.st.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

/**
 * Find account by id
 */
router.get("/:id", authZ("admin", "company", "restaurant"), async (req, res) => {
  try {
    const account = new Account();
    const accountFound = await account.getAccountById(req.user._id);
    if(accountFound) {
      return res.status(200).json({
        status:"Sukses",
        account:accountFound
      });
    } else {
      res.statusCode = 404;
      return res.json({
          status:"Dështuar",
          error:"Përdoruesi nuk ekziston"
      });
    }
  } catch(error) {
    res.statusCode = 500;
    return res.st.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

module.exports = router;