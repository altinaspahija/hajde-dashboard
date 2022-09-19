const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Account = require("../data_access/account_repository");
const Company = require("../data_access/company_repository");
const Restaurant = require("../data_access/restaurant_repository");
const bcrypt = require("bcrypt");
const sendMail = require("./../utilities/send_mail");
const verificationCodeUtils = require("../utilities/verificationCodeUtils");
const speakeasyUtils = require("../utilities/speakeasyUtils");
const logger = require("../../logger");

require("dotenv").config();

const nodeEnv = process.env.ENV_NAME;

/**
 * Login
 */
router.post("/auth", async (req, res) => {
  try {
    logger.info({body: req.body}, "POST: /auth");

    const account =   new Account();
    const accountFound = await account.getAccountByEmail(req.body.email);
    if (accountFound) {
      if (accountFound.isActive === false) {
        logger.info({email: req.body.email}, "User is inactive");

        res.statusCode = 500;
        return res.json({
          status: "Dështuar",
          error: "Përdoruesi nuk është aktiv",
        });
      }

      const passwordVerified = await bcrypt.compare(
        req.body.password,
        accountFound.password
      );

      if (passwordVerified) {
        let accountJson = {};
        if (accountFound.role == "company") {
          let company = new Company();
          let companyID = (
            await company.findCompanyByAccountId(accountFound._id)
          )._id;

          let companyFound = (
            await company.findCompanyByAccountId(accountFound._id)
          );

          const addresses = JSON.parse(JSON.stringify(companyFound.address))

          accountJson = {
            ...accountFound.toJSON(),
            companyId: companyID,
            currencyType: companyFound.currency,
            country: addresses.map(c => c.country),
            city: addresses.map(c => c.city)
          };

        } else if (accountFound.role == "restaurant") {
          let restaurant = new Restaurant();
          let companyID = (
            await restaurant.findRestaurantByAccountId(accountFound._id)
          )._id;
          
          let restaurantFound = (
            await restaurant.findRestaurantByAccountId(accountFound._id)
          );
          
          const addresses = JSON.parse(JSON.stringify(restaurantFound.address))

          accountJson = {
            ...accountFound.toJSON(),
            companyId: companyID,
            currencyType: restaurantFound.currency,
            country: addresses.map(c => c.country),
            city: addresses.map(c => c.city)
          };
        } else {
          accountJson = accountFound.toJSON();
          if (accountJson.country === "" && accountJson.city === "") {
            accountJson.isSuperAdmin = true;
          }
        }

        const token = jwt.sign(JSON.parse(JSON.stringify(accountJson)), process.env.SECRET, { expiresIn: "12h" });
        const fullName = `${accountFound.firstName} ${accountFound.lastName}`;

        let randomNumber;
        if (accountJson.role === "admin" && process.env.LOGIN_VERIFICATION && process.env.LOGIN_VERIFICATION === "true") {

          if (!accountJson.otp) {
            const otpToken =  await speakeasyUtils.generateTempSecret();
            const qrCode = await speakeasyUtils.generateQRCode(otpToken, `Hajde Dashboard ${nodeEnv}`);

            const qrCodeBuffer = Buffer.from(qrCode);
            verificationCodeUtils.insert(accountFound.email, token, otpToken);

            return res.json({
              status: "Sukses",
              otpCode: otpToken.base32,
              qrCode: qrCodeBuffer.toString("base64"),
              next: 'setup-otp'
            });
          } else {
            verificationCodeUtils.insert(accountFound.email, token, 
              {
                base32: accountJson.otp
              }
              );

            return res.json({
              status: "Sukses",
              next: 'otp'
            });
          }
          
        } else {
          return res.json({
            status: "Sukses",
            token: `JWT ${token}`,
          });
        }
      } else {
        res.statusCode = 404;
        return res.json({
          status: "Dështuar",
          error: "Fjalëkalimi është i gabuar",
        });
      }
    } else {
      res.statusCode = 404;
      return res.json({
        status: "Dështuar",
        error: "Përdoruesi nuk ekziston",
      });
    }
  } catch (error) {
    logger.error({error}, "Error when trying to login");

    res.statusCode = 500;
    return res.json({
      status: "Dështuar",
      error: "Gabim në server",
    });
  }
});

/**
 * Forgot password
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const user = new Account();
    const userFound = await user.getAccountByEmail(req.body.email);

    logger.info({email: req.body.email}, "POST: /forgot-password");

    if (userFound == null) {
      return res.status(400).json({
        status: "Deshtuar",
        error: "resetAccountNotFound",
      });
    } else {
      if (userFound.isActive == false) {
        return res.status(500).json({
          status: "Deshtuar",
          error: "Përdoruesit jo aktiv nuk mund të ndryshuar fjalëkalimi",
        });
      } else {
        const token = jwt.sign(userFound.toJSON(), process.env.SECRET, {
          expiresIn: "1h",
        });

        let link = `${req.protocol}://${req.hostname}/reset-password/${token}`;
        let fullName = userFound.firstName + " " + userFound.lastName;
        await sendMail.sendResetPassword(userFound.email, fullName, link);

        return res.status(200).json({
          status: "Success",
          message: "Linku është dërguar me sukses",
        });
      }
    }
  } catch (error) {
    logger.error({error}, "Error when trying to forget password");

    return res.status(500).json({
      status: "Deshtuar",
      error: error,
    });
  }
});

/**
 * Reset password
 */
router.put("/reset-password/:token", async (req, res) => {
  try {
    let newPassword = req.body.newPassword;
    let newConfirmPassword = req.body.newPasswordConfirm;

    logger.info({newPassword, newConfirmPassword}, "PUT: /reset-password/:token");

    if (!newPassword || !newConfirmPassword) {
      return res.status(400).json({
        status: "Deshtuar",
        error: "passwordResetError",
      });
    }

    if (newPassword != newConfirmPassword) {
      return res.status(400).json({
        status: "Deshtuar",
        error: "Fjalëkalimet nuk përputhen",
      });
    }

    jwt.verify(
      req.params.token,
      process.env.SECRET,
      async function (err, userData) {
        if (err) {
          return res.status(500).json({
            status: "Deshtuar",
            error: "err",
          });
        }

        const user = new Account();
        await user.updatePassword(userData._id, newPassword);
        let fullName = userData.firstName + " " + userData.lastName;
        await sendMail.sendSuccessResetPass(userData.email, fullName);

        return res.status(200).json({
          status: "Success",
          message: "success",
        });
      }
    );
  } catch (error) {
    logger.error({error}, "Error when trying to reset password");

    return res.status(500).json({
      status: "Deshtuar",
      error: error,
    });
  }
});

/**
 * Verify login
 */
 router.post("/verify-login", async (req, res) => {
  try {
    const user = new Account();

    const email = req.body.email;
    const code = req.body.code;
    const otpCode = req.body.otpCode;

    logger.info({ email, code, otpCode }, "POST: /verify-login");

    if (!email) {
      throw new Error("Email- kerkohet !");
    }
      if (!code) {
      throw new Error("Kodi verifikues- kerkohet !");
    }

    const item = verificationCodeUtils.getItem(email);
    if (!item) {
      throw new Error("Kodi juaj ka skaduar, ju lutemi provoni prap !");
    }
  
    const secret = item.code.base32;
    
    const response = await speakeasyUtils.verifyOtp(secret, code);
    if (response && otpCode === secret) {
      await user.updateOtp(item.email, secret);
    }

    if (response) {
      return res.json({
        status: "Sukses",
        token: `JWT ${item.token}`
      });
    } else {
      throw new Error("Kodi juaj është gabim ose ka skaduar, ju lutemi provoni prap !");
    }
    

  } catch (error) {
    logger.error({error}, "Error when trying to verify login");

    return res.status(500).json({
      status: "Deshtuar",
      error: error.message,
    });
  }
 });

router.get("/login-verification", (req, res) => {
  return res.json({ loginVerification: process.env.LOGIN_VERIFICATION || true });
});


module.exports = router;
