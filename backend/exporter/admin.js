// Filling the user object with superadmin values

(async () => {
  try {
      const mongoose = require('mongoose');
      const User = require('../data_access/account_repository');

      // Loading Configuration
      require('dotenv').config();

      // Connecting to database
      mongoose.Promise = global.Promise;
      mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify:false})
          .then(() => {
              console.log("Connected to database");
          }).catch(err => {
          console.log("Error while database connection: " + err);
      });
      const userData = {
          firstName:"Barlet",
          lastName:"Bajra",
          email: "barlet.bajra@gmail.com",
          password: "12345678",
          role: "admin",
          isActive: true,
          country: "Kosovë", // Kosovë, Shqiperië
      };
      const user = new User();

      const userExsist = await user.getAccountByEmail(userData.email);
      if(!userExsist) {
          await user.createAccount(userData);
          console.log("Account created");
      } else {
          console.log("Account exsist");
      }
  } catch (e) {
      console.log(e);
  }
})();
