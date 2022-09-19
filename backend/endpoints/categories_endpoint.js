const express = require('express');
const router = express.Router();
const authZ = require('../middlewares/authorization');
const Categories = require('../data_access/categories_repository');
const ProductCategories = require('../data_access/product_category_repository');
//

router.get('/:id', authZ('company','admin', 'restaurant'), async (req, res) => {
  try {
    const category = new Categories();
    const categories = await category.getCategoriesById(req.params.id);
    res.json(categories)
  } catch(error){
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
});

router.get('/', authZ('company','admin', 'restaurant'), async (req, res) => {
  try {
    const category = new Categories();
    let page = req.query.page == 0 || req.query.page == undefined ? '' : req.query.page;
    let status = req.query.status != undefined && req.query.status != "" ? req.query.status : undefined;
    let categories;
    if(page){
      categories = await category.getAllCategories(page, 15, status);
    } else {
      const category = new ProductCategories();
      categories = await category.getAllCategories();
    }
    res.json(categories);
  } catch(error){
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

router.post('/', authZ('company','admin', 'restaurant'), async (req, res) => {
    try {
      const category = new Categories();
      const categories = await category.createCategories(req.body);
      res.json({
        categories: categories
      })
    } catch(error){
      res.statusCode = 500;
      return res.json({
        status:"Dështuar",
        error: "Gabim në server"
      });
    }
  })

  router.put('/:id', authZ('company','admin', 'restaurant'), async (req, res) => {
    try {
      const category = new Categories();
      console.log('body', req.body)
      const categories = await category.updateCategories(req.params.id, req.body);
      res.json({
        categories: 'Kategoria u modifikua'
      })
    } catch(error){
      res.statusCode = 500;
      return res.json({
        status:"Dështuar",
        error: "Gabim në server"
      });
    }
  })

  router.put('/status/:id', authZ('company','admin', 'restaurant'), async (req, res) => {
    try {
      const category = new Categories();
      console.log(req.body)
      const categories = await category.updateCategoryStatus(req.params.id, req.body);
      res.json({
        categories: 'Statusi i kategoris u modifikua'
      });
    } catch (error) {
      res.statusCode = 500;
      return res.json({
        status:"Dështuar",
        error: "Gabim në server"
      });
    }
  })

  router.delete('/:id', authZ('company','admin', 'restaurant'), async (req, res) => {
    try {
      const category = new Categories();
      const categories = await category.deleteCategoriesById(req.params.id);
      res.json({
        categories: 'Kategoria u fshi'
      })
    } catch(error){
      res.statusCode = 500;
      return res.json({
        status:"Dështuar",
        error: "Gabim në server"
      });
    }
  })

router.get('/type/:type', authZ('admin'), async (req, res) => {
  try {
    const category = new ProductCategories();
    let categories = await category.getAllCategoriesByType(req.params.type);

    res.json(categories);
  } catch(error){
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

module.exports = router;