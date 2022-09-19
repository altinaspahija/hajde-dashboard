const { Strategy, ExtractJwt } = require('passport-jwt');
const Account = require('../data_access/account_repository');
const Company = require('../data_access/company_repository');
const Restaurant = require("../data_access/restaurant_repository");
require('dotenv').config();
const account = new Account();
const company = new Company();

module.exports = passport => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET
  };
  passport.use(new Strategy(opts, (jwtPayload, done) => {
    account.getAccountById(jwtPayload._id)
      .then(async accountData => {
        if (accountData.role === 'company') {
          const currentCompany = await company.getCompanyById(jwtPayload.companyId);
          return !accountData ? done(null, false) : done(null, { ...accountData.toJSON(), currencyType: currentCompany.currency, companyId: jwtPayload.companyId, });
        } else if(accountData.role === 'restaurant') {
          let restaurant = new Restaurant();
          let currentCompany = await restaurant.findRestaurantByAccountId(accountData._id);
          return !accountData ? done(null, false) : done(null, { ...accountData.toJSON(), currencyType: currentCompany.currency, companyId: jwtPayload.companyId, });
        } else {
          return !accountData ? done(null, false) : done(null, { ...accountData.toJSON() });
        }
      })
      .catch(error => {
        console.log(error);
        done(error, false);
      });
  }));
};
