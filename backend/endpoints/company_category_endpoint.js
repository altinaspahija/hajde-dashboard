const express = require('express')
const router = express.Router()
const authZ = require('../middlewares/authorization');
const CompanyCategory = require('../../backend/data_access/company_category_repository');

router.get('/list/:companyId', authZ('admin'), async (req, res) => {
  try {
    const companyCategory = new CompanyCategory();
    let page = req.query.page == 0 || req.query.page == undefined ? 1 : req.query.page;
    let name = req.query.name;
    let status = req.query.status;
    const result = await companyCategory.getCategories(req.params.companyId, page, 15, name, status);
    
    res.json(result);
  } catch(error) {
    res.statusCode = 500
    console.log(error);
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
});

router.get('/getAll/:companyId', authZ('admin', "company", 'restaurant'), async (req, res) => {
  try {
    const companyCategory = new CompanyCategory();
    const result = await companyCategory.getAllCategoriesOfCompany(req.params.companyId,);
    
    res.json(result);
  } catch(error) {
    res.statusCode = 500
    console.log(error);
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
});


router.put('/changeStatus/:categoryId', authZ("admin"), async (req, res) => {
  try {
    const companyCategory = new CompanyCategory();
    await companyCategory.changeStatus(req.params.categoryId, req.body.status)
    res.json({
      status: 'Sukses',
      message: "Statusi është ndryshuar me suskses"
    })
  } catch(error) {
    res.statusCode = 500
    return res.json({
      status: 'Dështuar',
      error: 'Gabim në server'
    })
  }
})

module.exports = router;