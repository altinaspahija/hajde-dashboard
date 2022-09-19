const express = require('express');
const router = express.Router();
const authZ = require('../middlewares/authorization');
const Category = require('../data_access/product_category_repository');
const Subcategory = require('../data_access/product_subcategory_repository');
// 

router.get('/:type', authZ('company','admin', 'restaurant'),async (req, res) => {
  try {
    const category = new Category();
    console.log("test =>")
    const categories = await category.getAllCategories(req.params.type);
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
});

router.get('/:id/subcategories/:type',authZ('company','admin', 'restaurant'), async (req, res) => {
  try {
    const category = new Subcategory();
    const categories = await category.getAllSubcategories(req.params.id, req.params.type);
    res.json({
      subcategories: categories
    })
  } catch(error){
    res.statusCode = 500;
    return res.json({
      status:"Dështuar",
      error: "Gabim në server"
    });
  }
})

module.exports = router;