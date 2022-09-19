const express = require('express');

const router = express.Router();

const accountEndpoint = require('./account_endpoint');
const authEndpoint = require('./auth_endpoint');
const companyEndpoint = require('./company_endpoint');
const courierEndpoint = require('./courier_endpoints');
const clientEndpoint = require('./client_endpoint');
const orderEndpoint = require('./order_endpoint');
const productEndpoint = require('./product_endpoint');
const importerEndpoint = require('./importer_endpoint');
const categoryEndpoint = require('./category_endpoint');
const categoriesEndpoint = require('./categories_endpoint');
const companyCategoryEndpoint = require("./company_category_endpoint");
const restaurantEndpoint = require("./restaurant_endpoint");
const menuEndpoint = require('./menu_endpoint');
const notificationEndpoint = require('./notification_endpoint');
const bannerEndpoint = require('./banner_endpoint');
const offers = require('./offer_endpoint');
const countries = require("./countries_endpoint");
const passport = require('passport');
const authN = passport.authenticate('jwt', { session: false });

router.use('/', authEndpoint);
router.use('/accounts', authN, accountEndpoint);
router.use('/companies', authN, companyEndpoint);
router.use('/restaurants', authN, restaurantEndpoint);
router.use('/couriers', authN, courierEndpoint);
router.use('/clients', authN, clientEndpoint);
router.use('/orders', authN, orderEndpoint);
router.use('/products', authN, productEndpoint);
router.use('/menus', authN, menuEndpoint);
router.use('/importer', authN, importerEndpoint);
router.use('/category', authN, categoryEndpoint);
router.use('/categories', authN, categoriesEndpoint);
router.use('/company-category', authN, companyCategoryEndpoint);
router.use('/notifications', authN, notificationEndpoint);
router.use(`/banners`, authN, bannerEndpoint);
router.use(`/offers`, authN, offers);
router.use(`/countries`, authN, countries);

module.exports = router;
